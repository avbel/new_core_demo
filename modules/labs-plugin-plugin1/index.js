"use strict";
let http = require("http");

module.exports = function*(plugin){
  yield plugin.dependency("koa");
  //this code will be executed after running 'koa'
  plugin.logger.debug("Running plugin %s@%s", plugin.name, plugin.version);

  let app = plugin.container.resolve("app"); //resolving koa app

  app.use(function*(){
    this.body = "Hello";
  });


  plugin.container.register("lazyInstance", function*(){
    //do something
    return {ready: true};
  });

  plugin.container.register("lazyInstances", function*(){
    return {number: 1};
  });
  plugin.container.register("lazyInstances", function*(){
    return {number: 2};
  });
  plugin.container.register("lazyInstances", function*(){
    return {number: 3};
  });

  //see plugin2 to usage
};
