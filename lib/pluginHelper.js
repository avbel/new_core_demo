"use strict";
let Q = require("q");
let loader = require("./loader");

let runningPlugins = {};
let afterRunningPluginsGenerators = [];
let plugins = [];

function PluginHelper(plugin, container){
  this.version = plugin.version;
  this.name = plugin.name;
  this.container = container;
  this.app = container.resolve("appInfo");
  this.logger = container.resolve("logger");
}

PluginHelper.prototype.dependency = function*(dependencies){
  // load dependencies
  dependencies = (Array.isArray(dependencies)?dependencies:[dependencies]);
  yield dependencies.map(function(p){
    return PluginHelper.runPlugin(plugins.filter(function(plugin){ return plugin.name == p;})[0], this.app);
  }.bind(this));
};

PluginHelper.prototype.after = function(after){
  // call 'after' after all plugins loaded and processed
  afterRunningPluginsGenerators.push(after);
};


PluginHelper.runPlugin = function*(plugin, container){
  if(!plugin){
    return;
  }
  let promise = runningPlugins[plugin.name];
  if(promise){
    yield promise;
    return;
  }
  let deferred = Q.defer();
  runningPlugins[plugin.name] = deferred.promise;
  try{

    let helper = new PluginHelper(plugin, container)
    //run exported function of plugin
    yield plugin.exports(helper);
    deferred.resolve();
  }
  catch(err){
    let logger = container.resolve("logger");
    logger.error("Couldn't run plugin \"%s\": %s", plugin.name, err.message || err);
    logger.debug(err.stack);
    deferred.reject(err);
  }
};


PluginHelper.runPlugins = function*(container){
  //load all plugins modules
  plugins = loader.loadAllModules("labs-plugin-");
  // and then run them
  yield plugins.map(function(plugin){
    return PluginHelper.runPlugin(plugin, container);
  });
  yield afterRunningPluginsGenerators;
};


module.exports = PluginHelper;