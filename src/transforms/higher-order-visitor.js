'use strict';

var utils = require('jstransform/src/utils');

function higherOrderVisitor (traverse, node, path, state) {
  const componentArgs = findArgumentWhichMightBeComponent(node, state);

  if (!componentArgs.length) {
    return true;
  }

  componentArgs.forEach(component => {
    utils.catchup(component.arg.range[0], state);
    utils.append('__electronHot__.register(', state);
    utils.catchup(component.arg.range[1], state);
    utils.append(', require.resolve(' + component.path.replace(/\\/g, '/') + '))', state);
  });

  return false;
}

higherOrderVisitor.test = function (node, path, state) {
  return (
    state.g.opts.higherOrderFunctions && state.g.opts.higherOrderFunctions.length > 0 &&
    node.type === 'CallExpression' &&
    isCalleeHigherOrder(node, state) &&
    node.arguments.length > 0
  );
};

function isCalleeHigherOrder (node, state) {
  if (!node.callee) {
    return false;
  }
  let callee = node.callee;
  while (callee) {
    if (state.g.opts.higherOrderFunctions.indexOf(callee.name) >= 0) {
      return true;
    }
    callee = callee.callee;
  }
  return false;
}

function findArgumentWhichMightBeComponent (node, state) {
  const args = [];
  for (var i = 0; i < node.arguments.length; i++) {
    var arg = node.arguments[i];
    let requirePath = state.g.requireNodesMap && state.g.requireNodesMap[arg.name];
    if (!requirePath) {
      requirePath = state.g.reactClasses && state.g.reactClasses[arg.name];
    } else {
      requirePath = "'" + requirePath + "'";
    }

    if (requirePath) {
      args.push({
        path: requirePath,
        arg: arg
      });
    }
  }
  return args;
}

module.exports = higherOrderVisitor;
