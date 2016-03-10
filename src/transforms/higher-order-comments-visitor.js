"use strict";

var jstransform = require('jstransform');
var utils = require('jstransform/src/utils');
var globalUtils = require('./utils');

function higherOrderVisitor(traverse, node, path, state) {

    const componentComments = node.comments.filter(c => c.value.match(/@HigherOrder/));
    componentComments.forEach(comment => {
        globalUtils.addElementToGlobalArray(state, 'higherOrder', comment.loc.start.line + 1)
    });
}

higherOrderVisitor.test = function (node, path, state) {
    return node.comments && node.comments.length > 0;
};

module.exports = higherOrderVisitor;