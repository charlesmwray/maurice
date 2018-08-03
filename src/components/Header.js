import React, { Component } from 'react';

// MUI Components
import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentAdd from 'material-ui/svg-icons/content/add';
import FlatButton from 'material-ui/FlatButton';
import Dialog from 'material-ui/Dialog';
import TextField from 'material-ui/TextField';
import DatePicker from 'material-ui/DatePicker';
import Avatar from 'material-ui/Avatar';

// Data
import firebase from '../data/Firebase.js';

const styles = {
    radioButton: {
        marginBottom: 8,
    }
};

export default class Header extends Component {
    constructor() {
        super();
        this.state = {
            addItemDialogOpen: false,
            nameToAdd: null,
            nameErrorText: null,
            channel: null
        };
    }


    handleOpen = () => {
        this.setState({addItemDialogOpen: true});
        setTimeout( function() { document.getElementById('name').focus(); },  200);

    };

    handleClose = () => {
        this.setState({addItemDialogOpen: false});
    };

    addItem = () => {
        const nameEl = document.getElementById('name');
        const name = this.state.nameToAdd || document.getElementById('name').value || '';
        const date = document.getElementById('date') ? document.getElementById('date').value : null;
        const channel = document.querySelector('input[name="channel"]:checked') ? document.querySelector('input[name="channel"]:checked').value : null;
        const format = document.querySelector('input[name="format"]:checked') ? document.querySelector('input[name="format"]:checked').value : null;
        const itemsRef = firebase.database().ref('users/' + this.props.userInfo.uid + '/items');

        const newItem = {
            name: name,
            dateAdded: new Date().toString(),
            dateToBeReminded: date,
            channel: this.state.channel || null,
            format: format,
            active: true
        }

        if (!name) {
            this.setState({nameErrorText: "You've got to at least have a name haven't you?"});
            nameEl.focus();
            return
        };

        itemsRef.push(newItem);

        this.setState({addItemDialogOpen: false});
    }

    handleChange = (e) => {
        let itemString = e.target.value;
        let channelPlaceholder;

        const channels = ['netflix','showtime', 'rental', 'hulu', 'hbo', 'comedy central', 'amazon', 'fx'];

        channels.forEach( (channel) => {
            const channelIndex = itemString.toLowerCase().indexOf(channel);
            if ( channelIndex !== -1 ) {
                channelPlaceholder = channel;

                itemString = itemString.slice(0, channelIndex - 3) + itemString.slice(channelIndex + channel.length);
            }
        });

        this.setState({
            nameErrorText: itemString ? '' : this.state.errorText,
            channel: channelPlaceholder,
            nameToAdd: itemString
        })

    }

    showPreferences() {

    }

    render() {
        const actions = [
            <FlatButton
                label="Cancel"
                primary={ false }
                onClick={ this.handleClose }
            />,
            <FlatButton
                label="Add"
                type="submit"
                primary={ true }
                onClick={ e => this.addItem(e) }
            />,
        ];

        return (
            <div className="header row">
                {this.props.userInfo ?
                    <div className="profile">
                        <Avatar
                            src={this.props.userInfo.photoURL}
                            size={40}
                            onClick={this.showPreferences}
                        />
                        <FlatButton label="Log Out" primary={true} onClick={this.props.logout} />
                    </div>
                    :
                    <div className="profile">
                        <FlatButton label="Log In" primary={true} onClick={this.props.login} />
                    </div>
                }
                <div className="">
                    <FloatingActionButton mini={true} onClick={this.handleOpen}>
                        <ContentAdd />
                    </FloatingActionButton>
                </div>
                <Dialog
                    actions={actions}
                    modal={false}
                    open={this.state.addItemDialogOpen}
                    onRequestClose={this.handleClose}
                >
                    <div className="row">
                        <div className="x-12">
                            <TextField
                                id="name"
                                ref={this.nameRef}
                                floatingLabelText="New Movie or Show"
                                style={ { fontSize: '1.75rem', width: 'auto', height: '6rem', display: 'block', marginBottom: 16 } }
                                errorText={this.state.nameErrorText}
                                onChange={ e => this.handleChange(e) }
                            />
                            <DatePicker
                                id="date"
                                hintText="Air Date"
                                style={ { marginBottom: 16 } }
                                formatDate={ (date) => {
                                    return date.toLocaleString("en-us", { month: "long" }) + " " + date.getDate();
                                }}
                            />
                            {this.state.channel}
                        </div>
                    </div>
                </Dialog>
            </div>
        )
    }
}
