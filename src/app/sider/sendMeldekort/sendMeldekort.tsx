import * as React from 'react';
import NavFrontendSpinner from 'nav-frontend-spinner';
import NavKnapp, { knappTyper } from '../../components/knapp/navKnapp';
import Sprakvelger from '../../components/sprakvelger/sprakvelger';
import Tabell from '../../components/tabell/tabell';
import UIAlertstripeWrapper from '../../components/feil/UIAlertstripeWrapper';
import { BaksystemFeilmelding } from '../../types/ui';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { Element, Ingress, Innholdstittel, Normaltekst } from 'nav-frontend-typografi';
import { formaterDato, formaterUkeOgDatoPeriode, hentDatoPeriode, hentUkePeriode } from '../../utils/dates';
import { FormattedHTMLMessage, FormattedMessage } from 'react-intl';
import { InnsendingActions } from '../../actions/innsending';
import { Innsendingstyper } from '../../types/innsending';
import { KortStatus, Meldekort, SendtMeldekort } from '../../types/meldekort';
import { PersonActions } from '../../actions/person';
import { RootState } from '../../store/configureStore';
import { Router } from '../../types/router';
import { selectFeilmelding } from '../../selectors/ui';
import { Redirect } from 'react-router';
import { selectRouter } from '../../selectors/router';
import { Person } from '../../types/person';
import { AktivtMeldekortActions } from '../../actions/aktivtMeldekort';
import { erMeldekortSendtInnTidligere } from '../../utils/meldekortUtils';
import Veilederpanel from 'nav-frontend-veilederpanel';
import veileder from '../../ikoner/veileder.svg';

interface MapStateToProps {
   person: Person;
   baksystemFeilmelding: BaksystemFeilmelding;
   router: Router;
   sendteMeldekort: SendtMeldekort[];
}
interface MapDispatchToProps {
    hentPerson: () => void;
    leggTilAktivtMeldekort: (meldekort: Meldekort) => void;
    resetInnsending: () => void;
    settInnsendingstype: (innsendingstype: Innsendingstyper) => void;
}

interface MeldekortRad {
    periode: string;
    dato: string;
}

type Props = MapDispatchToProps & MapStateToProps;

class SendMeldekort extends React.Component<Props, any> {

    harEttMeldekort = () => {

        let meldekortListe = this.filtrerMeldekortListe();

        if (meldekortListe.length === 1) {
            this.props.leggTilAktivtMeldekort(meldekortListe[0]);
            this.props.settInnsendingstype(Innsendingstyper.innsending);
            return true;
        }
        return false;
    }

    filtrerMeldekortListe = (): Meldekort[] => {
        if (typeof this.props.person.meldekort === 'undefined') {
            return [];
        }
        return this.props.person.meldekort.filter((meldekortObj) => {
                if (meldekortObj.kortStatus === KortStatus.OPPRE || meldekortObj.kortStatus === KortStatus.SENDT) {
                    if (meldekortObj.meldeperiode.kanKortSendes) {
                        return !erMeldekortSendtInnTidligere(meldekortObj, this.props.sendteMeldekort);
                    }
                }
                return false;
            });
    }

    hentMeldekortRaderFraPerson = () => {
        let radliste: MeldekortRad[] = [];

        if (this.filtrerMeldekortListe() != null) {
            this.filtrerMeldekortListe().map((meldekortObj) => {
                if (meldekortObj.kortStatus === KortStatus.OPPRE || meldekortObj.kortStatus === KortStatus.SENDT) {
                    if (meldekortObj.meldeperiode.kanKortSendes) {
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

    componentDidMount() {
        if (this.filtrerMeldekortListe().length !== 1) {
            this.props.resetInnsending();
        }
        this.props.hentPerson();
    }

    meldekortSomIkkeKanSendesInnEnda = (): Meldekort[] => {
        if (this.filtrerMeldekortListe().length === 0) {
            return this.props.person.meldekort.filter(mk => {
                return (!mk.meldeperiode.kanKortSendes && (mk.kortStatus === KortStatus.OPPRE || mk.kortStatus === KortStatus.SENDT));
            });
        }
        return [];

    }

    hentMeldingOmMeldekortSomIkkeErKlare  = (rows: MeldekortRad[], person: Person) => {
        let meldekortliste = this.filtrerMeldekortListe();
        if (rows.length === 0 && meldekortliste !== undefined) {
            let meldekortId = this.forTidligASende(meldekortliste);
            let meldekort = meldekortliste.filter((m) => m.meldekortId === meldekortId);
            let meldekortSomIkkeKanSendesEnda = this.meldekortSomIkkeKanSendesInnEnda();
            if (meldekort.length === 0 && meldekortSomIkkeKanSendesEnda.length !== 0) {
                console.log(meldekortSomIkkeKanSendesEnda);
                return (
                    <div className="send-meldekort-varsel">
                        <Normaltekst>
                            <FormattedMessage id="overskrift.nesteMeldekort"/>
                            <FormattedMessage id="sendMeldekort.info.innsendingStatus.kanSendes"/>
                            {formaterDato(meldekortSomIkkeKanSendesEnda[0].meldeperiode.kortKanSendesFra)}
                        </Normaltekst>
                        <Element>
                            {formaterUkeOgDatoPeriode(meldekortSomIkkeKanSendesEnda[0].meldeperiode.fra, meldekortSomIkkeKanSendesEnda[0].meldeperiode.til)}
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
            return (
                <Veilederpanel svg={<img alt="" src={veileder}/>}>
                    {this.hentMeldingOmMeldekortSomIkkeErKlare(rows, this.props.person)}
                </Veilederpanel>
            );
        }
    }

    ventPaaDataOgReturnerSpinnerFeilmeldingEllerTabell = (rows: MeldekortRad[], columns: any) => {
        if (this.props.person.personId === 0) {
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
                if (!meldekort.meldeperiode.kanKortSendes) {
                    meldekortId = meldekort.meldekortId;
                }
            }
        });
        return meldekortId;
    }

    hentTabellOgTilhorendeElementer = (rows: MeldekortRad[], columns: any) => {
        return (
            <>
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
                        nestePath={this.props.router.location.pathname + '/innsending'}
                        tekstid={'naviger.neste'}
                        nesteAktivtMeldekort={this.filtrerMeldekortListe()[0]}
                        nesteInnsendingstype={Innsendingstyper.innsending}
                    />
                </section>
            </>
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
            ) : <Redirect exact={true} from="/send-meldekort" to="/send-meldekort/innsending"/>;
    }
}

const mapStateToProps = (state: RootState): MapStateToProps => {
    return {
        person: state.person,
        router: selectRouter(state),
        baksystemFeilmelding: selectFeilmelding(state),
        sendteMeldekort: state.meldekort.sendteMeldekort
    };
};

const mapDispatchToProps = (dispatch: Dispatch): MapDispatchToProps => {
    return {
        hentPerson: () => dispatch(PersonActions.hentPerson.request()),
        resetInnsending: () => dispatch(InnsendingActions.resetInnsending()),
        leggTilAktivtMeldekort: (aktivtMeldekort: Meldekort) =>
            dispatch(AktivtMeldekortActions.oppdaterAktivtMeldekort(aktivtMeldekort)),
        settInnsendingstype: (innsendingstype: Innsendingstyper) => {
            dispatch(InnsendingActions.leggTilInnsendingstype(innsendingstype));
        }
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(SendMeldekort);
