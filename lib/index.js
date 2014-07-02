"use strict";
let loader = require("./loader");
let PluginHelper = require("./pluginHelper");

module.exports = function*(){
  let packageFile = loader.loadPackageFile();
  let configProvider = loader.loadModule("labs-config-");
  let appBackend =  loader.loadModule("labs-app-");

  let config = yield configProvider.exports();
  let backend = {
    name: appBackend.name,
    instance: yield appBackend.exports(config),
    version: appBackend.version
  };
  let app = {
    name: packageFile.name,
    version: packageFile.version
  };

  yield PluginHelper.runPlugins(backend, app, config);
};