import React from 'react';

export default class Channel extends React.Component {
    click = () => {
        this.props.onClick(this.props.id);
    }

    render() {
        return (
            <div className="channel-item" onClick={this.click}>
                <h3>{this.props.name}</h3>
                <span>{this.props.participants}</span>
            </div>
        )
    }
}