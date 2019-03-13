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

interface MapStateToProps {

}

interface MapDispatchToProps {

}

type KvitteringsProps = RouteComponentProps & MapDispatchToProps & MapStateToProps;

class Kvittering extends React.Component<KvitteringsProps, any> {
    constructor(props: KvitteringsProps) {
        super(props);
    }

    // TODO: Logikk for å vise riktig knapp (Neste Meldekort // Neste Etterregistrerte Meldekort).
    // Sjekk innsendingsID mot aktivtMK & Gjør en sjekk på RIKTIG mk liste (ordinær eller etterR).
    // Er listen tom, sjekk liste nr to. Oppdater info riktig.
    // For å sette nesteMK, nestepath = innsending med innsendingstype = etteregistrer/innsending.
    // & sett aktivtMK. På kvitteringssiden eller via knappen? Most likely via knappen siden ellers tukler det med infoen på siden??
    // Eller? Hentes detaljene fra aktivtMeldekortobjektet? Spør yrjan.

    componentDidMount() {

    }

    render() {

        // TODO: Må endre nestePath til der man kom fra da man startet innsending (send-meldekort, korrigering).
        const nestePath = "neste meldekort";
        const tekstid = "tekstid"; // Skal tilpasse seg basert på om det finnes mk i en av de to listene.
        // NestePath
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
                    <FormattedMessage id="sendt.meldekortKanSendes" />
                </section>
                <section className="seksjon">
                    <FormattedMessage id="sendt.etterregistrering.info" />
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
                        nestePath={nestePath}
                        tekstid={'overskrift.nesteMeldekort'}
                        className={'navigasjonsknapp'}
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
        aktivtMeldekort: meldekort,
        router: selectRouter(state),
        innsendingstype: state.innsending.innsendingstype,
    };
};

const mapDispatcherToProps = (dispatch: Dispatch): MapDispatchToProps => {
    return {
        leggTilAktivtMeldekort: (aktivtMeldekort: Meldekort) =>
            dispatch(oppdaterAktivtMeldekort(aktivtMeldekort)),
        settInnsendingstype: (innsendingstype: Innsendingstyper) =>
            dispatch(InnsendingActions.leggTilInnsendingstype(innsendingstype)),
    };
};

export default connect(mapStateToProps, mapDispatcherToProps)(Kvittering);
