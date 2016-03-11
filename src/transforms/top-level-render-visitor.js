var utils = require('jstransform/src/utils');

function topLevelRenderVisitor (traverse, node, path, state) {
  utils.append('__electronHot__.registerRoot(', state);

  const beginOfArgs = node.arguments[0].range[0];
  const endOfArgs = node.arguments[node.arguments.length - 1].range[0];

  // Write ReactDOM.render(
  utils.catchup(beginOfArgs, state);
  traverse(node.arguments, path, state);
  utils.catchup(endOfArgs, state);

  utils.append(')', state);
  return false;
}

topLevelRenderVisitor.test = function (node, path, state) {
  return (
    node.type === 'CallExpression' &&
    node.callee.type === 'MemberExpression' &&
    (node.callee.object.name === 'React' || node.callee.object.name === 'ReactDOM') &&
    node.callee.property.name === 'render'
  );
};

module.exports = topLevelRenderVisitor;
