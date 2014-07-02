"use strict";
let koa = require("koa");
let router = require("koa-router");

module.exports = function*(plugin){
  let app = koa();
  let config = yield plugin.dependency("config");
  //this code will be executed after running 'config'
  plugin.logger.debug("Running plugin %s@%s", plugin.name, plugin.version);

  plugin.after(function*(){
    plugin.logger.debug("After all plugins");
    let port = config.get("port", 3000);
    app.listen(port, function () {
      plugin.logger.info("Server is listening on %d", port);
    });
  });

  app.use(router(app));

  app.get("/", function* () {
    this.body = "Hello " + config.get("user", "world");
  });

  return app;
};
