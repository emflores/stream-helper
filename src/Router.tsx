import React from 'react';
import { Router, Route, Switch } from "react-router";
import Client from './pages/client/Client';
import { createBrowserHistory } from "history";

const history = createBrowserHistory();

const OurRouter: React.FC = () => {
    return (
        <Router history={history}>
            <Switch>
                <Route exact path="/client" component={Client} />
            </Switch>
        </Router>
    );
}

  export default OurRouter;
