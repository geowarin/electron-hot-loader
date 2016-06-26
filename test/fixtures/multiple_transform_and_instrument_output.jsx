var __electronHot__ = require('_electronHotLocation_');
const React = require('react');
const multipleComponents = require('./multipleComponents.jsx');

module.exports.ComponentA = class ComponentA extends React.Component {
    render() {
        return React.createElement(__electronHot__.register(multipleComponents.First, require.resolve('./multipleComponents.jsx'), 'First'), null)
    }
};

module.exports.ComponentB = class ComponentB extends React.Component {
    render() {
        return React.createElement(__electronHot__.register(multipleComponents.Second, require.resolve('./multipleComponents.jsx'), 'Second'), null)
    }
};
