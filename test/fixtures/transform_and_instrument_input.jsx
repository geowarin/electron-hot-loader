const React = require('react');
const OtherComponent = require('./OtherComponent.jsx');

module.exports = class Component extends React.Component {
    render() {
        return <OtherComponent />
    }
};
