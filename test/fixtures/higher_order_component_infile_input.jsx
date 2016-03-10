"use strict";
const React = require('react');
const connect = require('react-redux').connect;

class Component extends React.Component {
}

module.exports = connect(
    (state) => ({counter: state.counter})
)(Component);
