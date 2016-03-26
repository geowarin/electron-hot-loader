"use strict";

const React = require('react');

// This component intentionnaly contains a parse error
module.exports = class App extends React.Component {

    render() {
        return (<div>Hello<div>)
    }
};