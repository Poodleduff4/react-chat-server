import React from 'react';
import { ChannelList } from './ChannelList.js';
import './chat.scss';
import MessagePanel from './MessagePanel';
import socketClient from "socket.io-client";
const SERVER = "http://127.0.0.1:8080";
export default class Chat extends React.Component {

    state = {
        channels: null,
        socket: null,
        channel: null
    }
    socket;
    componentDidMount() {
        this.loadChannels();
        this.configureSocket();
    }

    configureSocket = () => {
        var socket = socketClient(SERVER);
        socket.on('connection', () => {

            this.socket.emit('channel-join', 1);

            if (this.state.channel) {
                this.handleChannelSelect(this.state.channel.id);
            }
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
        socket.on('message', message => {

            let channels = this.state.channels
            channels.forEach(c => {
                console.log('message' + message.channel_id)
                if (c.id === message.channel_id) {
                    console.log('first')
                    if (!c.messages) {
                        c.messages = [message];
                        console.log('new message')
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
        fetch('http://localhost:8080/getChannels').then(async response => {
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
        this.socket.emit('send-message', { channel_id:channel_id, text, senderName: this.socket.id, id: Date.now() });
    }

    render() {

        return (
            <div className='chat-app'>
                <ChannelList channels={this.state.channels} onSelectChannel={this.handleChannelSelect} />
                <MessagePanel onSendMessage={this.handleSendMessage} channel={this.state.channel} />
            </div>
        );
    }
}