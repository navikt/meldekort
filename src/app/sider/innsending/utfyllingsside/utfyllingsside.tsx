import * as React from 'react';
import { Innholdstittel, Undertittel } from 'nav-frontend-typografi';
import Sprakvelger from '../../../components/sprakvelger/sprakvelger';
import { FormattedMessage } from 'react-intl';
import NavKnapp, { knappTyper } from '../../../components/knapp/navKnapp';
import Arbeidsrad from './utfylling/arbeid/arbeidsrad';
import Aktivitetsrad from './utfylling/aktivitet/aktivitetsrad';
import { hentNummerOgDatoForAndreUke, hentNummerOgDatoForForsteUke } from '../../../utils/dates';

// <> props inside
class Utfyllingsside extends React.Component<any, any> {

    hentUkePanel = (datoTittel: string) => {
        return (
            <div className="ukepanel">
                <Undertittel className="uketittel flex-innhold sentrert">{datoTittel}</Undertittel>
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
                <section className="seksjon flex-innhold tittel-sprakvelger">
                    <Innholdstittel ><FormattedMessage id="overskrift.steg2" /></Innholdstittel>
                    <Sprakvelger/>
                </section>
                {this.hentUkePanel(hentNummerOgDatoForForsteUke(new Date()))}
                {this.hentUkePanel(hentNummerOgDatoForAndreUke(new Date()))}
                <section className="seksjon flex-innhold sentrert">
                    <NavKnapp
                        type={knappTyper.standard}
                        nestePath={'/sporsmal'}
                        tekstid={'naviger.forrige'}
                        className={'navigasjonsknapp'}
                    />
                    <NavKnapp
                        type={knappTyper.hoved}
                        nestePath={'/bekreftelse'}
                        tekstid={'naviger.neste'}
                        className={'navigasjonsknapp'}
                    />
                </section>
            </main>
        );

    }
}

export default Utfyllingsside;