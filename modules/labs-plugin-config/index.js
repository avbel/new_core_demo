"use strict";
module.exports = function*(plugin){
  plugin.logger.debug("Running plugin %s@%s", plugin.name, plugin.version);
  plugin.container.register("config", {
    get: function(name){
      return null;
    }
  });
};
