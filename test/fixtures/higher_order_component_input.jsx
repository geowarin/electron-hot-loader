"use strict";
const connect = require('react-redux').connect;
const Component = require('./Component.jsx');

//@HigherOrder
module.exports = connect(
    (state) => ({counter: state.counter})
)(Component);
