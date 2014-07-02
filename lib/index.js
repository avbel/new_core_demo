"use strict";
let loader = require("./loader");
let PluginHelper = require("./pluginHelper");

module.exports = function*(){
  // load package.json of current project
  let packageFile = loader.loadPackageFile();

  // filling app info
  let app = {
    name: packageFile.name,
    version: packageFile.version
  };

  //loading and running plugins
  yield PluginHelper.runPlugins(app);
};