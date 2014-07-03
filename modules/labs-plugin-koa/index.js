"use strict";
let koa = require("koa");

module.exports = function*(plugin){
  plugin.logger.debug("Running plugin %s@%s", plugin.name, plugin.version);
  let app = koa();
  plugin.container.register("app", app);
  plugin.after(function*(){
    let config = plugin.container.resolve("config", {throwError: false});
    let port = config?(config.get("port") || 3000):3000;
    app.listen(port, function(){
      plugin.logger.info("Server is listening on %d", port);
    });
  });
};
