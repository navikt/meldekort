import * as React from 'react';
import { Route, Switch } from 'react-router';
import { ConnectedRouter } from 'connected-react-router';
import { history } from './store/configureStore';
import Banner from './components/banner/banner';
import MeldekortRoutes from './routes/meldekortRoutes';
import NavTabs from './components/meny/tabsmeny';
import setupMock from './mock/setup-mock';
import { erLocalhost, erMock } from './mock/utils';

if (erMock() || erLocalhost()) {
    setupMock();
}

class App extends React.Component<{}> {

    // TODO: Flytt koden fra NavTabs inn her, enten skal NavTabs vises eller stegindikator.

    public render() {

        return(
            <div>
                <Banner tittel="Meldekort"/>
                <NavTabs/>
                <div className="main-container">
                    <ConnectedRouter history={history}>
                        <Switch>
                            <Route path="/" component={MeldekortRoutes}/>
                        </Switch>
                    </ConnectedRouter>
                </div>
            </div>
        );
    }
}

export default (App);