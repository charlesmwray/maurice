import React, { Component } from 'react';
import './styles/App.css';

// Theme
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import theme from './styles/theme/Theme';

// Auth
import firebase, { auth, provider } from './data/Firebase.js';

// Components
import Header from './components/Header.js';
import Items from './components/Items.js';
import AddEditItem from './components/AddEditItem.js';

class App extends Component {
    constructor() {
        super();
        this.state = {
            userInfo: null,
            filterDay: ''
        }
        this.login = this.login.bind(this);
        this.logout = this.logout.bind(this);
    }

    componentWillMount() {
        auth.onAuthStateChanged((user) => {
            user && this.setUser(user);
        });
    }

    setUser(userInfo) {
        // const userInfo = JSON.parse( localStorage.getItem('maurice') );
        this.setState({
            userInfo: userInfo
        });

        this.getItems();
    }

    logout() {
        auth.signOut().then(() => {
            this.setState({
                userInfo: null
            });
        });
    }

    login(andAddItem) {
        auth.signInWithPopup(provider).then((result) => {
            // State management handled by componentWillMount.auth.onAuthStateChanged
        });
    }

    filterItems(items, type, args) {
        if ( this.state.allItems ) {
            items = this.state.allItems;
        } else {
            return;
        }
        switch (type) {
            case 'day':
                return items.filter((item) => {
                       if ( item.airDay === args.airDay ) {
                           return true
                       } else {
                           return false;
                       }
                   })
                break;
            default:
                items.sort((a = false, b = false) =>{
                    return !a.watching
                });
                return items.filter((item) => {
                       if ( item.dateToBeReminded &&
                            ( new Date(item.dateToBeReminded + 'PDT') > new Date() )
                       ) {
                           return false;
                       } else {
                           return true;
                       }
                   })
        }
    }

    filterItemsByDay(day) {
        console.log(this.filterItems(null, 'day', day));
        this.setState({
            filterDay: day,
            itemsFilteredByDay: this.filterItems(null, 'day', {airDay: day} )
        })
    }

    getItems() {
        const itemsRef = firebase.database().ref('users/' + this.state.userInfo.uid + '/items');

        itemsRef.on('value', (snapshot) => {
            let snap = snapshot.val();
            let keys = Object.keys(snap);

            snap = keys.map((key) => {
                let item = snap[key]
                item.id = key;
                return item;
            });

            const days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
            const day = days[new Date().getDay()];

            this.setState({
                allItems: snap,
                itemsFilteredByDay: this.filterItemsByDay(day),
                filterDay: day
            });
            // this.filterItems(snap, 'day', { airDay: day });
        });
    }

    addEditItemToggle() {
        this.setState({addEditItemOpen: !this.state.addEditItemOpen});
    }


    editItem(editDetails) {
        this.setState({editItemDetails: editDetails});
        this.addEditItemToggle();
    }

    resetAddEditItem() {
        this.setState({editItemDetails: null});
    }

    render() {
        return (
            <MuiThemeProvider muiTheme={getMuiTheme(theme)}>
                <div className="App">
                    <Header
                        userInfo={this.state.userInfo}
                        login={ this.login.bind(this) }
                        logout={ this.logout.bind(this) }
                        addEditItemToggle={ this.addEditItemToggle.bind(this) }
                        filterItemsByDay={this.filterItemsByDay.bind(this)}
                    />
                    <Items
                        title={"On " + this.state.filterDay}
                        userInfo={this.state.userInfo}
                        items={this.state.itemsFilteredByDay}
                        editItem={this.editItem.bind(this)}
                    />
                    <Items
                        title="All"
                        userInfo={this.state.userInfo}
                        items={this.state.allItems}
                        editItem={this.editItem.bind(this)}
                    />
                    {
                        this.state.addEditItemOpen &&
                        <AddEditItem
                            uid={this.state.userInfo.uid}
                            editItemDetails={this.state.editItemDetails || null}
                            addEditItemToggle={this.addEditItemToggle.bind(this)}
                            resetAddEditItem={this.resetAddEditItem.bind(this)}
                        />
                    }
                </div>
            </MuiThemeProvider>
        );
    }
}

export default App;
