"use strict";
let  util = require("util");

function Container(){
  this.items = {};
};

Container.prototype.register = function(name, value){
  let list = this.items[name] || [];
  list.push(value);
  this.items[name] = list;
};

Container.prototype.unregister = function(name, value){
  let list = this.items[name] || [];
  if(typeof value === "undefined"){
    list = [];
  }
  else{
    let index = list.indexOf(value);
    if(index >= 0){
      list.splice(index, 1);
    }
  }
  this.items[name] = list;
};

Container.prototype.resolveAll = function(name){
  return this.items[name] || [];
};

Container.prototype.resolve = function(name, options){
  options = options || {};
  if(typeof options.throwError === "undefined"){
    options.throwError = true;
  }
  let instances = this.resolveAll(name);
  let instance = instances[instances.length - 1];
  if(typeof instance === "undefined" && options.throwError){
    throw new Error("Missing item with name \"" + name + "\" in the container");
  }
  return instance;
};

Container.prototype.createScopedContainer = function(){
  return new ScopedContainer(this);
};

function ScopedContainer(parentContainer){
  this.parentContainer = parentContainer;
  Container.call(this);
}

util.inherits(ScopedContainer, Container);

ScopedContainer.prototype.resolveAll = function(name){
  return (this.items[name] || []).concat(this.parentContainer.resolveAll(name));
};

ScopedContainer.prototype.resolve = function(name, options){
  let instances = this.resolveAll(name);
  let instance = instances[instances.length - 1];
  return instance || this.parentContainer.resolve(name, options);
};


module.exports = Container;