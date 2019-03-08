import * as React from 'react';
import { Redirect, Route, RouteComponentProps, Switch } from 'react-router-dom';
import Detaljer from '../pages/tidligereMeldekort/detaljer/detaljer';
import OfteStilteSporsmal from '../pages/ofteStilteSporsmal/ofteStilteSporsmal';
import EndreMeldeform from '../pages/endreMeldeform/endreMeldeform';
import SendMeldekort from '../pages/sendMeldekort/sendMeldekort';
import EtterregistrerMeldekort from '../pages/etterregistrerMeldekort/etterregistrerMeldekort';
import OmMeldekort from '../pages/omMeldekort/omMeldekort';
import TidligereMeldekort from '../pages/tidligereMeldekort/tidligereMeldekort';
import InnsendingRoutes from './innsendingRoutes';
import { Innsendingstyper } from '../types/innsending';

type PropsType = RouteComponentProps;

const MeldekortRoutes = (props: PropsType) => {
    return (
        <div>
            <Switch>
                <Route path="/send-meldekort/innsending" render={(props) => <InnsendingRoutes {...props} innsendingstype={Innsendingstyper.innsending}/>}/>
                <Route exact={true} path="/send-meldekort" render={() => (<SendMeldekort />)} />

                <Route path="/etterregistrer-meldekort/etterregistrer" render={(props) => <InnsendingRoutes {...props} innsendingstype={Innsendingstyper.etterregistrering}/>}/>
                <Route path="/etterregistrer-meldekort" render={() => <EtterregistrerMeldekort />} />

                <Route path="/tidligere-meldekort/detaljer/korriger" render={(props) => <InnsendingRoutes {...props} innsendingstype={Innsendingstyper.korrigering} />}/>
                <Route path="/tidligere-meldekort/detaljer" render={(props: RouteComponentProps<any>) => <Detaljer {...props}/>} />
                <Route path="/tidligere-meldekort" render={() => <TidligereMeldekort {...props} />} />

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
