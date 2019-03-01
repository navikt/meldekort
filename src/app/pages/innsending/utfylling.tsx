import * as React from 'react';
import { Innholdstittel } from 'nav-frontend-typografi';
import Sprakvelger from '../../components/sprakvelger/sprakvelger';
import { FormattedMessage } from 'react-intl';
import NavKnapp, { knappTyper } from '../../components/knapp/navKnapp';

// <> props inside
class Utfylling extends React.Component<any, any> {

    // Functions & Methods 

    render() {
        return(
            <main>
                <Innholdstittel className="seksjon"><FormattedMessage id="overskrift.steg2" /></Innholdstittel>
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
                    <NavKnapp
                        type={knappTyper.standard}
                        nestePath={'/innsending/sporsmal'}
                        tekstid={'naviger.forrige'}
                        className={'navigasjonsknapp'}
                    />
                    <NavKnapp
                        type={knappTyper.hoved}
                        nestePath={'/innsending/bekreftelse'}
                        tekstid={'naviger.neste'}
                        className={'navigasjonsknapp'}

                    />
                </section>
            </main>
        );

    }
}

export default Utfylling;