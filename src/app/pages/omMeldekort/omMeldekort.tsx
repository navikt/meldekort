import * as React from 'react';
import { Innholdstittel, Normaltekst } from 'nav-frontend-typografi';
import Sprakvelger from '../../components/sprakvelger/sprakvelger';
import { FormattedHTMLMessage, FormattedMessage } from 'react-intl';
import Veilederpanel from 'nav-frontend-veilederpanel';

import veileder from '../../ikoner/veileder.svg';

class OmMeldekort extends React.Component<any, any> {
    constructor(props: any) {
        super(props);
    }

    render() {
        return(
            <div className="sideinnhold">
                <Innholdstittel className="seksjon"><FormattedMessage id="overskrift.genereltOmMeldekort" /></Innholdstittel>
                <section className="seksjon">
                    <Sprakvelger/>
                </section>
                <Veilederpanel type={'plakat'} svg={<img src={veileder}/>}>
                    <section className="seksjon">
                        <Normaltekst><FormattedMessage id="genereltOmMeldekort.velkommen" /></Normaltekst>
                        <Normaltekst><FormattedMessage id="genereltOmMeldekort.velge" /></Normaltekst>
                        <ul>
                            <li><FormattedMessage id="genereltOmMeldekort.valg.sende" /></li>
                            <li><FormattedMessage id="genereltOmMeldekort.valg.tidligere" /></li>
                            <li><FormattedMessage id="genereltOmMeldekort.valg.endre" /></li>
                        </ul>
                        {/* TODO: Fikse lenke i teksten genereltOmMeldekort.om.meldekort */}
                        <Normaltekst><FormattedHTMLMessage id="genereltOmMeldekort.om.meldekort" /></Normaltekst>
                        <Normaltekst><FormattedMessage id="genereltOmMeldekort.oss" /></Normaltekst>
                    </section>
                </Veilederpanel>
            </div>
        );
    }
}

export default OmMeldekort;
