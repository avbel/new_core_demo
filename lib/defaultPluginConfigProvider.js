"use strict";

module.exports = function*(plugin, config){
  let settings = config.get(plugin.name) || {}; //get plugin's scope of global config
  return {
    get: function(name){
      return settings[name];
    }
  };
}