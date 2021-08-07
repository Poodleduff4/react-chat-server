import React from 'react';
import Channel from './Channel'

export class ChannelList extends React.Component {

handleClick = id => {
    this.props.onSelectChannel(id);
}

    render() {
        let list = `there are no channels to show`;
        if (this.props.channels) {
            list = this.props.channels.map(c => <Channel name={c.name} id={c.id} key={c.id} participants={c.participants} onClick={this.handleClick} />);
        }
        return (
            <div className="channel-list">
                {list}
            </div>
        );
    }
}