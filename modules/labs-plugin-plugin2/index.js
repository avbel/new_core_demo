"use strict";

module.exports = function*(plugin){
  plugin.logger.debug("Running plugin %s@%s", plugin.name, plugin.version);
};

