"use strict";
let ConfigDecorator = require("./configDecorator");
let defaultPluginConfigProvider = require("./defaultPluginConfigProvider");
let logger = require("./defaultLogger");
let loader = require("./loader");

let runningPlugins = {};
let afterRunningPluginsGenerators = [];
let plugins = [];

function PluginHelper(plugin, backend, app, config, parentConfig){
  this.version = plugin.version;
  this.name = plugin.name;
  this.config = config;
  this.backend = backend;
  this.app = app;
  this.logger = logger;
}

PluginHelper.prototype.dependency = function*(dependencies){
  // load dependencies
  dependencies = (Array.isArray(dependencies)?dependencies:[dependencies]);
  yield dependencies.map(function(p){
    return PluginHelper.runPlugin(plugins.filter(function(plugin){ return plugin.name == p;})[0], this.backend, this.app, this.parentConfig);
  }.bind(this));
};

PluginHelper.prototype.after = function(after){
  // call 'after' after all plugins loaded and processed
  afterRunningPluginsGenerators.push(after);
};


PluginHelper.runPlugin = function*(plugin, backend, app, config){
  if(!plugin){
    return;
  }
  if(runningPlugins[plugin.name]){
    return; //don't run twice
  }
  runningPlugins[plugin.name] = true;
  try{
    //create plugin specific config provider instance
    let pluginConfig;
    if(plugin.exports.configProvider){ // custom config provider support by plugins
      pluginConfig = yield plugin.exports.configProvider(config);
    }
    else{
      pluginConfig = yield defaultPluginConfigProvider(plugin, config);
    }

    pluginConfig = new ConfigDecorator(pluginConfig, config); // all missing keys in plugin config will be seached in parent config
    let helper = new PluginHelper(plugin, backend, app, pluginConfig, config)
    //run exported function of plugin
    yield plugin.exports(helper);
  }
  catch(err){
    logger.error("Couldn't run plugin \"%s\": %s", plugin.name, err.message || err);
    logger.debug(err.stack);
  }
};


PluginHelper.runPlugins = function*(backend, app, config){
  //load all plugins modules
  plugins = loader.loadAllModules("labs-plugin-");
  // and then run them
  yield plugins.map(function(plugin){
    return PluginHelper.runPlugin(plugin, backend, app, config);
  });
  yield afterRunningPluginsGenerators;
};


module.exports = PluginHelper;