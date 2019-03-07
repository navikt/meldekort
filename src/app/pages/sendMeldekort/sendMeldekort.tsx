import * as React from 'react';
import { Innholdstittel } from 'nav-frontend-typografi';
import Sprakvelger from '../../components/sprakvelger/sprakvelger';
import AlertStripe from 'nav-frontend-alertstriper';
import { FormattedHTMLMessage } from 'react-intl';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { PersonActions } from '../../actions/person';
import Tabell from '../../components/tabell/tabell';
import { PersonState } from '../../reducers/personReducer';
import { RootState } from '../../store/configureStore';
import { KortStatus, Meldekort } from '../../types/meldekort';
import { hentDatoPeriode, hentUkePeriode } from '../../utils/dates';
import NavKnapp, { knappTyper } from '../../components/knapp/navKnapp';

interface MapStateToProps {
   person: PersonState;
}
interface MapDispatchToProps {
    hentPerson: () => void;
}

interface MeldekortRad {
    periode: string;
    dato: string;
}

type Props = MapDispatchToProps & MapStateToProps;

class SendMeldekort extends React.Component<Props> {
    constructor(props: any) {
        super(props);
        this.props.hentPerson();
    }

    hentMeldekortRaderFraPerson = () => {
        let meldekortListe = this.props.person.person.meldekort;
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

    render() {
        const rows = this.hentMeldekortRaderFraPerson();
        const columns = [
            {key: 'periode', label: 'Periode'},
            {key: 'dato', label: 'Dato'}
        ];

        return(
            <main className="sideinnhold">
                <section className="seksjon flex-innhold tittel-sprakvelger">
                    <Innholdstittel className="seksjon"> {this.props.person.person.meldekort.length} meldekort klar for innsending </Innholdstittel>
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
                <section className="seksjon">
                    <AlertStripe type="info" solid={true}>
                        <FormattedHTMLMessage id="sendMeldekort.info.automatiskLedet"/>
                        <FormattedHTMLMessage id="sendMeldekort.info.eldstePerioden"/>
                        <FormattedHTMLMessage id="sendMeldekort.info.neste"/>
                    </AlertStripe>
                </section>
                <section className="seksjon flex-innhold sentrert">
                    <NavKnapp
                        type={knappTyper.hoved}
                        nestePath={'/send-meldekort/innsending'}
                        tekstid={'sendMeldekort.knapp.startUtfylling'}
                        aktivtMeldekortObjekt={this.props.person.person.meldekort[0]}
                    />
                </section>
            </main>
        );
    }
}

const mapStateToProps = (person: RootState): MapStateToProps => {
    return {
        person: person.person,
    };
};

const mapDispatchToProps = (dispatch: Dispatch): MapDispatchToProps => {
    return {
        hentPerson: () => dispatch(PersonActions.hentPerson.request()),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(SendMeldekort);
