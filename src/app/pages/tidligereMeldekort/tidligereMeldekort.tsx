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
import { RootState } from '../../store/configureStore';
import { formaterDato, hentDatoPeriode, hentUkePeriode } from '../../utils/dates';
import { Meldekort } from '../../types/meldekort';
import { mapKortStatusTilTekst } from '../../utils/mapper';
import { finnRiktigEtikettType, HvisIngenBeregningSettBlaEtikett } from '../../utils/statusEtikettUtil';
import { hentIntl } from '../../utils/intlUtil';
import { BaksystemFeilmelding, IngenTidligereMeldekort } from '../../types/ui';
import { selectFeilmelding, selectIngenTidligereMeldekort } from '../../selectors/ui';
import AlertStripe from 'nav-frontend-alertstriper';
import NavFrontendSpinner from 'nav-frontend-spinner';
import UIAlertstripeWrapper from '../../components/feil/UIAlertstripeWrapper';

interface MapStateToProps {
    historiskeMeldekort: HistoriskeMeldekortState;
    ingenTidligereMeldekort: IngenTidligereMeldekort;
    baksystemFeilmelding: BaksystemFeilmelding;
}

interface MapDispatchToProps {
    hentHistoriskeMeldekort: () => void;
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
        let historiskeMeldekortListe = this.props.historiskeMeldekort.historiskeMeldekort;
        let radliste = [];
        for (let i = 0; i < historiskeMeldekortListe.length; i++) {
            let rad: HistoriskeMeldekortRad = {
                meldekort: historiskeMeldekortListe[i],
                periode: hentUkePeriode(historiskeMeldekortListe[i].meldeperiode.fra, historiskeMeldekortListe[i].meldeperiode.til),
                dato: hentDatoPeriode(historiskeMeldekortListe[i].meldeperiode.fra, historiskeMeldekortListe[i].meldeperiode.til),
                mottatt: formaterDato(historiskeMeldekortListe[i].mottattDato),
                status: mapKortStatusTilTekst(historiskeMeldekortListe[i].kortStatus),
                bruttobelop: `${historiskeMeldekortListe[i].bruttoBelop.toString()} kr`,
                detaljer: hentIntl().formatMessage({id: 'overskrift.detaljer'})
            };
            radliste.push(rad);
        }
        return radliste;
    }

    hentTabell = () => {
        const rows = this.hentRaderFraHistoriskeMeldekort();

        const columns = [
            {key: 'periode', label: <FormattedMessage id="overskrift.periode"/>, cell: 'periode'},
            {key: 'dato', label: <FormattedMessage id="overskrift.dato"/>, cell: 'dato'},
            {key: 'mottatt', label: <FormattedMessage id="overskrift.mottatt"/>, cell: 'mottatt'},
            {key: 'status', label: <FormattedMessage id="overskrift.status" />, cell: function( row: any, columnKey: any) {
                    return (
                        <EtikettBase
                            type={finnRiktigEtikettType(row.status)}
                            className={HvisIngenBeregningSettBlaEtikett(row.status)}
                        > {row.status}
                        </EtikettBase>
                    );
                }},
            {key: 'bruttobelop', label: <FormattedMessage id="overskrift.bruttoBelop" />, cell: 'bruttobelop'},
            {key: 'detaljer', label: <FormattedMessage id="overskrift.detaljer"/>, cell: function( row: any, columnKey: any) {
                    return <Komponentlenke lenketekst={row.detaljer} rute="/tidligere-meldekort/detaljer" meldekort={row.meldekort}/>;
                }}
        ];

        return (
            <Tabell
                rows={rows}
                columns={columns}
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
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps,
) (TidligereMeldekort);
