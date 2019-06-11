import * as React from 'react';
import AlertStripe from 'nav-frontend-alertstriper';
import EtikettBase from 'nav-frontend-etiketter';
import Komponentlenke from '../../components/komponentlenke/komponentlenke';
import MobilTabell from '../../components/tabell/mobil/mobilTabell';
import NavFrontendSpinner from 'nav-frontend-spinner';
import Sprakvelger from '../../components/sprakvelger/sprakvelger';
import Tabell from '../../components/tabell/desktop/tabell';
import UIAlertstripeWrapper from '../../components/feil/UIAlertstripeWrapper';
import { AktivtMeldekortActions } from '../../actions/aktivtMeldekort';
import { BaksystemFeilmelding, IngenTidligereMeldekort } from '../../types/ui';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { finnRiktigEtikettKlasse } from '../../utils/statusEtikettUtil';
import { formaterBelop } from '../../utils/numberFormat';
import { formaterDato, hentDatoPeriode, hentUkePeriode } from '../../utils/dates';
import { FormattedMessage, FormattedHTMLMessage } from 'react-intl';
import { hentIntl } from '../../utils/intlUtil';
import { HistoriskeMeldekortActions } from '../../actions/historiskeMeldekort';
import { HistoriskeMeldekortState } from '../../reducers/historiskeMeldekortReducer';
import { Innholdstittel } from 'nav-frontend-typografi';
import { InnsendingActions } from '../../actions/innsending';
import { mapKortStatusTilTekst } from '../../utils/mapper';
import { HistoriskeMeldekortRad, Meldekort } from '../../types/meldekort';
import { RootState } from '../../store/configureStore';
import { selectFeilmelding, selectIngenTidligereMeldekort } from '../../selectors/ui';

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

type State = {
    windowSize: number;
};

type Props = MapDispatchToProps&MapStateToProps;

class TidligereMeldekort extends React.Component<Props, State> {
    constructor(props: any) {
        super(props);
        this.props.hentHistoriskeMeldekort();
        this.state = {
            windowSize: window.innerWidth
        };
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
                            className={finnRiktigEtikettKlasse(row.status)}
                            type={'info'}
                        >
                          {row.status}
                        </EtikettBase>
                    );
                }},
            {key: 'bruttobelop', label: <FormattedMessage id="overskrift.bruttoBelop" />, cell: 'bruttobelop'},
        ];

        const erDesktopEllerTablet = this.state.windowSize > 768;

        return erDesktopEllerTablet ? (
            <Tabell
                rows={rows}
                columns={columns}
            />
        ) : (
            <MobilTabell
                rows={rows}
                columns={columns}
            />
        );
    }

    content = () => {
        if (this.props.ingenTidligereMeldekort.harTidligereMeldekort === false) {
            return (
                <AlertStripe type={'advarsel'}>
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
    handleWindowSize = () =>
        this.setState({
            windowSize: window.innerWidth
        })

    componentDidMount() {
        this.props.resetInnsending();
        this.props.hentHistoriskeMeldekort();
        window.addEventListener('resize', this.handleWindowSize);
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