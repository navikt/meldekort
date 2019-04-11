import * as React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import Detaljer from './tidligereMeldekort/detaljer/detaljer';
import OfteStilteSporsmal from './ofteStilteSporsmal/ofteStilteSporsmal';
import EndreMeldeform from './endreMeldeform/endreMeldeform';
import SendMeldekort from './sendMeldekort/sendMeldekort';
import EtterregistrerMeldekort from './etterregistrerMeldekort/etterregistrerMeldekort';
import OmMeldekort from './omMeldekort/omMeldekort';
import TidligereMeldekort from './tidligereMeldekort/tidligereMeldekort';
import InnsendingRoutes from './innsending/innsendingRoutes';

const MeldekortRoutes = () => {

    return (
        <div>
            <Switch>
                <Route path="/send-meldekort/innsending" render={(props) => <InnsendingRoutes {...props}/>}/>
                <Route exact={true} path="/send-meldekort" render={() => (<SendMeldekort />)} />

                <Route path="/etterregistrer-meldekort/innsending" render={(props) => <InnsendingRoutes {...props}/>}/>
                <Route path="/etterregistrer-meldekort" render={() => <EtterregistrerMeldekort />} />

                <Route path="/tidligere-meldekort/detaljer/korriger" render={(props) => <InnsendingRoutes {...props} />}/>
                <Route path="/tidligere-meldekort/detaljer" render={(props) => <Detaljer {...props}/>} />
                <Route path="/tidligere-meldekort" render={(props) => <TidligereMeldekort {...props} />} />

                <Route path="/ofte-stilte-sporsmal" render={() => <OfteStilteSporsmal />} />
                <Route path="/om-meldekort" render={() => <OmMeldekort/>} />

                <Route path="/endre-meldeform" render={() => <EndreMeldeform />}/>

                <Route path="/404" component={() => <div />} />
                <Redirect exact={true} from="/" to="/send-meldekort"/>
            </Switch>
        </div>
    );
};

export default MeldekortRoutes;
