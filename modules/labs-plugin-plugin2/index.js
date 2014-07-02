"use strict";
let http = require("http");

//plugin with custom config provider

module.exports = function*(plugin){
  plugin.logger.debug("Running plugin %s@%s", plugin.name, plugin.version);
  plugin.logger.debug(plugin.config.get("test"));
};

module.exports.configProvider = function*(config){ //custom config provider here, 'config' is instance of glogab config provider
  return {
    get: function(name){
      return name + " from plugin";
    }
  };
}
