import * as React from 'react';
import { Redirect, Route, Switch } from 'react-router';
import { ConnectedRouter } from 'connected-react-router';
import { history } from './store/configureStore';
import Banner from './components/banner/banner';
import NavTabs from './components/Meny/tabsmeny';
import Demo from './components/demo/demo';
import SendMeldekort from './pages/sendMeldekort/sendMeldekort';
import TidligereMeldekort from './pages/tidligereMeldekort/tidligereMeldekort';
import Container from 'nav-frontend-grid/lib/container';
import OmMeldekort from './pages/omMeldekort/omMeldekort';
import OfteStilteSporsmal from './pages/ofteStilteSporsmal/ofteStilteSporsmal';
import EndreMeldeform from './pages/endreMeldeform/endreMeldeform';
import EtterregistrerMeldekort from './pages/etterregistrerMeldekort/etterregistrerMeldekort';

class App extends React.Component<{}> {

    public render() {

        return(
            <div>
                <Banner tittel="Meldekort"/>
                <NavTabs/>
                <main>
                    <Container>
                        <ConnectedRouter history={history}>
                            <Switch>
                                <Route exact={true} path="/send-meldekort" component={SendMeldekort} />
                                <Route path="/tidligere-meldekort" component={TidligereMeldekort} />
                                <Route path="/demo" component={Demo}/>
                                <Route path="/om-meldekort" component={OmMeldekort} />
                                <Route path="/ofte-stilte-sporsmal" component={OfteStilteSporsmal} />
                                <Route path="/endre-meldeform" component={EndreMeldeform} />
                                <Route path="/etterregistrer-meldekort" component={EtterregistrerMeldekort} />
                                <Route path="/404" component={() => <div />} />
                                <Redirect exact={true} from="/" to="/send-meldekort"/>
                            </Switch>
                        </ConnectedRouter>
                    </Container>
                </main>
            </div>
        );
    }
}

export default (App);