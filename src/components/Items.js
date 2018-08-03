import React, { Component } from 'react';
import Paper from 'material-ui/Paper';
import IconButton from 'material-ui/IconButton';

// Data
import firebase from '../data/Firebase.js';

// Styles
import '../styles/Items.css';

const itemStyle = {
    backgroundColor: 'rgba(255, 255, 255, .3)',
    margin: '20px',
    padding: '10px 15px',
    textAlign: 'center',
    display: 'block',
};

const actionStyle = {
    color: '#fff',
    padding: 0,
    height: '24px',
    width: '24px'
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
        const removeItem = (id) => {
            const itemsRef = firebase.database().ref( 'users/' + props.uid + '/items/' + id );

            itemsRef.update({ active: false });
        }

        return (
            props.items && props.items.map( (item, i) => {
                if (item.active) {
                    return (
                        <Paper style={itemStyle} zDepth={1} key={i} className="item-container">
                            <div className="item">
                                <div className="name">
                                    <Channel channel={item.channel} />
                                    {item.name}
                                </div>
                                <div className="actions">
                                    <IconButton style={actionStyle} tooltip="Delete item." onClick={ () => { removeItem(item.id) } }>
                                        <i className="material-icons">remove_circle</i>
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
        <div className="items">
            {
                props.items &&
                <ItemList items={props.items} uid={props.userInfo.uid} />
            }
        </div>
    )
}

export default Items;
