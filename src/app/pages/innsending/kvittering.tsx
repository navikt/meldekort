import * as React from 'react';
import { Innholdstittel } from 'nav-frontend-typografi';
import Sprakvelger from '../../components/sprakvelger/sprakvelger';
import { FormattedMessage } from 'react-intl';
import NavKnapp, { knappTyper } from '../../components/knapp/navKnapp';

// <> props inside
class Kvittering extends React.Component<any, any> {

    // Functions & Methods

    render() {

        // TODO: Må endre nestePath til der man kom fra da man startet innsending.

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
                    <NavKnapp
                        type={knappTyper.standard}
                        nestePath={'/send-melding'}
                        tekstid={'naviger.avbryt'}
                        className={'navigasjonsknapp'}
                    />
                    <NavKnapp
                        type={knappTyper.hoved}
                        nestePath={'/send-melding'}
                        tekstid={'overskrift.nesteMeldekort'}
                        className={'navigasjonsknapp'}
                    />
                </section>
            </div>
        );

    }
}

export default Kvittering;
