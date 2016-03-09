var __electronHot__ = require('_electronHotLocation_');
const React = require('react');
const OtherComponent = require('./OtherComponent.jsx');

module.exports = class Component extends React.Component {
    render() {
        return React.createElement(__electronHot__.register(OtherComponent, require.resolve('./OtherComponent.jsx')), null)
    }
};

//# sourceMappingURL=data:application/json;base64,_ignore_