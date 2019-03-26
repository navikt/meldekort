import * as React from 'react';
import { Innholdstittel, Normaltekst } from 'nav-frontend-typografi';
import Sprakvelger from '../../components/sprakvelger/sprakvelger';
import { FormattedHTMLMessage, FormattedMessage } from 'react-intl';
import Veilederpanel from 'nav-frontend-veilederpanel';

import veileder from '../../ikoner/veileder.svg';
import { hentIntl } from '../../utils/intlUtil';

class OmMeldekort extends React.Component<any, any> {
    constructor(props: any) {
        super(props);
    }

    render() {
        console.log(hentIntl().formatMessage({id: 'genereltOmMeldekort.informasjonOmMeldekortLink'}));
        return(
            <div className="sideinnhold">
                <section className="seksjon flex-innhold tittel-sprakvelger">
                    <Innholdstittel><FormattedMessage id="overskrift.genereltOmMeldekort" /></Innholdstittel>
                    <Sprakvelger/>
                </section>
                <Veilederpanel type={'plakat'} kompakt={true} svg={<img alt={'Veileder'} src={veileder}/>}>
                    <section className="seksjon">
                        <Normaltekst><FormattedMessage id="genereltOmMeldekort.velkommen" /></Normaltekst>
                        <Normaltekst><FormattedMessage id="genereltOmMeldekort.velge" /></Normaltekst>
                        <ul>
                            <li><FormattedMessage id="genereltOmMeldekort.valg.sende" /></li>
                            <li><FormattedMessage id="genereltOmMeldekort.valg.tidligere" /></li>
                            <li><FormattedMessage id="genereltOmMeldekort.valg.endre"/></li>
                        </ul>
                        <Normaltekst><FormattedHTMLMessage
                            id="genereltOmMeldekort.om.meldekort"
                            values={{
                                0: 'https://www.nav.no',
                                1: hentIntl().formatMessage({id: 'genereltOmMeldekort.informasjonOmMeldekortLink'}).trim()
                            }}
                        /></Normaltekst>
                        <Normaltekst><FormattedMessage id="genereltOmMeldekort.oss" /></Normaltekst>
                    </section>
                </Veilederpanel>
            </div>
        );
    }
}

export default OmMeldekort;
