import * as React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import Bekreftelse from '../pages/innsending/bekreftelse';
import Kvittering from '../pages/innsending/kvittering';
import Utfylling from '../pages/innsending/utfylling';
import Sporsmalsside from '../pages/innsending/sporsmalsside';
import MeldekortRoutes from './meldekortRoutes';

const InnsendingRoutes = () => {
    return (
        <div>
            <Switch>
                <Route exact={true} path="/innsending/sporsmal" component={Sporsmalsside} />
                <Route path="/innsending/utfylling" component={Utfylling} />
                <Route path="/innsending/bekreftelse" component={Bekreftelse}/>
                <Route path="/innsending/kvittering" component={Kvittering} />
                <Route path="/send-meldekort" component={MeldekortRoutes}/>
                <Redirect exact={true} from="/innsending" to="/innsending/sporsmal"/>
            </Switch>
        </div>
    );
};

export default InnsendingRoutes;
