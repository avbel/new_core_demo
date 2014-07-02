"use strict";
let loader = require("./loader");
let PluginHelper = require("./pluginHelper");

module.exports = function*(){
  // load package.json of current project
  let packageFile = loader.loadPackageFile();

  //load config provider
  let configProvider = loader.loadModule("labs-config-");

  //load app backend
  let appBackend =  loader.loadModule("labs-app-");

  //creating config provider
  const config = yield configProvider.exports();

  //creating backend
  const backend = {
    name: appBackend.name,
    instance: yield appBackend.exports(config),
    version: appBackend.version
  };

  // filling app info
  const app = {
    name: packageFile.name,
    version: packageFile.version
  };

  //loading and running plugins
  yield PluginHelper.runPlugins(backend, app, config);
};