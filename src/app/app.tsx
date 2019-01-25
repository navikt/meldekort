import * as React from 'react';
import { Redirect, Route, Switch } from 'react-router';
import { ConnectedRouter } from 'connected-react-router';
import { history } from './store/configureStore';
import Banner from './components/banner/banner';
import NavTabs from './components/Meny/tabsmeny';
import Demo from './components/demo/demo';
import SendMeldekort from './pages/sendMeldekort/sendMeldekort';
import TidligereMeldekort from './pages/tidligereMeldekort/tidligereMeldekort';

class App extends React.Component<{}> {

    public render() {

        return(
            <div className="app">
                <div className="app-container">
                    <Banner tittel="Meldekort"/>
                    <NavTabs/>
                    <main className="app-container main">
                        <ConnectedRouter history={history}>
                            <Switch>
                                <Route exact={true} path="/send-meldekort" component={SendMeldekort} />
                                <Route path="/tidligere-meldekort" component={TidligereMeldekort} />
                                <Route  path="/demo" component={Demo}/>
                                <Route path="/404" component={() => <div />} />
                                <Route path="/send-meldekort" component={SendMeldekort} />
                                <Redirect exact={true} from="/" to="/send-meldekort"/>
                            </Switch>
                        </ConnectedRouter>
                    </main>
                </div>
            </div>
        );
    }
}

export default (App);