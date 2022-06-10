import React from 'react';

export default class Message extends React.Component {
    render() {
        return (
            <div className="message-item">
                    <div className="message-author"><b>{this.props.senderName}</b></div>
                    <div className="timestamp">{this.props.time}</div>
                    <span className="message-text">{this.props.text}</span>
            </div>
        )
    }
}