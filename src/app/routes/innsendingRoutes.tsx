import * as React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import Bekreftelse from '../pages/innsending/bekreftelsesside/bekreftelse';
import Kvittering from '../pages/innsending/kvittering';
import Utfyllingsside from '../pages/innsending/utfyllingsside/utfyllingsside';
import Sporsmalsside from '../pages/innsending/sporsmalsside/sporsmalsside';
import MeldekortRoutes from './meldekortRoutes';
import StegBanner from '../components/stegBanner/stegBanner';
import PeriodeBanner from '../components/periodeBanner/periodeBanner';

const InnsendingRoutes = () => {
    return (
        <div className="sideinnhold">
            <PeriodeBanner />
            <StegBanner/>
            <Switch>
                <Route exact={true} path="/innsending/sporsmal" component={Sporsmalsside} />
                <Route path="/innsending/utfylling" component={Utfyllingsside} />
                <Route path="/innsending/bekreftelse" component={Bekreftelse}/>
                <Route path="/innsending/kvittering" component={Kvittering} />
                <Route path="/send-meldekort" component={MeldekortRoutes}/>
                <Redirect exact={true} from="/innsending" to="/innsending/sporsmal"/>
            </Switch>
        </div>
    );
};

export default InnsendingRoutes;
