import * as React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import OfteStilteSporsmal from '../ofteStilteSporsmal/ofteStilteSporsmal';
import EndreMeldeform from '../endreMeldeform/endreMeldeform';
import SendMeldekort from '../sendMeldekort/sendMeldekort';
import EtterregistrerMeldekort from '../etterregistrerMeldekort/etterregistrerMeldekort';
import OmMeldekort from '../omMeldekort/omMeldekort';
import TidligereMeldekort from '../tidligereMeldekort/tidligereMeldekort';
import Sporsmalsside from '../innsending/sporsmalsside';
import Utfylling from '../innsending/utfylling';
import Bekreftelse from '../innsending/bekreftelse';
import Kvittering from '../innsending/kvittering';

const MeldekortRoutes = () => {
    return (
        <div>
            <Switch>
                <Route exact={true} path="/send-meldekort" component={SendMeldekort} />
                <Route path="/tidligere-meldekort" component={TidligereMeldekort} />
                <Route path="/endre-meldeform" component={EndreMeldeform} />
                <Route path="/etterregistrer-meldekort" component={EtterregistrerMeldekort} />
                <Route path="/om-meldekort" component={OmMeldekort} />
                <Route path="/ofte-stilte-sporsmal" component={OfteStilteSporsmal} />
                <Route exact={true} path="/innsending/sporsmal" component={Sporsmalsside} />
                <Route path="/innsending/utfylling" component={Utfylling} />
                <Route path="/innsending/bekreftelse" component={Bekreftelse}/>
                <Route path="/innsending/kvittering" component={Kvittering} />
                <Route path="/send-meldekort" component={SendMeldekort} />
                <Route path="/404" component={() => <div />} />
                <Redirect exact={true} from="/innsending" to="/innsending/sporsmal"/>
                <Redirect exact={true} from="/" to="/send-meldekort"/>
            </Switch>
        </div>
    );
};

export default MeldekortRoutes;
