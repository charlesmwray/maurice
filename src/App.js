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

class App extends Component {
    constructor() {
        super();
        this.state = {
          userInfo: null
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

            this.setState({
                items: snap
            })
        });
    }

    render() {
        return (
            <MuiThemeProvider muiTheme={getMuiTheme(theme)}>
                <div className="App">
                    <Header userInfo={this.state.userInfo} login={ this.login.bind(this) } logout={ this.logout.bind(this) } />
                    <Items userInfo={this.state.userInfo} items={this.state.items} />
                </div>
            </MuiThemeProvider>
        );
    }
}

export default App;
