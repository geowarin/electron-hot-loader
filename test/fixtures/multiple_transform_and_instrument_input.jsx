const React = require('react');
const multipleComponents = require('./multipleComponents.jsx');

module.exports.ComponentA = class ComponentA extends React.Component {
    render() {
        return <multipleComponents.First />
    }
};

module.exports.ComponentB = class ComponentB extends React.Component {
    render() {
        return <multipleComponents.Second />
    }
};
