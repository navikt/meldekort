import * as React from 'react';
import { Redirect, Route, Switch } from 'react-router';
import { ConnectedRouter } from 'connected-react-router';
import { history } from './store/configureStore';
import './App.less';
import Banner from './components/banner/banner';
import NavTabs from './components/Meny/navtabs';
import Demo from './components/demo/demo';
import SendMeldekort from './pages/sendMeldekort/sendMeldekort';
import TidligereMeldekort from './pages/tidligereMeldekort/tidligereMeldekort';

class App extends React.Component<{}> {

    public render() {

        return(
            <div className="App">
                <Banner tittel="Meldekort"/>
                <NavTabs/>
                <h3>Meldekortgreiene</h3>
                <br/>
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
            </div>
        );
    }
}

export default (App);