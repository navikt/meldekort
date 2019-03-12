import * as React from 'react';
import { Innholdstittel, Undertittel } from 'nav-frontend-typografi';
import Sprakvelger from '../../../components/sprakvelger/sprakvelger';
import { FormattedMessage } from 'react-intl';
import NavKnapp, { knappTyper } from '../../../components/knapp/navKnapp';
import Arbeidsrad from './utfylling/arbeid/arbeidsrad';
import Aktivitetsrad from './utfylling/aktivitet/aktivitetsrad';
import { hentNummerOgDatoForAndreUke, hentNummerOgDatoForForsteUke } from '../../../utils/dates';
import { InnsendingState } from '../../../types/innsending';
import { RootState } from '../../../store/configureStore';
import { connect } from 'react-redux';
import { AktivtMeldekortState } from '../../../reducers/aktivtMeldekortReducer';
import Konstanter from '../../../utils/consts';
import { UtfyltDag } from './utfylling/utfyllingConfig';

interface MapStateToProps {
    innsending: InnsendingState;
    aktivtMeldekort: AktivtMeldekortState;
}

interface SpmSvar {
    kategori: string;
    svar: boolean;
}

type UtfyllingssideProps = MapStateToProps;

// <> props inside
class Utfyllingsside extends React.Component<UtfyllingssideProps, any> {
    constructor(props: UtfyllingssideProps) {
        super(props);
    }

    hentSporsmal = (): SpmSvar[] => {
        let sporsmalListe: SpmSvar[] = [];
        this.props.innsending.sporsmalsobjekter.map(sporsmalobj => {
            sporsmalListe.push({
                kategori: sporsmalobj.kategori,
                svar: sporsmalobj.checked === undefined ? false : sporsmalobj.checked.endsWith('ja')
            });
        });
        return sporsmalListe;
    }

    sjekkSporsmal = (kategori: string): boolean => {
        let sporsmalListe = this.hentSporsmal();
        let sporsmal = sporsmalListe.filter( spm => spm.kategori === kategori);
        if (sporsmal.length !== 0) {
            return sporsmal[0].svar;
        }
        return false;
    }

    hentUkePanel = (ukenummer: number, datoTittel: string) => {
        return (
            <div className="ukepanel">
                <Undertittel className="uketittel flex-innhold sentrert">{datoTittel}</Undertittel>
                {this.sjekkSporsmal('arbeid') ?
                    <Arbeidsrad
                        ukeNummer={ukenummer}
                        feilmelding={'Her er det feil!'}
                        feilIDager={{mandag1: '', tirsdag1: '', sondag2: ''}}
                    /> : null
                }
                {this.sjekkSporsmal('aktivitetArbeid') ?
                    <Aktivitetsrad
                        ukeNummer={ukenummer}
                        tekstId="utfylling.tiltak"
                        feilmelding={'Her er det feil!'}
                    /> : null
                }
                {this.sjekkSporsmal('forhindret') ?
                    <Aktivitetsrad
                        ukeNummer={ukenummer}
                        tekstId="utfylling.syk"
                        feilmelding={'Her er det feil!'}
                    /> : null
                }
                {this.sjekkSporsmal('ferieFravar') ?
                    <Aktivitetsrad
                        ukeNummer={ukenummer}
                        tekstId="utfylling.ferieFravar"
                        feilmelding={'Her er det feil!'}
                    /> : null
                }
            </div>
        );
    }

    valider = (): boolean => {
        console.log('Validerer!');

        let arbeidet = !this.sjekkSporsmal('arbeid');
        let kurs = !this.sjekkSporsmal('aktivitetArbeid');
        let syk = !this.sjekkSporsmal('forhindret');
        let ferie = !this.sjekkSporsmal('ferieFravar');

        this.props.innsending.utfylteDager.map(dag => {
            // arbeidet = !arbeidet && typeof dag.arbeidetTimer !== 'undefined' && dag.arbeidetTimer !== 0;
            console.log(dag.arbeidetTimer);
            if (arbeidet === false && typeof dag.arbeidetTimer !== 'undefined' && dag.arbeidetTimer > 0) {
                arbeidet = true;
            }
            if (kurs === false && dag.kurs) {
                kurs = true;
            }
            if (syk === false && dag.syk) {
                syk = true;
            }
            if (ferie === false && dag.annetFravaer) {
                ferie = true;
            }
        });

        console.log(arbeidet);
        console.log(kurs);
        console.log(syk);
        console.log(ferie);
        return true;
    }

    render() {
        let { meldeperiode } = this.props.aktivtMeldekort.meldekort;
        return(
            <main>
                <Innholdstittel className="seksjon"><FormattedMessage id="overskrift.steg2" /></Innholdstittel>
                <section className="seksjon">
                    <Sprakvelger/>
                </section>
                {this.hentUkePanel(Konstanter().forsteUke, hentNummerOgDatoForForsteUke(meldeperiode.fra))}
                {this.hentUkePanel(Konstanter().andreUke, hentNummerOgDatoForAndreUke(meldeperiode.til))}
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
                        validering={this.valider}
                    />
                </section>
            </main>
        );

    }
}

const mapStateToProps = (state: RootState): MapStateToProps => {
    const meldekort: AktivtMeldekortState = {meldekort: state.aktivtMeldekort.meldekort};
    return {
        innsending: state.innsending,
        aktivtMeldekort: meldekort,
    };
};

export default connect(mapStateToProps, null)(Utfyllingsside);