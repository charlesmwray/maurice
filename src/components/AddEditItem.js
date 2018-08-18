import React, { Component } from 'react';

import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogActions from '@material-ui/core/DialogActions';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';



// Data
import firebase from '../data/Firebase.js';

export default class AddEditItem extends Component {
    constructor(props) {
        super(props);

        this.state = {
            editItemDetails: null,
            nameErrorText: null,
            nameToAdd: '',
            airDay: ''
        };
    }

    componentWillMount(props) {
        if (this.props.editItemDetails) {
            this.setState({
                editItemDetails: this.props.editItemDetails,
                channel: this.props.editItemDetails.channel,
                airDay:this.props.editItemDetails.airDay || null
            });
        }
    }

    componentWillUnmount() {
        this.props.resetAddEditItem();
    }

    saveItem = () => {
        const nameEl = document.getElementById('name');
        const name = this.state.nameToAdd || document.getElementById('name').value || '';
        const date = document.getElementById('date') ? document.getElementById('date').value : null;
        let itemsRef;

        const item = {
            name: name,
            dateAdded: new Date().toString(),
            dateToBeReminded: date,
            airDay: this.state.airDay,
            channel: this.state.channel || null,
            active: true
        }

        if (!name) {
            this.setState({nameErrorText: "You've got to at least have a name don't you?"});
            nameEl.focus();
            return;
        };

        if ( this.state.editItemDetails ) {
            itemsRef = firebase.database().ref('users/' + this.props.uid + '/items/' + this.state.editItemDetails.id);
            itemsRef.update(item);
        } else {
            itemsRef = firebase.database().ref('users/' + this.props.uid + '/items');
            itemsRef.push(item);
        }

        this.props.addEditItemToggle();
    }

    handleChange = (e) => {
        let itemString = e.target.value;
        let channelPlaceholder = this.state.channel || null;

        const channels = ['netflix','showtime', 'rental', 'hulu', 'hbo', 'comedy central', 'amazon', 'fx', 'tnt', 'amc', 'bbc'];

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
        });
    }

    handleClose() {
        this.props.addEditItemToggle();
    }

    render() {
        return (
            <Dialog
                open={true}
                onClose={() => { this.handleClose() } }
                fullWidth={true}
            >
                <DialogTitle>Add new item.</DialogTitle>
                <DialogContent>
                    <form noValidate>
                        <TextField
                            id="name"
                            style={ { fontSize: '1.75rem', width: 'auto', height: '6rem', display: 'block', marginBottom: 16 } }
                            onChange={ e => this.handleChange(e) }
                            onKeyUp={ e => { if (e.key === 'Enter') { this.saveItem(e) } } }
                            defaultValue={this.state.editItemDetails && this.state.editItemDetails.name}
                            placeholder="Item name."
                            fullWidth={true}
                        />
                        { this.state.nameErrorText }
                        <div style={ { color: 'black' } }>
                            { this.state.channel }
                        </div>
                        <TextField
                            id="date"
                            label="Air Date"
                            type="date"
                            fullWidth
                            defaultValue={ this.state.editItemDetails && this.state.editItemDetails.dateToBeReminded }
                            InputLabelProps={{
                              shrink: true,
                            }}
                        />
                        <FormControl fullWidth>
                            // <InputLabel htmlFor="dow">Day of the week</InputLabel>
                            <Select
                                value={this.state.airDay}
                                onChange={(e)=>{this.setState({ airDay: e.target.value });}}
                                inputProps={{
                                    name: 'airDay',
                                    id: 'airDay',
                                }}
                            >
                            <MenuItem value="">
                            <em>None</em>
                            </MenuItem>
                                <MenuItem value={'Sunday'}>Sunday</MenuItem>
                                <MenuItem value={'Monday'}>Monday</MenuItem>
                                <MenuItem value={'Tuesday'}>Tuesday</MenuItem>
                                <MenuItem value={'Wednesday'}>Wednesday</MenuItem>
                                <MenuItem value={'Thursday'}>Thursday</MenuItem>
                                <MenuItem value={'Friday'}>Friday</MenuItem>
                                <MenuItem value={'Saturday'}>Saturday</MenuItem>
                            </Select>
                        </FormControl>
                    </form>
                    <DialogActions>
                        <Button onClick={ () => { this.handleClose() } } color="default">
                            Cancel
                        </Button>
                        <Button onClick={ () => { this.saveItem() } } color="primary">
                            Save
                        </Button>
                    </DialogActions>
                </DialogContent>
            </Dialog>
        );
    }
};

// formatDate={ (date) => {
//     return date.toLocaleString("en-us", { month: "long" }) + " " + date.getDate();
// }}
