"use strict";

module.exports = function*(plugin){
  plugin.logger.debug("Running plugin %s@%s", plugin.name, plugin.version);

  return {
    get : function (name, defaultValue) {
      name = name.toUpperCase();
      return process.env[name] || defaultValue;
    }
  };
};

