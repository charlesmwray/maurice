import React, { Component } from 'react';

// MUI Components
import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentAdd from 'material-ui/svg-icons/content/add';
import FlatButton from 'material-ui/FlatButton';
import Avatar from 'material-ui/Avatar';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';


export default class Header extends Component {
    constructor() {
        super();
        this.state = {
            addItemDialogOpen: false,
            nameToAdd: null,
            channel: null
        };
    }

    componentWillMount() {
        const days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
        const day = days[new Date().getDay()];

        this.setState({
            filterDay: day
        });
    }

    render() {

        return (
            <div className="header row">
                {this.props.userInfo ?
                    <div className="profile">
                        <Avatar
                            src={this.props.userInfo.photoURL}
                            size={40}
                            onClick={this.props.logout}
                        />
                    </div>
                    :
                    <div className="profile">
                        <FlatButton label="Log In" primary={true} onClick={this.props.login} />
                    </div>
                }
                <FormControl style={ {
                    width: '300px'
                } }>
                    <Select
                        value={this.state.filterDay}
                        onChange={(e)=>{
                            this.props.filterItemsByDay( e.target.value );
                            this.setState({ filterDay: e.target.value });}
                        }
                        inputProps={{
                            name: 'filterDay',
                            id: 'filterDay',
                        }}
                    >
                        <MenuItem value=""><em>All</em></MenuItem>
                        <MenuItem value={'Sunday'}>Sunday</MenuItem>
                        <MenuItem value={'Monday'}>Monday</MenuItem>
                        <MenuItem value={'Tuesday'}>Tuesday</MenuItem>
                        <MenuItem value={'Wednesday'}>Wednesday</MenuItem>
                        <MenuItem value={'Thursday'}>Thursday</MenuItem>
                        <MenuItem value={'Friday'}>Friday</MenuItem>
                        <MenuItem value={'Saturday'}>Saturday</MenuItem>
                    </Select>
                </FormControl>
                <div className="">
                    <FloatingActionButton mini={true} onClick={this.props.addEditItemToggle}>
                        <ContentAdd />
                    </FloatingActionButton>
                </div>
            </div>
        )
    }
}
