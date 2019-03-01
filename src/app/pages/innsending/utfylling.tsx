import * as React from 'react';
import { Innholdstittel, Undertittel } from 'nav-frontend-typografi';
import Sprakvelger from '../../components/sprakvelger/sprakvelger';
import { FormattedMessage } from 'react-intl';
import NavKnapp, { knappTyper } from '../../components/knapp/navKnapp';
import Arbeidsrad from '../../components/utfylling/arbeid/arbeidsrad';
import Aktivitetsrad from '../../components/utfylling/aktivitet/aktivitetsrad';

// <> props inside
class Utfylling extends React.Component<any, any> {

    // Functions & Methods 
    
    hentUkeRad = (ukeTekst: string) => {
        return (
            <div>
                <Undertittel className="uketittel flex-innhold sentrert">{ukeTekst}</Undertittel>
                <Arbeidsrad/>
                <Aktivitetsrad tekstId="utfylling.tiltak"/>
                <Aktivitetsrad tekstId="utfylling.syk"/>
                <Aktivitetsrad tekstId="utfylling.ferieFravar"/>
            </div>
        );

    }

    render() {
        return(
            <main>
                <Innholdstittel className="seksjon"><FormattedMessage id="overskrift.steg2" /></Innholdstittel>
                <section className="seksjon">
                    <Sprakvelger/>
                </section>
                {this.hentUkeRad('Test')}
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