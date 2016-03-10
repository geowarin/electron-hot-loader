"use strict";
const connect = require('react-redux').connect;
var __electronHot__ = require('_electronHotLocation_');
const Component = require('./Component.jsx');

module.exports = connect(
    (state) => ({counter: state.counter})
)(__electronHot__.register(Component, require.resolve('./Component.jsx')));
