import * as React from 'react';
import { Innholdstittel } from 'nav-frontend-typografi';
import Sprakvelger from '../../../components/sprakvelger/sprakvelger';
import { FormattedMessage, FormattedHTMLMessage } from 'react-intl';
import NavKnapp, { knappTyper } from '../../../components/knapp/navKnapp';
import AlertStripe from 'nav-frontend-alertstriper';
import SporsmalsGruppe from './sporsmal/sporsmalsGruppe';
import { connect } from 'react-redux';
import { history, RootState } from '../../../store/configureStore';
import { Dispatch } from 'redux';
import { AktivtMeldekortState } from '../../../reducers/aktivtMeldekortReducer';
import { Meldegruppe } from '../../../types/meldekort';
import { InnsendingActions } from '../../../actions/innsending';
import { Sporsmal } from './sporsmal/sporsmalConfig';
import { InnsendingState, SpmSvar } from '../../../types/innsending';
import { RouteComponentProps } from 'react-router';
import { hentIntl } from '../../../utils/intlUtil';
import { scrollToTop } from '../../../utils/scroll';
import { IModal, ModalKnapp } from '../../../types/ui';
import { UiActions } from '../../../actions/ui';
import { ikkeFortsetteRegistrertContent } from '../../../components/modal/ikkeFortsetteRegistrertContent';
import Veilederpanel from 'nav-frontend-veilederpanel';
import veileder from '../../../ikoner/veileder.svg';

interface MapStateToProps {
    aktivtMeldekort: AktivtMeldekortState;
    innsending: InnsendingState;
}

interface MapDispatchToProps {
    oppdaterSvar: (sporsmalsobjekt: Sporsmal[]) => void;
    skjulModal: () => void;
    resetSporsmalOgUtfylling: () => void;
    visModal: (modal: IModal) => void;
}

type SporsmalssideProps = MapStateToProps & MapDispatchToProps & RouteComponentProps;

const kategorier = ['arbeid', 'aktivitetArbeid', 'forhindret', 'ferieFravar', 'registrert'];

class Sporsmalsside extends React.Component<SporsmalssideProps, any> {
    constructor(props: SporsmalssideProps) {
        super(props);
    }

    valider = (): boolean => {

        let arbeidet = this.sjekkSporsmal(kategorier[0]);
        let kurs = this.sjekkSporsmal(kategorier[1]);
        let syk = this.sjekkSporsmal(kategorier[2]);
        let ferie = this.sjekkSporsmal(kategorier[3]);
        let registrert = this.sjekkSporsmal(kategorier[4]);

        const nySporsmalsobjekterState = this.props.innsending.sporsmalsobjekter
            .map( sporsmalsobj => {
                switch (sporsmalsobj.kategori) {
                    case kategorier[0]:
                        return { ...sporsmalsobj, feil: {erFeil: !arbeidet, feilmeldingId: sporsmalsobj.feil.feilmeldingId}};
                    case kategorier[1]:
                        return { ...sporsmalsobj, feil: {erFeil: !kurs, feilmeldingId: sporsmalsobj.feil.feilmeldingId}};
                    case kategorier[2]:
                        return { ...sporsmalsobj, feil: {erFeil: !syk, feilmeldingId: sporsmalsobj.feil.feilmeldingId}};
                    case kategorier[3]:
                        return { ...sporsmalsobj, feil: {erFeil: !ferie, feilmeldingId: sporsmalsobj.feil.feilmeldingId}};
                    case kategorier[4]:
                        return { ...sporsmalsobj, feil: {erFeil: !registrert, feilmeldingId: sporsmalsobj.feil.feilmeldingId}};
                    default:
                        return {...sporsmalsobj};
                }
            });
        this.props.oppdaterSvar(nySporsmalsobjekterState);

        let resultat = arbeidet && kurs && syk && ferie && registrert;
        if (!resultat) {
            scrollToTop();
            return resultat;
        }

        if (!this.fortsetteRegistrert()) {
            this.props.visModal({
                content: () => ikkeFortsetteRegistrertContent(),
                knapper: this.ikkeFortsetteRegistrertKnapper(),
                visModal: true,
            });
            return false;
        }

        return resultat;
    }

    hentSvarPaaSporsmal = (): SpmSvar[] => {
        let sporsmalListe: SpmSvar[] = [];
        this.props.innsending.sporsmalsobjekter.map(sporsmalobj => {
            sporsmalListe.push({
                kategori: sporsmalobj.kategori,
                svar: sporsmalobj.checked === undefined ? false : sporsmalobj.checked.endsWith('ja')
            });
        });
        return sporsmalListe;
    }

    fortsetteRegistrert = (): boolean => {
        let sporsmal = this.hentSvarPaaSporsmal().filter( spm => spm.kategori === kategorier[4]);
        if (sporsmal.length !== 0) {
            return sporsmal[0].svar;
        }
        return false;
    }

    hentSporsmal = (): SpmSvar[] => {
        let sporsmalListe: SpmSvar[] = [];

        this.props.innsending.sporsmalsobjekter.map(sporsmalobj => {
            sporsmalListe.push({
                kategori: sporsmalobj.kategori,
                svar: typeof sporsmalobj.checked !== 'undefined'
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

    hentFeilmeldinger = (aap: boolean) => {
        let { sporsmalsobjekter } = this.props.innsending;
        let feilIArbeid = sporsmalsobjekter[0].feil.erFeil;
        let feillIKurs = sporsmalsobjekter[1].feil.erFeil;
        let feilISyk = sporsmalsobjekter[2].feil.erFeil;
        let feilIFerie = sporsmalsobjekter[3].feil.erFeil;
        let feilIRegistrert = sporsmalsobjekter[4].feil.erFeil;

        if (feilIArbeid || feillIKurs || feilISyk || feilIFerie || feilIRegistrert) {
            return (
                <AlertStripe type={'advarsel'} solid={true}>
                    <ul>
                        {feilIArbeid ?
                            <li>{`${hentIntl().formatMessage({id: 'arbeidet.required'})}`}</li> : null
                        }
                        {feillIKurs ?
                            <li>{`${hentIntl().formatMessage({id: 'kurs.required' + (aap ? '-AAP' : '')})}`}</li> : null
                        }
                        {feilISyk ?
                            <li>{`${hentIntl().formatMessage({id: 'syk.required' + (aap ? '-AAP' : '')})}`}</li> : null
                        }
                        {feilIFerie ?
                            <li>{`${hentIntl().formatMessage({id: 'annetFravar.required' + (aap ? '-AAP' : '')})}`}</li> : null
                        }
                        {feilIRegistrert ?
                            <li>{`${hentIntl().formatMessage({id: 'fortsetteRegistrert.required'})}`}</li> : null
                        }
                    </ul>
                </AlertStripe>
            );
        }
    }

    hoppeOverUtfylling = (): boolean => {
        let jaSvar = false;
        this.hentSvarPaaSporsmal().map(spm => {
            if (spm.kategori !== kategorier[4] && spm.svar && !jaSvar) {
                jaSvar = true;
            }
        });
        return !jaSvar;
    }

    resetSporsmalOgUtfyllingHvisAktivtMeldekortIdErLikInnsendingMeldekortId = () => {
        const { aktivtMeldekort, innsending, resetSporsmalOgUtfylling } = this.props;
        if ( aktivtMeldekort.meldekort.meldekortId !== innsending.meldekortId ) {
            resetSporsmalOgUtfylling();
        }
    }

    componentDidMount() {
        this.resetSporsmalOgUtfyllingHvisAktivtMeldekortIdErLikInnsendingMeldekortId();
    }

    render() {
        const { innsending, aktivtMeldekort } = this.props;
        const meldegruppeErAAP = aktivtMeldekort.meldekort.meldegruppe === Meldegruppe.ATTF;
        const brukermelding = hentIntl().formatMessage({id: 'meldekort.bruker.melding'});
        console.log(brukermelding.length);
        return (
            <main>
                <section className="seksjon flex-innhold sentrert">
                    {brukermelding.length > 1 ?
                        <AlertStripe type={'info'}>
                            {brukermelding}
                        </AlertStripe> : null
                    }
                </section>
                <section className="seksjon flex-innhold tittel-sprakvelger">
                    <Innholdstittel ><FormattedMessage id="overskrift.steg1" /></Innholdstittel>
                    <Sprakvelger/>
                </section>
                <section className="seksjon alert">
                    <Veilederpanel type={'plakat'} kompakt={true} svg={<img alt="Veilder" src={veileder}/>}>
                        <div className="item">
                            <FormattedMessage id="sporsmal.lesVeiledning" />
                        </div>
                        <div className="item">
                            <FormattedMessage id="sporsmal.ansvarForRiktigUtfylling" />
                        </div>
                    </Veilederpanel>
                </section>
                <section className="seksjon">
                    {this.hentFeilmeldinger(meldegruppeErAAP)}
                </section>
                <section className="seksjon">
                    <SporsmalsGruppe AAP={meldegruppeErAAP} innsending={innsending}/>
                </section>
                <section className="seksjon">
                    <AlertStripe type="info">
                        <FormattedHTMLMessage id="sporsmal.registrertMerknad" />
                    </AlertStripe>
                </section>
                <section className="seksjon flex-innhold sentrert">
                    <NavKnapp
                        type={knappTyper.hoved}
                        nestePath={this.hoppeOverUtfylling() ? '/bekreftelse' : '/utfylling'}
                        tekstid={'naviger.neste'}
                        className={'navigasjonsknapp'}
                        validering={this.valider}
                    />
                </section>

            </main>
        );

    }

    ikkeFortsetteRegistrertKnapper = (): ModalKnapp[] => {
        return [
            {
                action: () => {
                    history.push(this.hoppeOverUtfylling() ? '/innsending/bekreftelse' : '/innsending/utfylling');
                    this.props.skjulModal();
                },
                label: hentIntl().formatMessage({id: 'overskrift.bekreftOgFortsett'}),
                type: 'hoved'
            },
            {
                action: () => {
                    this.props.skjulModal();
                },
                label: hentIntl().formatMessage({id: 'sporsmal.tilbakeEndre'}),
                type: 'standard'
            },
        ];
    }
}

// TODO: Bytt til å hente meldekortDetaljer fra Store
const mapStateToProps = (state: RootState): MapStateToProps => {
    const meldekort: AktivtMeldekortState = {meldekort: state.aktivtMeldekort.meldekort};
    return {
        aktivtMeldekort: meldekort,
        innsending: state.innsending
    };
};

const mapDispatcherToProps = (dispatch: Dispatch): MapDispatchToProps => {
    return {
        oppdaterSvar: (sporsmalsobjekter: Sporsmal[]) =>
            dispatch(InnsendingActions.oppdaterSpm(sporsmalsobjekter)),
        skjulModal: () => dispatch(UiActions.skjulModal()),
        visModal: (modal: IModal) => dispatch(UiActions.visModal(modal)),
        resetSporsmalOgUtfylling: () =>
            dispatch(InnsendingActions.resetSporsmalOgUtfylling()),
    };
};

export default connect(mapStateToProps, mapDispatcherToProps)(Sporsmalsside);