import * as React from 'react';
import { Innholdstittel } from 'nav-frontend-typografi';
import Sprakvelger from '../../components/sprakvelger/sprakvelger';
import { FormattedMessage } from 'react-intl';

// <> props inside
class Kvittering extends React.Component<any, any> {

    // Functions & Methods

    render() {
        return(
            <div className="sideinnhold">
                <Innholdstittel className="seksjon"><FormattedMessage id="overskrift.steg4" /></Innholdstittel>
                <section className="seksjon">
                    <Sprakvelger/>
                </section>
                <section className="seksjon">
                    <FormattedMessage id="tidligereMeldekort.forklaring" />
                </section>
                <section className="seksjon">
                    <FormattedMessage id="tidligereMeldekort.forklaring.korrigering" />
                </section>
                <section className="seksjon flex-innhold sentrert">
                    <a
                        className="knapp knapp--hoved"
                        href=""
                    >
                        <FormattedMessage id="sendMeldekort.knapp.startUtfylling"/>
                    </a>
                </section>
            </div>
        );

    }
}

export default Kvittering;
