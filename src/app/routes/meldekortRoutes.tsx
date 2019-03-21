import * as React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import Detaljer from '../pages/tidligereMeldekort/detaljer/detaljer';
import OfteStilteSporsmal from '../pages/ofteStilteSporsmal/ofteStilteSporsmal';
import EndreMeldeform from '../pages/endreMeldeform/endreMeldeform';
import SendMeldekort from '../pages/sendMeldekort/sendMeldekort';
import EtterregistrerMeldekort from '../pages/etterregistrerMeldekort/etterregistrerMeldekort';
import OmMeldekort from '../pages/omMeldekort/omMeldekort';
import TidligereMeldekort from '../pages/tidligereMeldekort/tidligereMeldekort';
import InnsendingRoutes from './innsendingRoutes';

import { connect } from 'react-redux';

class MeldekortRoutes extends React.Component<any, any> {

    constructor(props: any) {
        super(props);
    }

    render() {
        return (
            <div>
                <Switch>
                    <Route exact={true} path="/send-meldekort" component={SendMeldekort}/>
                    <Route path="/endre-meldeform" component={EndreMeldeform}/>
                    <Route path="/etterregistrer-meldekort" component={EtterregistrerMeldekort}/>
                    <Route path="/om-meldekort" component={OmMeldekort}/>
                    <Route path="/ofte-stilte-sporsmal" component={OfteStilteSporsmal}/>
                    <Route path="/404" component={() => <div/>}/>
                    <Route path="/innsending" component={InnsendingRoutes}/>
                    <Route path="/tidligere-meldekort/detaljer" component={Detaljer}/>
                    <Route path="/tidligere-meldekort" component={TidligereMeldekort}/>
                    <Redirect exact={true} from="/" to="/send-meldekort"/>

                </Switch>
            </div>
        );
    }
}

export default connect(null, null)(MeldekortRoutes);
