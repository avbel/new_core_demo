"use strict";
let http = require("http");

module.exports = function*(plugin){
  yield plugin.dependency("plugin2");
  //this code will be executed after running 'plugin2'
  plugin.logger.debug("Running plugin %s@%s", plugin.name, plugin.version);
  plugin.backend.instance.app.use(function*(){
    this.body = "Demo";
  });
  plugin.after(function*(){
    plugin.logger.debug("After all plugins");
  });
};
