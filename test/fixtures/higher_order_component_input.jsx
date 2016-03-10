"use strict";
const connect = require('react-redux').connect;
const Component = require('./Component.jsx');

module.exports = connect(
    (state) => ({counter: state.counter})
)(Component);
