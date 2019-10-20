import React from 'react';
import { Router, Route, Switch } from "react-router";
import Client from './pages/client/Client';
import { createBrowserHistory } from "history";
import ExcuseGenerator from './pages/plugins/excuse-generator/ExcuseGenerator';
import socketio from "socket.io-client";
import { AppContext } from './app-context';

const history = createBrowserHistory();
const socket = socketio.connect('http://localhost:8080', {
    transports: ['websocket'],
});

const OurRouter: React.FC = () => {
    return (
        <AppContext.Provider value={{socket}}>
            <Router history={history}>
                <Switch>
                    <Route exact path="/client" component={Client} />

                    <Route exact path="/plugins/excuse-generator" component={ExcuseGenerator} />
                </Switch>
            </Router>
        </AppContext.Provider>
    );
}

export default OurRouter;
