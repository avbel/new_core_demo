"use strict";

function ConfigDecorator(config, parentConfig){
  this.config = config;
  this.parentConfig = parentConfig;
}

ConfigDecorator.prototype.get = function(name){
  let value = this.config.get(name);
  if(typeof value === "undefined" && this.parentConfig){
    return this.parentConfig.get(name);
  }
  return value;
};

module.exports = ConfigDecorator;
