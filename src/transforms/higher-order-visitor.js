"use strict";

var jstransform = require('jstransform');
var utils = require('jstransform/src/utils');

function higherOrderVisitor(traverse, node, path, state) {

    const componentArgs = findArgumentWhichMightBeComponent(node, state);

    if (!componentArgs.length) {
        return true;
    }

    state.g.higherOrder = removeLocation(node, state);

    componentArgs.forEach(component => {
        utils.catchup(component.arg.range[0], state);
        utils.append('__electronHot__.register(', state);
        utils.catchup(component.arg.range[1], state);
        utils.append(", require.resolve('" + component.path + "'))", state);
    });

    return false;
}

higherOrderVisitor.test = function (node, path, state) {
    return (
        state.g.higherOrder && state.g.higherOrder.length > 0 &&
        matchesLocations(node, state.g.higherOrder) &&
        node.type === 'CallExpression' &&
        node.arguments.length > 0
    );
};

function findArgumentWhichMightBeComponent(node, state) {
    const args = [];
    for (var i = 0; i < node.arguments.length; i++) {
        var arg = node.arguments[i];
        const requirePath = state.g.requireNodesMap[arg.name];
        if (requirePath) {
            args.push({
                path: requirePath,
                arg: arg
            });
        }
    }
    return args;
}

function matchesLocations(node, locations) {
    return locations.indexOf(node.loc.start.line) !== -1;
}

function removeLocation(node, state) {
    const result = [];
    state.g.higherOrder.forEach(line => {
        if (line !== node.loc.start.line) {
            result.push(line)
        }
    });
    return result;
}

module.exports = higherOrderVisitor;