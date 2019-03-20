import * as React from 'react';
import Sprakvelger from '../../components/sprakvelger/sprakvelger';
import { Innholdstittel } from 'nav-frontend-typografi';
import { RootState } from '../../store/configureStore';
import { PersonActions } from '../../actions/person';
import { FormattedHTMLMessage } from 'react-intl';
import { InnsendingActions } from '../../actions/innsending';
import { Dispatch } from 'redux';
import { selectRouter } from '../../selectors/router';
import { connect } from 'react-redux';
import { PersonState } from '../../reducers/personReducer';
import { Router } from '../../types/router';
import Tabell from '../../components/tabell/tabell';
import NavKnapp, { knappTyper } from '../../components/knapp/navKnapp';
import { KortStatus } from '../../types/meldekort';
import { hentDatoPeriode, hentUkePeriode } from '../../utils/dates';
import { Innsendingstyper } from '../../types/innsending';

interface MapStateToProps {
    person: PersonState;
    router: Router;
}
interface MapDispatchToProps {
    hentPerson: () => void;
    resetInnsending: () => void;
}

interface MeldekortRad {
    periode: string;
    dato: string;
}

type Props = MapDispatchToProps & MapStateToProps;

class EtterregistrerMeldekort extends React.Component<Props, any> {
    constructor(props: any) {
        super(props);
    }

    hentMeldekortRaderFraPerson = () => {
        let meldekortListe = this.props.person.person.etterregistrerteMeldekort;
        let radliste = [];
        for (let i = 0; i < meldekortListe.length; i++) {
            if (meldekortListe[i].kortStatus === KortStatus.OPPRE || meldekortListe[i].kortStatus === KortStatus.SENDT) {
                let rad: MeldekortRad = {
                    periode: hentUkePeriode(meldekortListe[i].meldeperiode.fra, meldekortListe[i].meldeperiode.til),
                    dato: hentDatoPeriode(meldekortListe[i].meldeperiode.fra, meldekortListe[i].meldeperiode.til),
                };
                radliste.push(rad);
            }
        }
        return radliste;
    }

    componentDidMount() {
        this.props.resetInnsending();
        this.props.hentPerson();
    }

    render() {
        const rows = this.hentMeldekortRaderFraPerson();
        const columns = [
            {key: 'periode', label: 'Periode'},
            {key: 'dato', label: 'Dato'}
        ];
        const { etterregistrerteMeldekort } = this.props.person.person;
        return(
            <main className="sideinnhold">
                <section className="seksjon flex-innhold tittel-sprakvelger">
                    <Innholdstittel className="seksjon"> {rows.length} meldekort klar for etteregistrering </Innholdstittel>
                    <Sprakvelger/>
                </section>
                <section className="seksjon">
                    <div className="item">
                        <FormattedHTMLMessage id="sendMeldekort.info.kanSende"/>
                    </div>
                    <div className="item">
                        <Tabell
                            rows={rows}
                            columns={columns}
                        />
                    </div>
                </section>

                <section className="seksjon flex-innhold sentrert">
                    <NavKnapp
                        type={knappTyper.hoved}
                        nestePath={this.props.router.location.pathname + '/innsending'}
                        tekstid={'overskrift.etterregistrertMeldekort'}
                        nesteAktivtMeldekort={etterregistrerteMeldekort[0]}
                        nesteInnsendingstype={Innsendingstyper.etterregistrering}
                    />
                </section>
            </main>
        );
    }
}

const mapStateToProps = (state: RootState): MapStateToProps => {
    return {
        person: state.person,
        router: selectRouter(state),
    };
};

const mapDispatchToProps = (dispatch: Dispatch): MapDispatchToProps => {
    return {
        hentPerson: () => dispatch(PersonActions.hentPerson.request()),
        resetInnsending: () => dispatch(InnsendingActions.resetInnsending()),

    };
};

export default connect(mapStateToProps, mapDispatchToProps)(EtterregistrerMeldekort);