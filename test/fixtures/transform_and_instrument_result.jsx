const React = require('react');
var __electronHot__ = require('_electronHotLocation_');
const OtherComponent = require('./OtherComponent.jsx');
module.exports = class Component extends React.Component {
    render() {
	return React.createElement(__electronHot__.register(OtherComponent, require.resolve('./OtherComponent.jsx')), null);
    }
};