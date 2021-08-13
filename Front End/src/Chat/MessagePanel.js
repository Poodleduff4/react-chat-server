import React from 'react';
import Message from './Message';

export default class MessagePanel extends React.Component {
    state = {
        input_value: '',
    }

    send = () => {
        if(this.state.input_value && this.state.input_value !== '') {
            console.log('send function')
            this.props.onSendMessage(this.props.channel, this.state.input_value)
            this.setState({input_value: ''})
        }
    }

    handleInput = e => {
        this.setState({input_value: e.target.value});
        console.log(this.state.input_value);
    }

    render() {

        let list = <div className="no-content-message">There are no messages to show</div>;
        let channelName = this.props.channel;
        if (this.props.channel && this.props.channel.messages) {
            list = this.props.channel.messages.map(m => <Message key={m.id} id={m.id} senderName={m.senderName} text={m.text} />);
        }
        return (
            <div className="message-panel">
            {/* <div className="channel-name">{channelName}</div> */}
                <div className="message-list">
                    {list}
                </div>
                <div className="message-input">
                    <input type="text" onChange={this.handleInput} value={this.state.input_value} />
                    <button onClick={this.send}>Send</button>
                </div>
            </div>
        )
    }
}