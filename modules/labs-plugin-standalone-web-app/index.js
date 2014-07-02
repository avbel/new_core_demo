"use strict";
let http = require("http");

module.exports = function*(plugin){
  plugin.logger.debug("Running plugin %s@%s", plugin.name, plugin.version);
  let server = http.createServer(plugin.backend.instance.getRequestHandler());
  let port = plugin.config.get("port") || 3000;
  server.listen(port, function(){
    plugin.logger.info("%s@%s is listening to port %d now", plugin.app.name, plugin.app.version, port);
  });
};
