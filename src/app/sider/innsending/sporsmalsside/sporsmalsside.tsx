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
import { Begrunnelse, InnsendingState, Innsendingstyper, SpmSvar } from '../../../types/innsending';
import { RouteComponentProps } from 'react-router';
import { hentIntl } from '../../../utils/intlUtil';
import { scrollToTop } from '../../../utils/scroll';
import { IModal, ModalKnapp } from '../../../types/ui';
import { UiActions } from '../../../actions/ui';
import { ikkeFortsetteRegistrertContent } from '../../../components/modal/ikkeFortsetteRegistrertContent';

interface MapStateToProps {
    aktivtMeldekort: AktivtMeldekortState;
    innsending: InnsendingState;
}

interface MapDispatchToProps {
    oppdaterSvar: (sporsmalsobjekt: Sporsmal[]) => void;
    skjulModal: () => void;
    resetSporsmalOgUtfylling: () => void;
    visModal: (modal: IModal) => void;
    settBegrunnelse: (begrunnelse: Begrunnelse) => void;
}

type SporsmalssideProps = MapStateToProps & MapDispatchToProps & RouteComponentProps;

const kategorier = ['arbeid', 'aktivitetArbeid', 'forhindret', 'ferieFravar', 'registrert'];

class Sporsmalsside extends React.Component<SporsmalssideProps, any> {
    constructor(props: SporsmalssideProps) {
        super(props);
    }

    valider = (): boolean => {
        const { sporsmalsobjekter, begrunnelse, innsendingstype } = this.props.innsending;

        const arbeidet = this.sjekkSporsmal(kategorier[0]);
        const kurs = this.sjekkSporsmal(kategorier[1]);
        const syk = this.sjekkSporsmal(kategorier[2]);
        const ferie = this.sjekkSporsmal(kategorier[3]);
        const registrert = this.sjekkSporsmal(kategorier[4]);
        const begrunnelseValgt = begrunnelse.valgtArsak === '' && innsendingstype === Innsendingstyper.korrigering;
        console.log('begrunnelsevalgt', begrunnelseValgt);
        const nySporsmalsobjekterState = sporsmalsobjekter
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
        this.props.settBegrunnelse({
            valgtArsak: begrunnelse.valgtArsak,
            erFeil: begrunnelseValgt
        });

        const resultat = arbeidet && kurs && syk && ferie && registrert && begrunnelseValgt;
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
        const sporsmal = this.hentSvarPaaSporsmal().filter( spm => spm.kategori === kategorier[4]);
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
        const sporsmalListe = this.hentSporsmal();
        const sporsmal = sporsmalListe.filter( spm => spm.kategori === kategori);
        if (sporsmal.length !== 0) {
            return sporsmal[0].svar;
        }
        return false;
    }

    hentFeilmeldinger = (aap: boolean) => {
        const { sporsmalsobjekter, begrunnelse, innsendingstype } = this.props.innsending;
        const feilIArbeid = sporsmalsobjekter[0].feil.erFeil;
        const feillIKurs = sporsmalsobjekter[1].feil.erFeil;
        const feilISyk = sporsmalsobjekter[2].feil.erFeil;
        const feilIFerie = sporsmalsobjekter[3].feil.erFeil;
        const feilIRegistrert = sporsmalsobjekter[4].feil.erFeil;
        const feilIBegrunnelse = begrunnelse.erFeil && innsendingstype === Innsendingstyper.korrigering;

        if (feilIArbeid || feillIKurs || feilISyk || feilIFerie || feilIRegistrert || feilIBegrunnelse) {
            return (
                <AlertStripe type={'advarsel'} solid={true}>
                    <ul>
                        {feilIBegrunnelse ?
                            <li>{`${hentIntl().formatMessage({id: 'begrunnelse.required'})}`}</li> : null
                        }
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

        return (
            <main>
                <section className="seksjon flex-innhold tittel-sprakvelger">
                    <Innholdstittel ><FormattedMessage id="overskrift.steg1" /></Innholdstittel>
                    <Sprakvelger/>
                </section>
                <section className="seksjon alert">
                    <AlertStripe solid={true} type="info">
                        <div className="item">
                            <FormattedMessage id="sporsmal.lesVeiledning" />
                        </div>
                        <div className="item">
                            <FormattedMessage id="sporsmal.ansvarForRiktigUtfylling" />
                        </div>
                    </AlertStripe>
                </section>
                <section className="seksjon">
                    {this.hentFeilmeldinger(meldegruppeErAAP)}
                </section>
                <section className="seksjon">
                    <SporsmalsGruppe AAP={meldegruppeErAAP} innsending={innsending}/>
                </section>
                <section className="seksjon">
                    <AlertStripe solid={true} type="info">
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
        settBegrunnelse: (begrunnelsesobj: Begrunnelse) =>
            dispatch(InnsendingActions.settBegrunnelse(begrunnelsesobj))
    };
};

export default connect(mapStateToProps, mapDispatcherToProps)(Sporsmalsside);