"use strict";
let co = require("co");
let loader = require("./loader");
let PluginHelper = require("./pluginHelper");

module.exports = function(main, callback){
  co(function* () {
    // load package.json of current project
    let packageFile = loader.loadPackageFile();

    // filling app info
    let app = {
      name: packageFile.name,
      version: packageFile.version,
      exports: main
    };

    //loading and running plugins
    yield PluginHelper.runPlugins(app);
  })(callback);
};
