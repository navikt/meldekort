import * as React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import OfteStilteSporsmal from '../ofteStilteSporsmal/ofteStilteSporsmal';
import EndreMeldeform from '../endreMeldeform/endreMeldeform';
import SendMeldekort from '../sendMeldekort/sendMeldekort';
import EtterregistrerMeldekort from '../etterregistrerMeldekort/etterregistrerMeldekort';
import OmMeldekort from '../omMeldekort/omMeldekort';
import TidligereMeldekort from '../tidligereMeldekort/tidligereMeldekort';
import InnsendingRoutes from './innsendingRoutes';

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
                <Route path="/innsending" component={InnsendingRoutes} />
                <Route path="/404" component={() => <div />} />
                <Redirect exact={true} from="/" to="/send-meldekort"/>
            </Switch>
        </div>
    );
};

export default MeldekortRoutes;
