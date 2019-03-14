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
import { hentIntl } from '../../../utils/intlUtil';
import AlertStripe from 'nav-frontend-alertstriper';
import { KortType } from '../../../types/meldekort';
import { scrollToTop } from '../../../utils/scroll';

interface MapStateToProps {
    innsending: InnsendingState;
    aktivtMeldekort: AktivtMeldekortState;
}

interface SpmSvar {
    kategori: string;
    svar: boolean;
}

interface Feilmelding {
    feil: boolean;
    feilmelding?: string;
}

interface Feil {
    feilIArbeid: Feilmelding;
    feilIKurs: Feilmelding;
    feilISyk: Feilmelding;
    feilIFerie: Feilmelding;
    feilIArbeidetTimerHeleHalve: boolean;
    feilIArbeidetTimer: boolean;
    feilIDager: string[];
}

type UtfyllingssideProps = MapStateToProps;

class Utfyllingsside extends React.Component<UtfyllingssideProps, Feil> {
    constructor(props: UtfyllingssideProps) {
        super(props);
        this.state = {
            feilIArbeid: { feil: false },
            feilIKurs: { feil: false },
            feilISyk: { feil: false },
            feilIFerie: { feil: false },
            feilIArbeidetTimerHeleHalve: false,
            feilIArbeidetTimer: false,
            feilIDager: []};
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
        let aap: boolean = this.props.aktivtMeldekort.meldekort.kortType === KortType.AAP;
        return (
            <div className="ukepanel">
                <Undertittel className="uketittel flex-innhold sentrert">{datoTittel}</Undertittel>
                {this.sjekkSporsmal('arbeid') ?
                    <Arbeidsrad
                        ukeNummer={ukenummer}
                        feil={this.state.feilIArbeid.feil}
                        feilIDager={this.state.feilIDager}
                        aap={aap}
                        tekstId={'utfylling.arbeid'}
                        forklaingId={'forklaring.utfylling.arbeid'}
                    /> : null
                }
                {this.sjekkSporsmal('aktivitetArbeid') ?
                    <Aktivitetsrad
                        ukeNummer={ukenummer}
                        tekstId="utfylling.tiltak"
                        forklaingId={'forklaring.utfylling.tiltak'}
                        aap={aap}
                        feil={this.state.feilIKurs.feil}
                    /> : null
                }
                {this.sjekkSporsmal('forhindret') ?
                    <Aktivitetsrad
                        ukeNummer={ukenummer}
                        tekstId="utfylling.syk"
                        forklaingId={'forklaring.utfylling.syk'}
                        aap={aap}
                        feil={this.state.feilISyk.feil}
                    /> : null
                }
                {this.sjekkSporsmal('ferieFravar') ?
                    <Aktivitetsrad
                        ukeNummer={ukenummer}
                        tekstId="utfylling.ferieFravar"
                        forklaingId={'forklaring.utfylling.ferieFravar'}
                        aap={aap}
                        feil={this.state.feilIFerie.feil}
                    /> : null
                }
            </div>
        );
    }

    validerAntallTimerForDag = (dager: UtfyltDag[]): boolean => {
        let feil: string[] = [];
        let feilIArbeidetTimer = false;
        let feilIArbeidetTimerHeleHalve = false;

        dager.map( dag => {
            if (typeof dag.arbeidetTimer !== 'undefined') {
                if ((dag.arbeidetTimer * 2) % 1 !== 0) {
                    feil.push(dag.dag + dag.uke);
                    feilIArbeidetTimerHeleHalve = true;
                } else if (dag.arbeidetTimer > 24 || dag.arbeidetTimer < 0) {
                    feil.push(dag.dag + dag.uke);
                    feilIArbeidetTimer = true;
                }
            }
        });
        this.setState({feilIDager: feil, feilIArbeidetTimerHeleHalve: feilIArbeidetTimerHeleHalve, feilIArbeidetTimer: feilIArbeidetTimer});
        return feil.length === 0;
    }

    valider = (): boolean => {
        console.log('Validerer!');

        let arbeidet = !this.sjekkSporsmal('arbeid');
        let kurs = !this.sjekkSporsmal('aktivitetArbeid');
        let syk = !this.sjekkSporsmal('forhindret');
        let ferie = !this.sjekkSporsmal('ferieFravar');

        let feilITimer = this.validerAntallTimerForDag(this.props.innsending.utfylteDager);

        this.props.innsending.utfylteDager.map(dag => {
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

        this.setState({feilIArbeid: { feil: !arbeidet }, feilIKurs: { feil: !kurs }, feilISyk: { feil: !syk }, feilIFerie: { feil: !ferie }});
        let resultat = arbeidet && kurs && syk && ferie && feilITimer;
        if (!resultat) {
            scrollToTop();
        }
        return resultat;
    }

    hentFeilmeldinger = () => {
        let { feilIArbeid, feilIKurs, feilISyk, feilIFerie, feilIArbeidetTimer, feilIArbeidetTimerHeleHalve} = this.state;
        if (feilIArbeid.feil || feilIKurs.feil || feilISyk.feil || feilIFerie.feil || feilIArbeidetTimer || feilIArbeidetTimerHeleHalve) {
            let feiltekst = hentIntl().formatMessage({id: 'utfylling.ingenDagerUtfylt'});
            return (
                <AlertStripe className={'utfyllingFeil'} type={'advarsel'} solid={true}>
                    <ul>
                        {feilIArbeid.feil ?
                            <li>{`${feiltekst} "${hentIntl().formatMessage({id: 'utfylling.arbeid'}).trim()}"`}</li> : null
                        }
                        {feilIKurs.feil ?
                            <li>{`${feiltekst} "${hentIntl().formatMessage({id: 'utfylling.tiltak'}).trim()}"`}</li> : null
                        }
                        {feilISyk.feil ?
                            <li>{`${feiltekst} "${hentIntl().formatMessage({id: 'utfylling.syk'}).trim()}"`}</li> : null
                        }
                        {feilIFerie.feil ?
                            <li>{`${feiltekst} "${hentIntl().formatMessage({id: 'utfylling.ferieFravar'}).trim()}"`}</li> : null
                        }
                        {feilIArbeidetTimerHeleHalve ?
                            <li>{`${hentIntl().formatMessage({id: 'arbeidTimer.heleEllerHalveTallValidator'})}`}</li> : null
                        }
                        {feilIArbeidetTimer ?
                            <li>{`${hentIntl().formatMessage({id: 'arbeidTimer.rangeValidator.range'})}`}</li> : null
                        }
                    </ul>
                </AlertStripe>
            );
        }
        return null;
    }

    render() {
        let { meldeperiode } = this.props.aktivtMeldekort.meldekort;
        return(
            <main>
                <section className="seksjon flex-innhold tittel-sprakvelger">
                    <Innholdstittel><FormattedMessage id="overskrift.steg2" /></Innholdstittel>
                    <Sprakvelger/>
                </section>
                {this.hentFeilmeldinger()}
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