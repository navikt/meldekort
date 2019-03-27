import * as React from 'react';
import { Element, Ingress, Innholdstittel, Normaltekst } from 'nav-frontend-typografi';
import Sprakvelger from '../../components/sprakvelger/sprakvelger';
import { FormattedHTMLMessage, FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { PersonActions } from '../../actions/person';
import Tabell from '../../components/tabell/tabell';
import { PersonState } from '../../reducers/personReducer';
import { RootState } from '../../store/configureStore';
import { KortStatus, Meldekort } from '../../types/meldekort';
import { formaterDato, formaterUkeOgDatoPeriode, hentDatoPeriode, hentUkePeriode, kanMeldekortSendesInn } from '../../utils/dates';
import NavKnapp, { knappTyper } from '../../components/knapp/navKnapp';
import NavFrontendSpinner from 'nav-frontend-spinner';
import UIAlertstripeWrapper from '../../components/feil/UIAlertstripeWrapper';
import { BaksystemFeilmelding } from '../../types/ui';
import { selectFeilmelding } from '../../selectors/ui';
import { oppdaterAktivtMeldekort } from '../../actions/aktivtMeldekort';
import { Redirect } from 'react-router';

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

type Props = MapDispatchToProps & MapStateToProps;

class SendMeldekort extends React.Component<Props, any> {
    constructor(props: any) {
        super(props);
    }

    componentDidMount(): void {
        this.props.hentPerson();
    }

    harEttMeldekort = () => {
        let meldekortListe = this.filtrerMeldekortListe();

        if (meldekortListe.length === 1) {
            console.log('Har ett meldekort');
            this.props.leggTilAktivtMeldekort(meldekortListe[0]);
            return true;
        }
        return false;
    }

    filtrerMeldekortListe = () => {
        if (typeof this.props.person.person.meldekort === 'undefined') {
            return [];
        }
        return this.props.person.person.meldekort.filter((meldekortObj) =>
             (meldekortObj.kortStatus === KortStatus.OPPRE || meldekortObj.kortStatus === KortStatus.SENDT) &&
               (kanMeldekortSendesInn(meldekortObj.meldeperiode.kortKanSendesFra)));
    }

    hentMeldekortRaderFraPerson = () => {
        let radliste: MeldekortRad[] = [];

        let { meldekort } = this.props.person.person;
        if (meldekort != null) {
            meldekort.map((meldekortObj) => {
                if (meldekortObj.kortStatus === KortStatus.OPPRE || meldekortObj.kortStatus === KortStatus.SENDT) {
                    if (kanMeldekortSendesInn(meldekortObj.meldeperiode.kortKanSendesFra)) {
                        radliste.push({
                           periode: hentUkePeriode(meldekortObj.meldeperiode.fra, meldekortObj.meldeperiode.til),
                           dato: hentDatoPeriode(meldekortObj.meldeperiode.fra, meldekortObj.meldeperiode.til),
                        });
                    }
                }
            });
        }
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
                    <div className="box">
                        <Normaltekst><FormattedHTMLMessage id="sendMeldekort.info.neste"/></Normaltekst>
                        <Normaltekst><FormattedHTMLMessage id="sendMeldekort.info.eldstePerioden"/></Normaltekst>
                        <Normaltekst><FormattedHTMLMessage id="sendMeldekort.info.automatiskLedet"/></Normaltekst>
                    </div>
                </section>
                <section className="seksjon flex-innhold sentrert">
                    <NavKnapp
                        type={knappTyper.hoved}
                        nestePath={'/innsending'}
                        tekstid={'naviger.neste'}
                        aktivtMeldekortObjekt={this.filtrerMeldekortListe()[0]}
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

        const ettMeldekort = this.harEttMeldekort();

        return !ettMeldekort ?
            (
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
            ) : <Redirect exact={true} from="/send-meldekort" to="/innsending"/>;
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
