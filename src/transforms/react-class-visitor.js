var globalUtils = require('./utils');

function classVisitor (traverse, node, path, state) {
  const name = node.id.name;
  const requirePath = '__filename';
  globalUtils.addElementToGlobalMap(state, 'reactClasses', name, requirePath);
}

classVisitor.test = function (node, path, state) {
  return (
    node.type === 'ClassDeclaration' &&
    node.superClass &&
    node.superClass.object &&
    node.superClass.object.name === 'React' &&
    node.superClass.property &&
    node.superClass.property.name === 'Component'
  );
};

module.exports = classVisitor;
