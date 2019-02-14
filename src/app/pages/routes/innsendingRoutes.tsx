import * as React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import Bekreftelse from '../innsending/bekreftelse';
import Kvittering from '../innsending/kvittering';
import Utfylling from '../innsending/utfylling';
import Sporsmalsside from '../innsending/sporsmalsside';

const InnsendingRoutes = () => {
    return (
        <div>
            <Switch>
                <Route exact={true} path="/innsending/sporsmal" component={Sporsmalsside} />
                <Route path="/innsending/utfylling" component={Utfylling} />
                <Route path="/innsending/bekreftelse" component={Bekreftelse}/>
                <Route path="/innsending/kvittering" component={Kvittering} />
                <Route path="/404" component={() => <div />} />
                <Redirect exact={true} from="/innsending" to="/innsending/sporsmal"/>
            </Switch>
        </div>
    );
};

export default InnsendingRoutes;
