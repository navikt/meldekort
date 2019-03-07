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

type PathParams = {
    innsendingstype: string,
}

type PropsType = RouteComponentProps<PathParams>;

const MeldekortRoutes = (props: PropsType) => {
    return (
        <div>
            <Switch>
                <Route path="send-meldekort/innsending" render={(props: RouteComponentProps<any>) => (<InnsendingRoutes {...props}/>)}/>
                <Route exact={true} path="/send-meldekort" render={(props: RouteComponentProps<any>) => (<SendMeldekort />)} />

                <Route path="/endre-meldeform" render={(props: RouteComponentProps<any>) => (<EndreMeldeform />)}/>

                <Route path="/etterregistrer-meldekort" render={(props: RouteComponentProps<any>) => (<EtterregistrerMeldekort />)} />
                <Route path="etterregistrer-meldekort/innsending" render={(props: RouteComponentProps<any>) => (<InnsendingRoutes {...props} />)}/>

                <Route path="/tidligere-meldekort/detaljer" render={(props: RouteComponentProps<any>) => (<Detaljer />)} />
                <Route path="/tidligere-meldekort" render={(props: RouteComponentProps<any>) => (<TidligereMeldekort />)} />
                <Route path="tidligere-meldekort/korriger" render={(props: RouteComponentProps<any>) => (<InnsendingRoutes {...props} />)}/>

                <Route path="/ofte-stilte-sporsmal" render={(props: RouteComponentProps<any>) => (<OfteStilteSporsmal />)} />
                <Route path="/om-meldekort" render={(props: RouteComponentProps<any>) => (<OmMeldekort/>)} />

                <Route path="/404" component={() => <div />} />
                <Redirect exact={true} from="/" to="/send-meldekort"/>
            </Switch>
        </div>
    );
};

export default MeldekortRoutes;
