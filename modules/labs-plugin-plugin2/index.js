"use strict";
let http = require("http");

//plugin with custom config provider

module.exports = function*(plugin){
  plugin.logger.debug("Running plugin %s@%s", plugin.name, plugin.version);
  plugin.logger.debug(plugin.config.get("test"));
};

module.exports.configProvider = function*(config){
  return {
    get: function(name){
      return name + " from plugin";
    }
  };
}
