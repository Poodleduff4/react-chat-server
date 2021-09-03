import React from 'react';
import { ChannelList } from './ChannelList.js';
import './chat.scss';
import MessagePanel from './MessagePanel';
import LoginForm from './LoginForm.js';
import socketClient from "socket.io-client";
// const SERVER = "http://127.0.0.1:8080";
const SERVER = "http://192.168.2.134:8080";
export default class Chat extends React.Component {
    state = {
        channels: null,
        socket: null,
        channel: null,
        name: 'unnamed'
    }
    socket;
    componentDidMount() {
        this.loadChannels();
        this.configureSocket();
    }

    configureSocket = () => {
        var socket = socketClient(SERVER);
        this.setState({name: this.props.name});
        socket.on('connection', () => {
            console.log('channel select');
            this.handleChannelSelect(1);
        });
        socket.on('channel', channel => {

            let channels = this.state.channels;
            channels.forEach(c => {
                if (c.id === channel.id) {
                    c.participants = channel.participants;
                }
            });
            this.setState({ channels });
        });
        socket.on('message', message => {  //{ channel_id, text, senderName: this.socket.id, id: Date.now() }
            let channels = this.state.channels
            channels.forEach(c => {
                console.log('message channel')
                console.log(message.channel_id.id)
                console.log()
                console.log('msgch')
                if (c.id === message.channel_id.id) {
                    console.log('first')
                    console.log(c.messages)
                    if (!c.messages) {
                        console.log('new message')
                        c.messages = [message];
                    } else {
                        c.messages.push(message);
                        console.log('add message')
                    }
                }
            });
            this.setState({ channels });
        });
        this.socket = socket;
    }

    loadChannels = async () => {
        //http://192.168.2.134:8080/getChannels
        fetch('http://192.168.2.134:8080/getChannels').then(async response => {
            let data = await response.json();
            this.setState({ channels: data.channels });
        })
    }

    handleChannelSelect = id => {
        console.log('id: ' + id);
        let channel = this.state.channels.find(c => {
            return c.id === id;
        });
        this.setState({ channel });
        this.socket.emit('channel-join', id, ack => {
        });
    }

    handleSendMessage = (channel_id, text) => {
        console.log('send message')
        // this.socket.emit('send-message', { channel_id, text, senderName: this.socket.id, id: Date.now() });
        this.socket.emit('send-message', { channel_id, text, senderName: this.state.name, senderId: this.socket.id, id: Date.now() });
    }

    handleNameChange = (name) => {
        this.setState({ name });
    }

    render() {

        return (
            <div className='chat-app'>
                {/* <p>Name: {this.props.name}</p> */}
                {/* <LoginForm sendLoginInfo={this.handleNameChange} /> */}
                <ChannelList channels={this.state.channels} onSelectChannel={this.handleChannelSelect} />
                <MessagePanel onSendMessage={this.handleSendMessage} channel={this.state.channel} />
            </div>
        );
    }
}