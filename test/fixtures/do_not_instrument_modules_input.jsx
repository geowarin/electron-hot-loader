const React = require('react');
const OtherComponent = require('external-lib/OtherComponent');

module.exports = class Component extends React.Component {
    render() {
	return <OtherComponent />
    }
};
