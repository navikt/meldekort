import * as React from 'react';
import { Element, Ingress, Innholdstittel, Normaltekst } from 'nav-frontend-typografi';
import Sprakvelger from '../../components/sprakvelger/sprakvelger';
import AlertStripe from 'nav-frontend-alertstriper';
import { FormattedHTMLMessage, FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { PersonActions } from '../../actions/person';
import Tabell from '../../components/tabell/tabell';
import { PersonState } from '../../reducers/personReducer';
import { RootState, history } from '../../store/configureStore';
import { KortStatus, Meldekort } from '../../types/meldekort';
import { formaterDato, formaterUkeOgDatoPeriode, hentDatoPeriode, hentUkePeriode, kanMeldekortSendesInn } from '../../utils/dates';
import NavKnapp, { knappTyper } from '../../components/knapp/navKnapp';
import NavFrontendSpinner from 'nav-frontend-spinner';
import UIAlertstripeWrapper from '../../components/feil/UIAlertstripeWrapper';
import { BaksystemFeilmelding } from '../../types/ui';
import { selectFeilmelding } from '../../selectors/ui';
import { oppdaterAktivtMeldekort } from '../../actions/aktivtMeldekort';

interface MapStateToProps {
   person: PersonState;
   baksystemFeilmelding: BaksystemFeilmelding;
}
interface MapDispatchToProps {
    hentPerson: () => void;
    leggTilAktivtMeldekort: (meldekort: Meldekort) => void;
}

interface MeldekortRad {
    periode: string;
    dato: string;
}

interface MeldekortTilInnsending {
    meldekortListe: Meldekort[];
}

type Props = MapDispatchToProps & MapStateToProps;

class SendMeldekort extends React.Component<Props, MeldekortTilInnsending> {
    constructor(props: any) {
        super(props);
        this.props.hentPerson();
        this.state = {meldekortListe: []};
    }

    componentDidMount(): void {
        this.setMeldekortTilInnsedingIState();
    }

    setMeldekortTilInnsedingIState = () => {
        let meldekortTilInnsending: Meldekort[] = [];
        let { meldekort } = this.props.person.person;
        if (meldekort != null) {
            meldekort.map((meldekortObj) => {
                if (meldekortObj.kortStatus === KortStatus.OPPRE || meldekortObj.kortStatus === KortStatus.SENDT) {
                    if (kanMeldekortSendesInn(meldekortObj.meldeperiode.kortKanSendesFra)) {
                        meldekortTilInnsending.push(meldekortObj);
                    }
                }
            });
        }
        this.setState({meldekortListe: meldekortTilInnsending});
        if (meldekortTilInnsending.length === 1) {
            this.props.leggTilAktivtMeldekort(meldekortTilInnsending[0]);
            history.push('/innsending');
        }
    }

    hentMeldekortRaderFraPerson = () => {
        let radliste: MeldekortRad[] = [];

        this.state.meldekortListe.map((meldekort) => {
            radliste.push({
                periode: hentUkePeriode(meldekort.meldeperiode.fra, meldekort.meldeperiode.til),
                dato: hentDatoPeriode(meldekort.meldeperiode.fra, meldekort.meldeperiode.til),
            });
        });
        return radliste;
    }

    hentMeldingOmMeldekortSomIkkeErKlare  = (rows: MeldekortRad[]) => {
        if (rows.length === 0 && this.props.person.person.meldekort !== undefined) {
            let meldekortId = this.forTidligASende(this.props.person.person.meldekort);
            let meldekort = this.props.person.person.meldekort.filter((m) => m.meldekortId === meldekortId);
            if (meldekort.length !== 0) {
                return (
                    <div className="send-meldekort-varsel">
                        <Normaltekst>
                            <FormattedMessage id="overskrift.nesteMeldekort"/>
                            <FormattedMessage id="sendMeldekort.info.innsendingStatus.kanSendes"/>
                            {formaterDato(meldekort[0].meldeperiode.kortKanSendesFra)}
                        </Normaltekst>
                        <Element>
                            {formaterUkeOgDatoPeriode(meldekort[0].meldeperiode.fra, meldekort[0].meldeperiode.til)}
                        </Element>
                        <FormattedMessage id="sendMeldekort.info.ingenKlare"/>
                    </div>
                );
            } else {
                return (
                    <div className="send-meldekort-varsel">
                        <FormattedMessage id="sporsmal.ingenMeldekortASende"/>
                    </div>
                );
            }
        } else {
            return (
                <div className="send-meldekort-varsel">
                    <FormattedMessage id="sporsmal.ingenMeldekortASende"/>
                </div>
            );
        }
    }

    hentFeilmeldingEllerData = (rows: MeldekortRad[], columns: any) => {
        if (rows.length > 0) {
            if (rows.length < 5) {
                return this.hentTabellOgTilhorendeElementer(rows, columns);
            } else {
                return (
                    <div className="send-meldekort-varsel">
                        <Ingress><FormattedMessage id="sendMeldekort.info.forMangeMeldekort"/></Ingress>
                        <Normaltekst><FormattedMessage id="sendMeldekort.info.forMangeMeldekort.feilmelding"/></Normaltekst>
                    </div>
                );
            }
        } else {
            return this.hentMeldingOmMeldekortSomIkkeErKlare(rows);
        }
    }

    ventPaaDataOgReturnerSpinnerFeilmeldingEllerTabell = (rows: MeldekortRad[], columns: any) => {
        if (this.props.person.person.personId === 0) {
            return (
                <div className="meldekort-spinner">
                    <NavFrontendSpinner type="XL"/>
                </div>
                );
        } else {
            return this.hentFeilmeldingEllerData(rows, columns);
        }
    }

    forTidligASende = (meldekortListe: Meldekort[]): number => {
        let meldekortId = 0;
        if (meldekortListe === undefined) {
            return meldekortId;
        }
        meldekortListe.map((meldekort) => {
            if (meldekort.kortStatus === KortStatus.OPPRE || meldekort.kortStatus === KortStatus.SENDT) {
                if (kanMeldekortSendesInn(meldekort.meldeperiode.kortKanSendesFra) === false) {
                    meldekortId = meldekort.meldekortId;
                }
            }
        });
        return meldekortId;
    }

    hentNesteMeldekortTilInnsending = () => {
        return this.state.meldekortListe[0];
    }

    hentTabellOgTilhorendeElementer = (rows: MeldekortRad[], columns: any) => {
        return (
            <div>
                <div className="item">
                    <FormattedHTMLMessage id="sendMeldekort.info.kanSende"/>
                </div>
                <section className="seksjon">
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
                        nestePath={'/innsending'}
                        tekstid={'sendMeldekort.knapp.startUtfylling'}
                        aktivtMeldekortObjekt={this.hentNesteMeldekortTilInnsending()}
                    />
                </section>
            </div>
        );
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
                    <Innholdstittel> <FormattedMessage id="overskrift.innsending"/> </Innholdstittel>
                    <Sprakvelger/>
                </section>
                <section className="seksjon">
                    {this.props.baksystemFeilmelding.visFeilmelding ?
                        <UIAlertstripeWrapper/> :
                        this.ventPaaDataOgReturnerSpinnerFeilmeldingEllerTabell(rows, columns)
                    }
                </section>
            </main>
        );
    }
}

const mapStateToProps = (state: RootState): MapStateToProps => {
    return {
        person: state.person,
        baksystemFeilmelding: selectFeilmelding(state)
    };
};

const mapDispatchToProps = (dispatch: Dispatch): MapDispatchToProps => {
    return {
        hentPerson: () => dispatch(PersonActions.hentPerson.request()),
        leggTilAktivtMeldekort: (aktivtMeldekort: Meldekort) =>
            dispatch(oppdaterAktivtMeldekort(aktivtMeldekort))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(SendMeldekort);
