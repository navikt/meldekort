import * as React from 'react';
import { Route, Switch } from 'react-router';
import SendMeldekort from '../pages/sendMeldekort/sendMeldekort';
import TidligereMeldekort from '../pages/tidligereMeldekort/tidligereMeldekort';
import NavBar from '../components/NavBar';

            // <Route component={NoMatch} /> // ErrorPage
const routes = (
    <div>
        <NavBar />
        <Switch>
            <Route exact={true} path="/" component={SendMeldekort} />
            <Route path="/tidligere-meldekort" component={TidligereMeldekort} />
        </Switch>
    </div>
);

export default routes;