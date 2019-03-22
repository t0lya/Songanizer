import React from 'react';
import ReactDOM from 'react-dom';
import { Route, BrowserRouter} from 'react-router-dom'

import './index.css';
import { App } from './App';
import * as serviceWorker from './serviceWorker';
import { Provider } from 'react-redux';
import { store } from './store'

import { Auth } from './components/Auth'
import { Playlist } from './components/Playlist'
import { Search } from './components/Search'
import Profile from './components/Profile'
import Home from './components/Home'
import MyPlaylist from './components/MyPlaylist'

ReactDOM.render(
    <BrowserRouter>
        <Provider store = {store}>
            <App>
                <Route exact path='/' component={Home}/>
                <Route exact path='/search' component={Search}/>
                <Route exact path='/profile' component={Auth(Profile)}/>
                <Route exact path='/playlist' component={Playlist}/>
                <Route exact path='/my_playlist' component={Auth(MyPlaylist)}/>
            </App>
        </Provider>
    </BrowserRouter>, document.getElementById('root'))

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
//serviceWorker.unregister();
