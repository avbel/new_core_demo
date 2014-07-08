"use strict";
let loader = require("./loader");
let PluginHelper = require("./pluginHelper");
let Container = require("./container");


module.exports = function*(){
  //creating root container
  let rootContainer = new Container();

  //registering common data into container

  let info = loader.loadPackageFile();
  rootContainer.register("appInfo", {
    name: info.name,
    version: info.version
  });

  rootContainer.register("logger", require("./defaultLogger")); //can move this line to plugin

  //loading and running plugins
  yield PluginHelper.runPlugins(rootContainer);
};