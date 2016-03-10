"use strict";

var jstransform = require('jstransform');
var utils = require('jstransform/src/utils');

function higherOrderVisitor(traverse, node, path, state) {

    const componentComments = node.comments.filter(c => c.value.match(/@HigherOrder/));
    componentComments.forEach(comment => {
        let higherOrder = state.g.higherOrder;
        if (!higherOrder) {
            higherOrder = [];
        }
        higherOrder.push(comment.loc.start.line + 1);
        state.g.higherOrder = higherOrder;
    });
}

higherOrderVisitor.test = function (node, path, state) {
    return node.comments && node.comments.length > 0;
};

module.exports = higherOrderVisitor;