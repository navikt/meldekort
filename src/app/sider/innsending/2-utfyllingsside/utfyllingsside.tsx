import * as React from 'react';
import { Innholdstittel } from 'nav-frontend-typografi';
import Sprakvelger from '../../../components/sprakvelger/sprakvelger';
import { FormattedMessage } from 'react-intl';
import NavKnapp, { knappTyper } from '../../../components/knapp/navKnapp';
import { hentDatoForForsteUke, hentUkenummerForDato } from '../../../utils/dates';
import { InnsendingState, SpmSvar, UtfyllingFeil } from '../../../types/innsending';
import { RootState } from '../../../store/configureStore';
import { connect } from 'react-redux';
import Konstanter from '../../../utils/consts';
import { UtfyltDag } from './utfylling/utfyllingConfig';
import { hentIntl } from '../../../utils/intlUtil';
import AlertStripe from 'nav-frontend-alertstriper';
import { Meldegruppe, Meldekort, SendtMeldekort } from '../../../types/meldekort';
import { scrollTilElement } from '../../../utils/scroll';
import UkePanel from '../../../components/ukepanel/ukepanel';
import { Dispatch } from 'redux';
import { InnsendingActions } from '../../../actions/innsending';
import { erAktivtMeldekortGyldig } from '../../../utils/meldekortUtils';
import { Redirect } from 'react-router';

interface MapStateToProps {
    innsending: InnsendingState;
    aktivtMeldekort: Meldekort;
    sendteMeldekort: SendtMeldekort[];
}

interface MapDispatchToProps {
    resetValideringsresultat: () => void;
}

type UtfyllingssideProps = MapStateToProps & MapDispatchToProps;

class Utfyllingsside extends React.Component<UtfyllingssideProps, UtfyllingFeil> {
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

    componentDidMount() {
        scrollTilElement(undefined, 'auto');
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

    validerAntallTimerForDag = (dager: UtfyltDag[]): boolean => {
        let feil: string[] = [];
        let feilIArbeidetTimer = false;
        let feilIArbeidetTimerHeleHalve = false;

        dager.map( dag => {
            if (typeof dag.arbeidetTimer !== 'undefined') {
                if ((Number(dag.arbeidetTimer) * 2) % 1 !== 0) {
                    feil.push(dag.dag + dag.uke);
                    feilIArbeidetTimerHeleHalve = true;
                } else if (Number(dag.arbeidetTimer) > 24 || Number(dag.arbeidetTimer) < 0) {
                    feil.push(dag.dag + dag.uke);
                    feilIArbeidetTimer = true;
                }
            }
        });
        this.setState({feilIDager: feil, feilIArbeidetTimerHeleHalve: feilIArbeidetTimerHeleHalve, feilIArbeidetTimer: feilIArbeidetTimer});
        return feil.length === 0;
    }

    valider = (): boolean => {
        this.props.resetValideringsresultat();
        let arbeidet = !this.sjekkSporsmal('arbeid');
        let kurs = !this.sjekkSporsmal('aktivitetArbeid');
        let syk = !this.sjekkSporsmal('forhindret');
        let ferie = !this.sjekkSporsmal('ferieFravar');
        let feilITimer = this.validerAntallTimerForDag(this.props.innsending.utfylteDager);

        this.props.innsending.utfylteDager.map(dag => {
            if (!arbeidet && typeof dag.arbeidetTimer !== 'undefined' && Number(dag.arbeidetTimer) > 0) {
                arbeidet = true;
            }
            if (!kurs && dag.kurs) {
                kurs = true;
            }
            if (!syk && dag.syk) {
                syk = true;
            }
            if (!ferie && dag.annetFravaer) {
                ferie = true;
            }
        });

        this.setState({
             feilIArbeid: { feil: !arbeidet },
             feilIKurs: { feil: !kurs },
             feilISyk: { feil: !syk },
             feilIFerie: { feil: !ferie }
        });

        let resultat = arbeidet && kurs && syk && ferie && feilITimer;
        if (!resultat) {
            scrollTilElement('feilmelding');
        }
        return resultat;
    }

    hentFeilmeldinger = () => {
        let { feilIArbeid, feilIKurs, feilISyk, feilIFerie, feilIArbeidetTimer, feilIArbeidetTimerHeleHalve} = this.state;
        const { valideringsResultat } = this.props.innsending;
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
        } else if (typeof valideringsResultat !== 'undefined') {
            if (valideringsResultat.status === 'FEIL') {
                return (
                    <AlertStripe className={'utfyllingFeil'} type={'advarsel'} solid={true}>
                        <ul>
                            {
                                valideringsResultat.arsakskoder.map(arsakskode => {
                                    return ( <li key={arsakskode.kode}>{arsakskode.tekst}</li> );
                                })
                            }
                        </ul>
                    </AlertStripe>
                );
            }
        }
        return null;
    }

    render() {
        let { aktivtMeldekort, sendteMeldekort } = this.props;
        let { meldeperiode } = aktivtMeldekort;

        return erAktivtMeldekortGyldig(aktivtMeldekort, sendteMeldekort) ? (
            <main>
                <section id="tittel" className="seksjon flex-innhold tittel-sprakvelger">
                    <Innholdstittel><FormattedMessage id="overskrift.steg2" /></Innholdstittel>
                    <Sprakvelger/>
                </section>
                <section className="seksjon flex-innhold sentrert">
                    <div id="feilmelding">
                        {this.hentFeilmeldinger()}
                    </div>
                    <div className={'utfylling-container'}>
                        <UkePanel
                            ukenummer={Konstanter().forsteUke}
                            faktiskUkeNummer={hentUkenummerForDato(meldeperiode.fra)}
                            datoTittel={hentDatoForForsteUke(meldeperiode.fra)}
                            utfyllingFeil={this.state}
                            erAap={this.props.aktivtMeldekort.meldegruppe === Meldegruppe.ATTF}
                        />
                        <UkePanel
                            ukenummer={Konstanter().andreUke}
                            faktiskUkeNummer={hentUkenummerForDato(meldeperiode.til)}
                            datoTittel={hentDatoForForsteUke(meldeperiode.til)}
                            utfyllingFeil={this.state}
                            erAap={this.props.aktivtMeldekort.meldegruppe === Meldegruppe.ATTF}
                        />
                    </div>
                </section>
                <section className="seksjon flex-innhold sentrert innsending-knapper">
                    <NavKnapp
                        type={knappTyper.hoved}
                        nestePath={'/bekreftelse'}
                        tekstid={'naviger.neste'}
                        className={'navigasjonsknapp'}
                        validering={this.valider}
                    />
                    <NavKnapp
                        type={knappTyper.standard}
                        nestePath={'/sporsmal'}
                        tekstid={'naviger.forrige'}
                        className={'navigasjonsknapp'}
                    />
                    <NavKnapp
                        type={knappTyper.flat}
                        nestePath={'/om-meldekort'}
                        tekstid={'naviger.avbryt'}
                        className={'navigasjonsknapp avbryt'}
                    />
                </section>
            </main>
        ) : <Redirect exact={true} to="/om-meldekort"/>;

    }
}

const mapStateToProps = (state: RootState): MapStateToProps => {
    return {
        innsending: state.innsending,
        aktivtMeldekort: state.aktivtMeldekort,
        sendteMeldekort: state.meldekort.sendteMeldekort
    };
};

const mapDispatchToProps = (dispatch: Dispatch): MapDispatchToProps => {
    return {
        resetValideringsresultat: () => dispatch(InnsendingActions.resetValideringsresultat()),
    };
};
export default connect(mapStateToProps, mapDispatchToProps)(Utfyllingsside);