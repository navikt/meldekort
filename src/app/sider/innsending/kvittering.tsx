import * as React from 'react';
import { Innholdstittel } from 'nav-frontend-typografi';
import Sprakvelger from '../../components/sprakvelger/sprakvelger';
import { FormattedMessage } from 'react-intl';
import NavKnapp, { knappTyper } from '../../components/knapp/navKnapp';
import { RouteComponentProps } from 'react-router-dom';
import { AktivtMeldekortState } from '../../reducers/aktivtMeldekortReducer';
import { RootState } from '../../store/configureStore';
import { oppdaterAktivtMeldekort } from '../../actions/aktivtMeldekort';
import { InnsendingActions } from '../../actions/innsending';
import { Meldekort } from '../../types/meldekort';
import { Innsendingstyper } from '../../types/innsending';
import { Dispatch } from 'redux';
import { selectRouter } from '../../selectors/router';
import { connect } from 'react-redux';
import { Router } from '../../types/router';
import { Person } from '../../types/person';
import { isEmpty } from 'ramda';
import Environment from '../../utils/env';

interface MapStateToProps {
    router: Router;
    person: Person;
    aktivtMeldekort: Meldekort;
    innsendingstype: Innsendingstyper | null;
}

interface MapDispatchToProps {
    leggTilAktivtMeldekort: (aktivtMeldekort: Meldekort) => void;
    settInnsendingstype: (innsendingstype: Innsendingstyper | null) => void;
}

interface State {
    nesteAktivtMeldekort: Meldekort;
    nesteInnsendingsType: Innsendingstyper
}

type KvitteringsProps = RouteComponentProps & MapDispatchToProps & MapStateToProps;

class Kvittering extends React.Component<KvitteringsProps, State> {
    constructor(props: KvitteringsProps) {
        super(props);
    }

    // TODO: Logikk for å vise riktig knapp (Neste Meldekort // Neste Etterregistrerte Meldekort).
    // Sjekk innsendingsID mot aktivtMK & Gjør en sjekk på RIKTIG mk liste (ordinær eller etterR).
    // Er listen tom, sjekk liste nr to. Oppdater info riktig.
    // For å sette nesteMK, nestepath = innsending med innsendingstype = etteregistrer/innsending.
    // & sett aktivtMK. På kvitteringssiden eller via knappen? Most likely via knappen siden ellers tukler det med infoen på siden??
    // Eller? Hentes detaljene fra aktivtMeldekortobjektet? Spør yrjan.d

    listeHarFlereMeldekortIgjen = (meldekort: Meldekort[]) : boolean => {
        return (!isEmpty(meldekort) ) ? true : false;
    }

    personHarFlereMeldekort = (person: Person) => {
        (this.listeHarFlereMeldekortIgjen(person.meldekort) || this.listeHarFlereMeldekortIgjen(person.etterregistrerteMeldekort))
    }

    returnerRiktigTekstidBasertPaMeldekortListe = (meldekort: Meldekort[], tekstid1: string, tekstid2: string) => {
        return (!isEmpty(meldekort) ? tekstid1 : tekstid2);
    }
    returnerNesteInnsendingstype = () => {

    }
    returnerNesteAktivtMeldekort = () => {

    }

    render() {

        const {innsendingstype, person} = this.props;
        const {meldekort, etterregistrerteMeldekort} = this.props.person;

        // TODO: Må endre nestePath til der man kom fra da man startet innsending (send-meldekort, korrigering).
        let nesteInnsendingstype = Innsendingstyper.innsending;

        let nestePath = "/innsending";
        let videreKnappTekst = "tilbake.dittNav";
        let infoTekstid = "info Tekst greier kommer hit. default korrigering ingen meldekort?"; // Sett default id, du har ingen meldekort å vise igjen.

        // Hvis innsending, har flere mk igjen. Sett infotekstid, videreknapptekst, nesteinnsendingstype, aktivtMK (ord / etterR)
        if (innsendingstype === Innsendingstyper.innsending && this.personHarFlereMeldekort(person)) {
            infoTekstid = this.returnerRiktigTekstidBasertPaMeldekortListe(meldekort, "sendt.meldekortKanSendes", "sendt.etterregistrering.info");
            videreKnappTekst = this.returnerRiktigTekstidBasertPaMeldekortListe(meldekort, "overskrift.nesteMeldekort", "tilbake.dittNav");

        } else if (innsendingstype === Innsendingstyper.etterregistrering && this.personHarFlereMeldekort(person)) {
            infoTekstid = this.returnerRiktigTekstidBasertPaMeldekortListe(etterregistrerteMeldekort, "sendt.etterregistrering.info", "sendt.meldekortKanSendes");
            videreKnappTekst = this.returnerRiktigTekstidBasertPaMeldekortListe(etterregistrerteMeldekort, "overskrift.nesteMeldekort", "tilbake.dittNav",);

        } else {
            this.props.settInnsendingstype(null);
            nestePath = "/ditt-nav";
            if (innsendingstype === Innsendingstyper.korrigering) {
                infoTekstid = "Du har nå korrigert meldekortet. ";
            } else {
                infoTekstid = "Du har ingen meldekort!";
            }
        }

        const dittnav = Environment().dittNavUrl;
        console.log(dittnav);
    // Sett denne basert på antall MK som er igjen & om naværende innstype er korrigering
    const nesteAktivtMeldekort = this.props.aktivtMeldekort;
    return(
            <main>
                <Innholdstittel className="seksjon"><FormattedMessage id="overskrift.steg4" /></Innholdstittel>
                <section className="seksjon">
                    <Sprakvelger/>
                </section>
                <section className="seksjon">
                    <FormattedMessage id="tidligereMeldekort.forklaring" />
                </section>
                <section className="seksjon">
                    <FormattedMessage id={infoTekstid} />
                </section>
                <section className="seksjon flex-innhold sentrert">
                    <NavKnapp
                        type={knappTyper.standard}
                        nestePath={'/tidligere-meldekort'}
                        tekstid={'sendt.linkTilTidligereMeldekort'}
                        className={'navigasjonsknapp'}
                    />
                    <NavKnapp
                        type={knappTyper.hoved}
                        className={'navigasjonsknapp'}
                        tekstid={videreKnappTekst}
                        nestePath={nestePath}
                        nesteInnsendingstype={nesteInnsendingstype}
                        nesteAktivtMeldekort={nesteAktivtMeldekort}
                    />
                </section>
            </main>
        );
    }
}

const mapStateToProps = (state: RootState): MapStateToProps => {
    let meldekort: AktivtMeldekortState = {
        meldekort: state.aktivtMeldekort.meldekort
    };
    return {
        aktivtMeldekort: meldekort.meldekort,
        router: selectRouter(state),
        innsendingstype: state.innsending.innsendingstype,
        person: state.person.person,
    };
};

const mapDispatcherToProps = (dispatch: Dispatch): MapDispatchToProps => {
    return {
        leggTilAktivtMeldekort: (aktivtMeldekort: Meldekort) =>
            dispatch(oppdaterAktivtMeldekort(aktivtMeldekort)),
        settInnsendingstype: (innsendingstype: Innsendingstyper | null) =>
            dispatch(InnsendingActions.leggTilInnsendingstype(innsendingstype)),
    };
};

export default connect(mapStateToProps, mapDispatcherToProps)(Kvittering);
