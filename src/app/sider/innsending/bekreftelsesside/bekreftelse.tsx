import * as React from 'react';
import AlertStripe from 'nav-frontend-alertstriper';
import Meldekortdetaljer from '../../../components/meldekortdetaljer/meldekortdetaljer';
import NavKnapp, { knappTyper } from '../../../components/knapp/navKnapp';
import Sprakvelger from '../../../components/sprakvelger/sprakvelger';
import { AktivtMeldekortState } from '../../../reducers/aktivtMeldekortReducer';
import { connect } from 'react-redux';
import { FormattedHTMLMessage, FormattedMessage } from 'react-intl';
import { Innholdstittel, Normaltekst } from 'nav-frontend-typografi';
import { InnsendingActions } from '../../../actions/innsending';
import { InnsendingState } from '../../../types/innsending';
import { MeldekortdetaljerState } from '../../../reducers/meldekortdetaljerReducer';
import { Person } from '../../../types/person';
import { RootState } from '../../../store/configureStore';
import {
    Fravaer,
    FravaerTypeEnum,
    Meldegruppe,
    Meldekort,
    MeldekortDag,
    Meldekortdetaljer as MDetaljer,
    MeldekortdetaljerInnsending
} from '../../../types/meldekort';
import { hentIntl } from '../../../utils/intlUtil';
import { BekreftCheckboksPanel } from 'nav-frontend-skjema';
import { scrollToTop } from '../../../utils/scroll';
import { Dispatch } from 'redux';
import { kalkulerDato } from '../../../utils/dates';

interface MapStateToProps {
    innsending: InnsendingState;
    aktivtMeldekort: AktivtMeldekortState;
    person: Person;
}

interface MapDispatchToProps {
    oppdaterMeldekortdetaljer: (mdetaljer: MDetaljer) => void;
    settMeldekortdetaljerInnsending: (meldekortdetaljerInnsending: MeldekortdetaljerInnsending) => void;
    kontrollerMeldekort: (meldekortdetaljerInnsending: MeldekortdetaljerInnsending) => void;
}

type BekreftelseProps = MapStateToProps & MapDispatchToProps;

interface DetaljerOgFeil {
    meldekortdetaljer: MeldekortdetaljerState;
    feilmelding: string;
}

class Bekreftelse extends React.Component<BekreftelseProps, DetaljerOgFeil> {

    constructor(props: BekreftelseProps) {
        super(props);
        this.state = {meldekortdetaljer: this.konverterInnsendingTilMeldekortdetaljer(), feilmelding: ''};
        console.log(this.konverterInnsendingTilMeldekortdetaljer());
    }

    konverterInnsendingTilMeldekortdetaljer = (): MeldekortdetaljerState => {
        let { aktivtMeldekort, innsending, person } = this.props;
        let mDet = {
            meldekortdetaljer: {
                id: '',
                personId: person.personId,
                fodselsnr: person.fodselsnr,
                meldekortId: aktivtMeldekort.meldekort.meldekortId,
                meldeperiode: aktivtMeldekort.meldekort.meldeperiode.periodeKode,
                arkivnokkel: '1-ELEKTRONISK',
                kortType: aktivtMeldekort.meldekort.kortType,
                meldeDato: new Date(),
                lestDato: new Date(),
                begrunnelse: '',
                sporsmal: {
                    arbeidet: innsending.sporsmalsobjekter[0].checked === undefined ? false : innsending.sporsmalsobjekter[0].checked.endsWith('ja'),
                    kurs: innsending.sporsmalsobjekter[1].checked === undefined ? false : innsending.sporsmalsobjekter[1].checked.endsWith('ja'),
                    syk: innsending.sporsmalsobjekter[2].checked === undefined ? false : innsending.sporsmalsobjekter[2].checked.endsWith('ja'),
                    annetFravaer: innsending.sporsmalsobjekter[3].checked === undefined ? false : innsending.sporsmalsobjekter[3].checked.endsWith('ja'),
                    arbeidssoker: innsending.sporsmalsobjekter[4].checked === undefined ? false : innsending.sporsmalsobjekter[4].checked.endsWith('ja'),
                    signatur: false,
                    meldekortDager: this.hentMeldekortDager()
                }
            }
        };
        this.props.oppdaterMeldekortdetaljer(mDet.meldekortdetaljer);
        return mDet;
    }

    konverterMeldekortdetaljerTilMeldekortdetaljerInnsending = (): MeldekortdetaljerInnsending => {
        let { meldekortdetaljer } = this.state.meldekortdetaljer;
        let { meldekort } = this.props.aktivtMeldekort;
        return {
            meldekortId: meldekortdetaljer.meldekortId,
            kortType: meldekortdetaljer.kortType,
            kortStatus: meldekort.kortStatus,
            meldegruppe: meldekort.meldegruppe,
            mottattDato: meldekortdetaljer.meldeDato,
            meldeperiode: meldekort.meldeperiode,
            erArbeidssokerNestePeriode: meldekortdetaljer.sporsmal.arbeidssoker,
            korrigerbart: true, // Her må det sjekkes på om innsendingen er en korrigering (settes da til false)
            begrunnelse: '', // Begrunnelse må legges til ved korrigering
            signatur: meldekortdetaljer.sporsmal.signatur,
            fnr: meldekortdetaljer.fodselsnr,
            personId: meldekortdetaljer.personId,
            sesjonsId: 'test', // TODO: Denne må settes til noe fornuftig. Mulig vi må lage en egen sesjonsId.
            fravaersdager: this.hentFravaersdager(meldekortdetaljer, meldekort)
        };
    }

    hentFravaersdager = (meldekortdetaljer: MDetaljer, meldekort: Meldekort): Fravaer[] => {
        let fravar: Fravaer[] = [];
        meldekortdetaljer.sporsmal.meldekortDager.map( meldekortDag => {
            let dato = kalkulerDato(meldekort.meldeperiode.fra, meldekortDag.dag);
            if (typeof meldekortDag.arbeidetTimerSum !== 'undefined' && meldekortDag.arbeidetTimerSum > 0) {
                fravar.push({
                    dag: dato,
                    type: { typeFravaer: FravaerTypeEnum.ARBEIDS_FRAVAER },
                    arbeidTimer: meldekortDag.arbeidetTimerSum
                });
            }
            if (meldekortDag.syk) {
                fravar.push({
                    dag: dato,
                    type: { typeFravaer: FravaerTypeEnum.SYKDOM },
                });
            }
            if (meldekortDag.kurs) {
                fravar.push({
                    dag: dato,
                    type: { typeFravaer: FravaerTypeEnum.KURS_UTDANNING },
                });
            }
            if (meldekortDag.annetFravaer) {
                fravar.push({
                    dag: dato,
                    type: { typeFravaer: FravaerTypeEnum.ANNET_FRAVAER },
                });
            }
        });
        return fravar;
    }

    hentMeldekortDager = (): MeldekortDag[] => {
        let meldekortdager: MeldekortDag[] = [];
        let dagTeller = 0;
        this.props.innsending.utfylteDager.map( utfyltDag => {
            meldekortdager.push({
                dag: dagTeller,
                arbeidetTimerSum: typeof utfyltDag.arbeidetTimer === 'undefined' ? 0 : utfyltDag.arbeidetTimer,
                syk: utfyltDag.syk,
                kurs: utfyltDag.kurs,
                annetFravaer: utfyltDag.annetFravaer
            });
            dagTeller++;
        });
        return meldekortdager;
    }

    settChecked = () => {
        let detaljer = this.state.meldekortdetaljer;
        detaljer.meldekortdetaljer.sporsmal.signatur = !detaljer.meldekortdetaljer.sporsmal.signatur;
        if (detaljer.meldekortdetaljer.sporsmal.signatur) {
            this.setState({feilmelding: ''});
        }
        this.setState({meldekortdetaljer: detaljer});
    }

    valider = (): boolean => {
       let sign = this.state.meldekortdetaljer.meldekortdetaljer.sporsmal.signatur;

       if (!sign) {
           this.setState({feilmelding: hentIntl().formatMessage({id: 'utfylling.bekreft.feil'})});
           scrollToTop();
       } else {
           let mDetaljerInn = this.konverterMeldekortdetaljerTilMeldekortdetaljerInnsending();
           this.props.oppdaterMeldekortdetaljer(this.state.meldekortdetaljer.meldekortdetaljer);
           this.props.settMeldekortdetaljerInnsending(mDetaljerInn);
           this.props.kontrollerMeldekort(mDetaljerInn);
       }
       return sign;
    }

    hoppOverUtfylling = () => {
        let { sporsmal } = this.props.innsending.meldekortdetaljer;
        return !sporsmal.arbeidet && !sporsmal.kurs && !sporsmal.syk && !sporsmal.annetFravaer;
    }

    render() {
        let { meldegruppe } = this.props.aktivtMeldekort.meldekort;
        let { meldekortdetaljer } = this.state.meldekortdetaljer;
        let { feilmelding } = this.state;
        let aap = meldegruppe === Meldegruppe.ATTF;
        return(
            <main>
                <div className="ikkeSendt">
                    <AlertStripe type={'info'} solid={true}>
                        <span>{
                            `${hentIntl().formatMessage({id: 'overskrift.steg3.info.ikkeSendt'})}
                             ${hentIntl().formatMessage({id: 'overskrift.steg3.info.bekreftVerdier'})}`}
                        </span>
                    </AlertStripe>
                </div>
                {this.state.feilmelding === '' ? null :
                    <AlertStripe type={'advarsel'} solid={true}>
                        {this.state.feilmelding}
                    </AlertStripe>
                }
                <section className="seksjon flex-innhold tittel-sprakvelger">
                    <Innholdstittel><FormattedMessage id="overskrift.steg3" /></Innholdstittel>
                    <Sprakvelger/>
                </section>
                <Meldekortdetaljer meldekortdetaljer={meldekortdetaljer} erAap={aap}/>
                <BekreftCheckboksPanel
                    className={'bekreftInfo'}
                    onChange={() => this.settChecked()}
                    checked={meldekortdetaljer.sporsmal.signatur}
                    label={hentIntl().formatMessage({id: 'utfylling.bekreftAnsvar'})}
                    feil={feilmelding === '' ? undefined : {feilmelding: feilmelding}}
                >
                    <Normaltekst><FormattedHTMLMessage id={'utfylling.bekreft' + (aap ? '-AAP' : '')}/></Normaltekst>
                </BekreftCheckboksPanel>
                <section className="seksjon flex-innhold sentrert">
                    <NavKnapp
                        type={knappTyper.standard}
                        nestePath={this.hoppOverUtfylling() ? '/innsending/sporsmal' : '/innsending/utfylling'}
                        tekstid={'naviger.forrige'}
                        className={'navigasjonsknapp'}
                    />
                    <NavKnapp
                        type={knappTyper.hoved}
                        nestePath={'/innsending/kvittering'}
                        tekstid={'naviger.send'}
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
        person: state.person,
    };
};

const mapDispatcherToProps = (dispatch: Dispatch): MapDispatchToProps => {
    return {
        oppdaterMeldekortdetaljer: (mdetaljer: MDetaljer) =>
            dispatch(InnsendingActions.oppdaterMeldekortdetaljer(mdetaljer)),
        settMeldekortdetaljerInnsending: (meldekortdetaljerInnsending: MeldekortdetaljerInnsending) =>
            dispatch(InnsendingActions.settMeldekortdetaljerInnsending(meldekortdetaljerInnsending)),
        kontrollerMeldekort: (meldekortdetaljerInnsending: MeldekortdetaljerInnsending) =>
            dispatch(InnsendingActions.kontrollerMeldekort.request(meldekortdetaljerInnsending))
    };
};

export default connect(mapStateToProps, mapDispatcherToProps)(Bekreftelse);