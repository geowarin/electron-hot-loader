"use strict";
var __electronHot__ = require('_electronHotLocation_');
const React = require('react');
const connect = require('react-redux').connect;

class Component extends React.Component {
}

module.exports = connect(
    (state) => ({counter: state.counter})
)(__electronHot__.register(Component, require.resolve(__filename)));
