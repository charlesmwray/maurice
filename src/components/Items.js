import React from 'react';
import Paper from 'material-ui/Paper';
import IconButton from 'material-ui/IconButton';
import Switch from '@material-ui/core/Switch';
import FormControlLabel from '@material-ui/core/FormControlLabel';

// Data
import firebase from '../data/Firebase.js';

// Styles
import '../styles/Items.css';

const itemStyle = {
    backgroundColor: 'rgba(255, 255, 255, .3)',
    color: 'white',
    margin: '20px',
    padding: '10px 15px',
    textAlign: 'center',
    textTransform: 'capitalize',
    display: 'block',
};

const actionStyle = {
    padding: 0,
    color: 'white',
    height: '24px',
    verticalAlign: 'middle',
    marginRight: 0
}

const Channel = (props) => {
    if (props.channel) {
        return (
            <span className={ 'channel ' + props.channel.replace(' ','-')}>{
                    props.channel.substr(0,1).toUpperCase() !== 'r' ? props.channel.substr(0,1).toUpperCase() : '$'
            }</span>
        )
    } else {
        return null
    }
}

const Items = (props) => {
    const ItemList = (props) => {

        if (!props.items) {
            return  <h2>None.</h2>;
        }

        const markAsWatching = (e, id, currentState) => {
            e.preventDefault();

            const itemsRef = firebase.database().ref( 'users/' + props.uid + '/items/' + id );

            itemsRef.update({ watching: !currentState });
        }

        const removeItem = (e, id) => {
            e.preventDefault();

            const itemsRef = firebase.database().ref( 'users/' + props.uid + '/items/' + id );

            itemsRef.update({ active: false });
        }

        return (
            props.items && props.items.map( (item, i) => {
                if (item.active) {
                    return (
                        <Paper
                            style={itemStyle}
                            zDepth={1}
                            key={i}
                            className="item-container"
                        >
                            <div className="item">
                                <div className="name">
                                    <Channel channel={item.channel} />
                                    {item.name}
                                </div>
                                <div className={ "actions" + (item.watching ? " active" : "") }>
                                    <FormControlLabel
                                        style={ {marginRight: 0 } }
                                        control={
                                            <Switch
                                                style={ actionStyle }
                                                checked={ item.watching || false }
                                                onChange={ e => { markAsWatching(e, item.id, item.watching) }  }
                                            />
                                        }
                                    />
                                    <IconButton
                                        style={actionStyle}
                                        tooltip="Delete Item."
                                        onClick={ (e) => { removeItem(e, item.id) } }
                                    >
                                        <i className="material-icons">remove_circle</i>
                                    </IconButton>
                                    <IconButton
                                        style={actionStyle}
                                        tooltip="Edit item."
                                        onClick={() => { props.editItem(item) }}
                                    >
                                        <i className="material-icons">edit</i>
                                    </IconButton>
                                </div>
                            </div>
                        </Paper>
                    )
                }
            })
        )
    }

    return (
        <div className="item-section">
            <h1>{props.title}</h1>
            {
                props.userInfo &&
                <div className="items">
                    <ItemList items={props.items} uid={props.userInfo.uid} editItem={props.editItem} />
                </div>
            }
        </div>
    )
}

export default Items;
