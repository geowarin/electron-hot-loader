"use strict";

const esprima = require('esprima');
const estraverse = require('estraverse');
const escodegen = require('escodegen');
var t = require('./nodeTypes');
var requireRegister = require.resolve('./index');

module.exports = function instrument(source) {
    var ast = esprima.parse(source);

    var firstRequireDeclarationIndex;
    var requireDeclarationsByName = {};

    estraverse.traverse(ast, {
        enter: function (node, parent) {
            if (t.isRequireDeclaration(node)) {
                if (!firstRequireDeclarationIndex) {
                    firstRequireDeclarationIndex = parent.body.indexOf(node);
                }
                requireDeclarationsByName[node.declarations[0].id.name] = node.declarations[0].init.arguments[0].value
            }
        }
    });

    estraverse.replace(ast, {
        enter: function (node) {
            if (t.isTopLevelAPIRender(node)) {
                var rootWrapperTemplate = esprima.parse(
                    '__electronHot__.registerRoot(ARGS)'
                );

                var retRootNode = rootWrapperTemplate.body[0].expression;
                retRootNode.arguments[0] = node;
                this.skip();
                return retRootNode;
            }
        }
    });

    estraverse.replace(ast, {
        enter: function (node) {

            if (t.isCreateElementCall(node)) {

                var wrapperTemplate = esprima.parse(
                    [
                        'React.createElement(' +
                        '   __electronHot__.register(COMPONENT_ARG, RESOLVE_ARG))'
                    ].join('')
                );

                var retNode = wrapperTemplate.body[0].expression;

                const componentArg = node.arguments[0];
                const requireDeclaration = requireDeclarationsByName[componentArg.name];
                if (!requireDeclaration) {
                    console.warn("Could not find a require declaration for the component " + componentArg.name);
                    return node;
                }

                // change COMPONENT_ARG
                retNode.arguments[0].arguments[0] = componentArg;
                // RESOLVE_ARG
                retNode.arguments[0].arguments[1] = esprima.parse("require.resolve('" + requireDeclaration + "')").body[0].expression;


                // props
                if (node.arguments.length > 1) {
                    retNode.arguments[1] = node.arguments[1];
                }
                // children
                if (node.arguments.length > 2) {
                    retNode.arguments[2] = node.arguments[2];
                }

                //Prevent further traversal and ComponentWrapper wrapping
                this.skip();
                return retNode;
            }
        },

        leave: function (node) {

            if (node.type === 'Program') {

                var beforeChunk = esprima.parse('var __electronHot__ = require("' + requireRegister + '");');

                node.body.splice(firstRequireDeclarationIndex, 0, beforeChunk);
                return node;
            }
        }
    });

    return escodegen.generate(ast);
};