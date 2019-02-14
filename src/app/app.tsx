import * as React from 'react';
import { Route, Switch } from 'react-router';
import { ConnectedRouter } from 'connected-react-router';
import { history } from './store/configureStore';
import Banner from './components/banner/banner';
import NavTabs from './components/meny/tabsmeny';
import MeldekortRoutes from './pages/routes/meldekortRoutes';

class App extends React.Component<{}> {

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