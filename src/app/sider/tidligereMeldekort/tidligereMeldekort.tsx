import * as React from 'react';
import { Innholdstittel, Normaltekst } from 'nav-frontend-typografi';
import { FormattedMessage, FormattedHTMLMessage } from 'react-intl';
import Sprakvelger from '../../components/sprakvelger/sprakvelger';
import Komponentlenke from '../../components/komponentlenke/komponentlenke';
import { Dispatch } from 'redux';
import { HistoriskeMeldekortActions } from '../../actions/historiskeMeldekort';
import { connect } from 'react-redux';
import Tabell from '../../components/tabell/tabell';
import EtikettBase from 'nav-frontend-etiketter';
import { HistoriskeMeldekortState } from '../../reducers/historiskeMeldekortReducer';
import { history, RootState } from '../../store/configureStore';
import { formaterDato, hentDatoPeriode, hentUkePeriode } from '../../utils/dates';
import { Meldekort } from '../../types/meldekort';
import { mapKortStatusTilTekst } from '../../utils/mapper';
import { finnRiktigEtikettType, HvisIngenBeregningSettBlaEtikett } from '../../utils/statusEtikettUtil';
import { hentIntl } from '../../utils/intlUtil';
import { InnsendingActions } from '../../actions/innsending';
import { BaksystemFeilmelding, IngenTidligereMeldekort } from '../../types/ui';
import { selectFeilmelding, selectIngenTidligereMeldekort } from '../../selectors/ui';
import AlertStripe from 'nav-frontend-alertstriper';
import NavFrontendSpinner from 'nav-frontend-spinner';
import UIAlertstripeWrapper from '../../components/feil/UIAlertstripeWrapper';
import { formaterBelop } from '../../utils/numberFormat';
import { MeldekortActions } from '../../actions/meldekort';
import { AktivtMeldekortActions } from '../../actions/aktivtMeldekort';

interface MapStateToProps {
    historiskeMeldekort: HistoriskeMeldekortState;
    ingenTidligereMeldekort: IngenTidligereMeldekort;
    baksystemFeilmelding: BaksystemFeilmelding;
}

interface MapDispatchToProps {
    hentHistoriskeMeldekort: () => void;
    resetInnsending: () => void;
    leggTilAktivtMeldekort: (meldekort: Meldekort) => void;
}

interface HistoriskeMeldekortRad {
    meldekort: Meldekort;
    periode: string;
    dato: string;
    mottatt: string;
    status: string;
    bruttobelop: string;
    detaljer: string;
}

type Props = MapDispatchToProps&MapStateToProps;

class TidligereMeldekort extends React.Component<Props> {
    constructor(props: any) {
        super(props);
        this.props.hentHistoriskeMeldekort();
    }

    hentRaderFraHistoriskeMeldekort = () => {
        let radliste: HistoriskeMeldekortRad[] = [];

        this.props.historiskeMeldekort.historiskeMeldekort.map((meldekort) => {
            radliste.push({
                meldekort: meldekort,
                periode: hentUkePeriode(meldekort.meldeperiode.fra, meldekort.meldeperiode.til),
                dato: hentDatoPeriode(meldekort.meldeperiode.fra, meldekort.meldeperiode.til),
                mottatt: typeof meldekort.mottattDato === 'undefined' || meldekort.mottattDato === null ? '' : formaterDato(meldekort.mottattDato),
                status: mapKortStatusTilTekst(meldekort.kortStatus),
                bruttobelop: formaterBelop(meldekort.bruttoBelop),
                detaljer: hentIntl().formatMessage({id: 'overskrift.detaljer'})
            });
        });
        return radliste;
    }

    hentTabell = () => {
        const rows = this.hentRaderFraHistoriskeMeldekort();

        const columns = [
            {key: 'periode', label: <FormattedMessage id="overskrift.periode"/>, cell: function( row: any, column: any) {
                    return <Komponentlenke lenketekst={row.periode} rute="/tidligere-meldekort/detaljer" meldekort={row.meldekort}/>;
                }},
            {key: 'dato', label: <FormattedMessage id="overskrift.dato"/>, cell: 'dato'},
            {key: 'mottatt', label: <FormattedMessage id="overskrift.mottatt"/>, cell: 'mottatt'},
            {key: 'status', label: <FormattedMessage id="overskrift.status" />, cell: function( row: any, columnKey: any) {
                    return (
                        <EtikettBase
                            type={finnRiktigEtikettType(row.status)}
                        > {row.status}
                        </EtikettBase>
                    );
                }},
            {key: 'bruttobelop', label: <FormattedMessage id="overskrift.bruttoBelop" />, cell: 'bruttobelop'},
        ];

        return (
            <Tabell
                rows={rows}
                columns={columns}
                mobilSkjerm={true}
            />
        );
    }

    content = () => {
        if (this.props.ingenTidligereMeldekort.harTidligereMeldekort === false) {
            return (
                <AlertStripe type={'info'}>
                    <FormattedHTMLMessage id="tidligereMeldekort.harIngen"/>
                </AlertStripe>
            );
        } else if (this.props.historiskeMeldekort.historiskeMeldekort.length > 0) {
            return this.hentTabell();
        } else {
            return (
                <div className="meldekort-spinner">
                    <NavFrontendSpinner type="XL"/>
                </div>
            );
        }
    }

    componentDidMount() {
        this.props.resetInnsending();
        this.props.hentHistoriskeMeldekort();
    }

    render() {

        return(
            <div className="sideinnhold">
                <section className="seksjon flex-innhold tittel-sprakvelger">
                    <Innholdstittel><FormattedMessage id="overskrift.tidligereMeldekort" /></Innholdstittel>
                    <Sprakvelger/>
                </section>
                <section className="seksjon">
                    <FormattedMessage id="tidligereMeldekort.forklaring" />
                </section>
                <section className="seksjon">
                    <FormattedMessage id="tidligereMeldekort.forklaring.korrigering" />
                </section>
                <section className="seksjon">
                    {this.props.baksystemFeilmelding.visFeilmelding ?
                        <UIAlertstripeWrapper/> :
                        this.content()
                    }
                </section>
            </div>
        );
    }
}

const mapStateToProps = (state: RootState): MapStateToProps => {
    return {
        historiskeMeldekort: state.historiskeMeldekort,
        ingenTidligereMeldekort: selectIngenTidligereMeldekort(state),
        baksystemFeilmelding: selectFeilmelding(state),
    };
};

const mapDispatchToProps = (dispatch: Dispatch): MapDispatchToProps => {
    return {
        hentHistoriskeMeldekort: () => dispatch(HistoriskeMeldekortActions.hentHistoriskeMeldekort.request()),
        resetInnsending: () => dispatch(InnsendingActions.resetInnsending()),
        leggTilAktivtMeldekort: (meldekort: Meldekort) => dispatch(AktivtMeldekortActions.oppdaterAktivtMeldekort(meldekort)),
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps,
) (TidligereMeldekort);