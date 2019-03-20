import * as React from 'react';
import { Innholdstittel } from 'nav-frontend-typografi';
import Sprakvelger from '../../../components/sprakvelger/sprakvelger';
import { FormattedMessage } from 'react-intl';
import NavKnapp, { knappTyper } from '../../../components/knapp/navKnapp';
import { RouteComponentProps } from 'react-router-dom';
import { AktivtMeldekortState } from '../../../reducers/aktivtMeldekortReducer';
import { RootState } from '../../../store/configureStore';
import { oppdaterAktivtMeldekort } from '../../../actions/aktivtMeldekort';
import { InnsendingActions } from '../../../actions/innsending';
import { Meldekort } from '../../../types/meldekort';
import { InnsendingState, Innsendingstyper } from '../../../types/innsending';
import { Dispatch } from 'redux';
import { selectRouter } from '../../../selectors/router';
import { connect } from 'react-redux';
import { Router } from '../../../types/router';
import { Person } from '../../../types/person';
import { isEmpty } from 'ramda';

interface MapStateToProps {
    router: Router;
    person: Person;
    aktivtMeldekort: Meldekort;
    innsending: InnsendingState;
    innsendingstype: Innsendingstyper | null;
}

interface MapDispatchToProps {
    leggTilAktivtMeldekort: (aktivtMeldekort: Meldekort) => void;
    settInnsendingstype: (innsendingstype: Innsendingstyper | null) => void;
}

type KvitteringsProps = RouteComponentProps & MapDispatchToProps & MapStateToProps;

class Kvittering extends React.Component<KvitteringsProps> {
    constructor(props: KvitteringsProps) {
        super(props);
    }

    returnerMeldekortListaMedFlereMeldekortIgjen = (meldekort1: Meldekort[], innsendingstype1: Innsendingstyper, meldekort2: Meldekort[], innsendingstype2: Innsendingstyper) => {
        let nesteAktivtMeldekort, nesteInnsendingstype;
        if (!isEmpty(meldekort1)) {
            nesteAktivtMeldekort = meldekort1[0];
            nesteInnsendingstype = innsendingstype1;
        } else {
            nesteAktivtMeldekort = meldekort2[0];
            nesteInnsendingstype = innsendingstype2;
        }
        return { nesteAktivtMeldekort: nesteAktivtMeldekort, nesteInnsendingstype: nesteInnsendingstype }
    };

    returnerPropsVerdier = () => {
        const { innsendingstype, person, router } = this.props;
        const urlParams = router.location.pathname.split('/');
        urlParams.pop();
        let knappTekstid: string, nestePath: string,
            nesteAktivtMeldekort, nesteInnsendingstype;
        nestePath = urlParams.join('/');
        if ( innsendingstype === Innsendingstyper.innsending && (!isEmpty(person.meldekort) || !isEmpty(person.etterregistrerteMeldekort))) {
            knappTekstid = "overskrift.nesteMeldekort";
            const params = this.returnerMeldekortListaMedFlereMeldekortIgjen(person.meldekort, Innsendingstyper.innsending, person.etterregistrerteMeldekort, Innsendingstyper.etterregistrering);
            nesteAktivtMeldekort = params.nesteAktivtMeldekort;
            nesteInnsendingstype = params.nesteInnsendingstype;
        } else if (innsendingstype === Innsendingstyper.etterregistrering && (!isEmpty(person.meldekort) || !isEmpty(person.etterregistrerteMeldekort))) {
            knappTekstid = "overskrift.etterregistrertMeldekort";
            const params = this.returnerMeldekortListaMedFlereMeldekortIgjen(person.etterregistrerteMeldekort, Innsendingstyper.etterregistrering, person.meldekort, Innsendingstyper.innsending);
            nesteAktivtMeldekort = params.nesteAktivtMeldekort;
            nesteInnsendingstype = params.nesteInnsendingstype;
        } else {
            knappTekstid = "tilbake.dittNav";
            // TODO: sett opp url tilbake til dittnav
            nestePath = "/DittNav";
            nesteAktivtMeldekort = undefined;
            nesteInnsendingstype = undefined;
        }
        return (
            { knappTekstid, nestePath, nesteAktivtMeldekort, nesteInnsendingstype }
        );
    };

    render() {
        const { person, innsendingstype } = this.props;
        const { knappTekstid, nestePath,
            nesteAktivtMeldekort, nesteInnsendingstype } = this.returnerPropsVerdier();

    return(
            <main>
                <section className="seksjon flex-innhold tittel-sprakvelger">
                    <Innholdstittel ><FormattedMessage id="overskrift.steg4" /></Innholdstittel>
                    <Sprakvelger/>
                </section>
                <section className="seksjon">
                    <FormattedMessage id="tidligereMeldekort.forklaring" />
                </section>
                {innsendingstype === Innsendingstyper.innsending && (isEmpty(person.meldekort) && !isEmpty(person.etterregistrerteMeldekort))&& (
                    <section className="seksjon">
                        <FormattedMessage id={'sendt.etterregistrering.info'} />
                    </section>)}
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
                        tekstid={ knappTekstid }
                        nestePath={ nestePath }
                        nesteAktivtMeldekort={nesteAktivtMeldekort}
                        nesteInnsendingstype={nesteInnsendingstype}
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
        innsending: state.innsending,
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
