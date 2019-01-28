import * as React from 'react';
import { Redirect, Route, Switch } from 'react-router';
import { ConnectedRouter } from 'connected-react-router';
import { history } from './store/configureStore';
import Banner from './components/banner/banner';
import NavTabs from './components/meny/tabsmeny';
import Demo from './components/demo/demo';
import SendMeldekort from './pages/sendMeldekort/sendMeldekort';
import TidligereMeldekort from './pages/tidligereMeldekort/tidligereMeldekort';
import OmMeldekort from './pages/omMeldekort/omMeldekort';
import OfteStilteSporsmal from './pages/ofteStilteSporsmal/ofteStilteSporsmal';

class App extends React.Component<{}> {

    public render() {

        return(
            <div>
                <Banner tittel="Meldekort"/>
                <NavTabs/>
                <main>
                    <div className="main-container">
                        <ConnectedRouter history={history}>
                            <Switch>
                                <Route exact={true} path="/send-meldekort" component={SendMeldekort} />
                                <Route path="/tidligere-meldekort" component={TidligereMeldekort} />
                                <Route  path="/demo" component={Demo}/>
                                <Route path="/om-meldekort" component={OmMeldekort} />
                                <Route path="/ofte-stilte-sporsmal" component={OfteStilteSporsmal} />
                                <Route path="/404" component={() => <div />} />
                                <Redirect exact={true} from="/" to="/send-meldekort"/>
                            </Switch>
                        </ConnectedRouter>
                    </div>
                </main>
            </div>
        );
    }
}

export default (App);