var utils = require('jstransform/src/utils');
var globalUtils = require('./utils');
var proxiesPath = require.resolve('../proxies').replace(/\\/g, '/');

function requireVisitor (traverse, node, path, state) {
  if (!state.g.alreadyAddedElectronHotRequire) {
    utils.append("var __electronHot__ = require('" + proxiesPath + "');\n", state);
    state.g.alreadyAddedElectronHotRequire = true;
  }

  const key = node.declarations[0].id.name;
  const requirePath = node.declarations[0].init.arguments[0].value;
  if (isOwnComponent(requirePath)) {
    globalUtils.addElementToGlobalMap(state, 'requireNodesMap', key, requirePath);
  }

  utils.catchup(node.range[1], state);
}
requireVisitor.test = function (node, path, state) {
  return (
    node.type === 'VariableDeclaration' &&
    node.declarations[0] &&
    node.declarations[0].type === 'VariableDeclarator' &&
    node.declarations[0].init &&
    node.declarations[0].init.type === 'CallExpression' &&
    node.declarations[0].init.callee.type === 'Identifier' &&
    node.declarations[0].init.callee.name === 'require'
  );
};

function isOwnComponent (requirePath) {
  return requirePath && requirePath.indexOf('.') === 0;
}

module.exports = requireVisitor;
