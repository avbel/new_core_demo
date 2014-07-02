"use strict";
let logger = require("./defaultLogger");
let loader = require("./loader");
let q = require("q");

let runningPlugins = {};
let afterRunningPluginsGenerators = [];
let plugins = [];

function resolve (name) {
  let matching = plugins.filter(function(plugin){ return plugin.name == name;});

  if (matching.length === 0){
    throw new Error("Unresolved dependency '" + name + "'");
  }
  return matching[0];
}

function PluginHelper(plugin, app){
  this.version = plugin.version;
  this.name = plugin.name;
  this.app = app;
  this.logger = logger;
}

PluginHelper.prototype.dependency = function*(dependencies){
  // load dependencies
  let array = Array.isArray(dependencies);
  let app = this.app;

  dependencies = array ? dependencies : [dependencies];
  // Promises are used to ensure that all plugins in the dependency chain have
  // finished loading. The first yield returns an array of promises, the second
  // returns their resolutions.
  //
  // FIXME: this is probably susceptible to deadlock -- should probably
  // implement some sort of cycle detection.
  dependencies = yield yield dependencies.map(function(p){
    return PluginHelper.runPlugin(resolve(p), app);
  });
  return array ? dependencies : dependencies[0];
};

PluginHelper.prototype.after = function(after){
  // call 'after' after all plugins loaded and processed
  afterRunningPluginsGenerators.push(after);
};


PluginHelper.runPlugin = function*(plugin, app){
  if(!runningPlugins[plugin.name]){
    let deferred = q.defer();
    runningPlugins[plugin.name] = deferred.promise;
    try{
      let helper = new PluginHelper(plugin, app)
      //run exported function of plugin
      deferred.resolve(yield plugin.exports(helper));
    }
    catch(err){
      logger.error("Couldn't run plugin \"%s\": %s", plugin.name, err.message || err);
      logger.debug(err.stack);
      deferred.reject(err);
    }
  }
  return runningPlugins[plugin.name];
};


PluginHelper.runPlugins = function*(app){
  //load all plugins modules
  plugins = loader.loadAllModules("labs-plugin-").concat(app);
  // and then run them
  yield plugins.map(function(plugin){
    return PluginHelper.runPlugin(plugin, app);
  });
  yield afterRunningPluginsGenerators;
};


module.exports = PluginHelper;
