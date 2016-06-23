'use strict';

var assert = require('assert');

const createProxy = require('react-proxy/modules/index');

const proxies = {};
let rootInstance;

module.exports.register = register;
module.exports.registerRoot = registerRoot;
module.exports.hasProxies = hasProxies;
module.exports.updateProxies = updateProxies;
module.exports.getRoot = getRoot;

function traverseObject (object, path) {
  if (path === '') return object;

  const parts = path.split('.');
  const member = parts[0];
  const rest = parts.slice(1).join('.');
  return traverseObject(object[member], rest);
}

function registerRoot (root) {
  rootInstance = root;
}

function register (Component, location, path) {
  assert(path !== undefined);

  const proxy = createProxy.default(Component);

  if (!proxies[location]) {
    console.debug('Registered proxy', location);
    proxies[location] = {};
    proxies[location][path] = proxy;
  }

  return proxies[location][path].get();
}

function hasProxies (location) {
  return location in proxies;
}

function updateProxies (location, module) {
  let moduleProxies = proxies[location];
  for (let path in moduleProxies) {
    let proxy = moduleProxies[path];

    var newComponent = traverseObject(module, path);
    proxy.update(newComponent);
  }
}

function getRoot () {
  return rootInstance;
}
