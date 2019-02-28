import * as React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import Bekreftelse from '../pages/innsending/bekreftelse';
import Kvittering from '../pages/innsending/kvittering';
import Utfylling from '../pages/innsending/utfylling';
import Sporsmalsside from '../pages/innsending/sporsmalsside/sporsmalsside';
import MeldekortRoutes from './meldekortRoutes';
import StegBanner from '../components/stegindikator/stegBanner';
import PeriodeBanner from '../components/periodeBanner/periodeBanner';

const InnsendingRoutes = () => {
    return (
        <div className="sideinnhold">
            <PeriodeBanner />
            <StegBanner/>
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
