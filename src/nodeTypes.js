"use strict";

var t = exports;

//Matches: var SomeComponent = React.createClass({})
t.isComponentDeclaration = function(node) {
    return (
        node.type === 'VariableDeclaration' &&
        node.declarations[0] &&
        node.declarations[0].type === 'VariableDeclarator' &&
        node.declarations[0].init &&
        node.declarations[0].init.type === 'CallExpression' &&
        node.declarations[0].init.callee.type === 'MemberExpression' &&
        node.declarations[0].init.callee.property.name === 'createClass'
    );
};

t.isRequireDeclaration = function(node) {
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

//Matches on React.createElement(SomeCustomELement, ......)
t.isCreateElementCall = function(node) {
    return (
        node.type === 'CallExpression' &&
        node.callee.type === 'MemberExpression' &&
        node.callee.property.name === 'createElement' &&
        node.arguments[0].type === 'Identifier'
    );
};

//React.render(<TopLevelComponent />)
t.isTopLevelAPIRender = function(node) {
    return (
        node.type === 'CallExpression' &&
        node.callee.type === 'MemberExpression' &&
        (node.callee.object.name === 'React' || node.callee.object.name === 'ReactDOM') &&
        node.callee.property.name === 'render'
    );
};