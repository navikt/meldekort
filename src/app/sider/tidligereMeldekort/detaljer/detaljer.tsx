import * as React from 'react';
import EtikettBase from 'nav-frontend-etiketter';
import Meldekortdetaljer from '../../../components/meldekortdetaljer/meldekortdetaljer';
import PeriodeBanner from '../../../components/periodeBanner/periodeBanner';
import Tabell from '../../../components/tabell/tabell';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { finnRiktigEtikettType } from '../../../utils/statusEtikettUtil';
import { formaterDato } from '../../../utils/dates';
import { FormattedMessage } from 'react-intl';
import { history, RootState } from '../../../store/configureStore';
import { mapKortStatusTilTekst, mapKortTypeTilTekst } from '../../../utils/mapper';
import { MeldekortdetaljerActions } from '../../../actions/meldekortdetaljer';
import { MeldekortdetaljerState } from '../../../reducers/meldekortdetaljerReducer';
import { Router } from '../../../types/router';
import { selectRouter } from '../../../selectors/router';
import utklippstavle from '../../../ikoner/utklippstavle.svg';
import NavFrontendSpinner from 'nav-frontend-spinner';
import NavKnapp, { knappTyper } from '../../../components/knapp/navKnapp';
import { Meldegruppe, Meldekort } from '../../../types/meldekort';
import { formaterBelop } from '../../../utils/numberFormat';
import { Innsendingstyper } from '../../../types/innsending';
import PrintKnapp from '../../../components/print/printKnapp';

interface MapStateToProps {
    meldekortdetaljer: MeldekortdetaljerState;
    aktivtMeldekort: Meldekort;
    router: Router;
}

interface MapDispatchToProps {
    hentMeldekortdetaljer: () => void;
}

type Props = MapDispatchToProps&MapStateToProps;

class Detaljer extends React.Component<Props> {

    settTabellrader = (meldekort: Meldekort) => {
        return [{
            mottattDato: formaterDato(meldekort.mottattDato),
            kortStatus: mapKortStatusTilTekst(meldekort.kortStatus),
            bruttoBelop: formaterBelop(meldekort.bruttoBelop),
            kortType: mapKortTypeTilTekst(meldekort.kortType)
        }];
    }

    sjekkAktivtMeldekortOgRedirect = () => {
        if (this.props.aktivtMeldekort.meldekortId === 0) {
            const pathname = this.props.router.location.pathname;
            const tidligereMeldekort = '/tidligere-meldekort';
            pathname !== tidligereMeldekort && history.push(tidligereMeldekort);
        }
    }

    componentDidMount() {
        this.props.hentMeldekortdetaljer();
        this.sjekkAktivtMeldekortOgRedirect();
    }

    innhold = () => {

        const { meldekortdetaljer, aktivtMeldekort } = this.props;
        const rows = this.settTabellrader(aktivtMeldekort);
        const columns = [
            {key: 'mottattDato', label: <FormattedMessage id="overskrift.mottatt"/>},
            {key: 'kortStatus', label: <FormattedMessage id="overskrift.status"/>, cell: function( row: any, columnKey: any) {
                    return (
                        <EtikettBase
                            type={finnRiktigEtikettType(row.kortStatus)}
                        > {row.kortStatus}
                        </EtikettBase>
                    );
                }},
            {key: 'bruttoBelop', label: <FormattedMessage id="overskrift.bruttoBelop"/>},
            {key: 'kortType', label: <FormattedMessage id="overskrift.meldekorttype"/>}
        ];
        let { meldegruppe } = aktivtMeldekort;

        return (
            <>
                <img alt="" className="noPrint" src={utklippstavle}/>
                <PeriodeBanner/>
                <section className="seksjon">
                    <div className="tabell-detaljer">
                        <Tabell rows={rows} columns={columns}/>
                    </div>
                </section>
                {meldekortdetaljer.meldekortdetaljer.id !== '' ?
                    <Meldekortdetaljer meldekortdetaljer={meldekortdetaljer.meldekortdetaljer} erAap={meldegruppe === Meldegruppe.ATTF}/> :
                    <div className="meldekort-spinner"><NavFrontendSpinner type={'XL'}/></div> }

            </>
        );
    }

    render() {
        const { aktivtMeldekort, router } = this.props;
        return(
            <div className="sideinnhold innhold-detaljer">
                {this.innhold()}
                <section className="seksjon flex-innhold sentrert noPrint">
                    <NavKnapp
                        type={knappTyper.hoved}
                        nestePath={'/tidligere-meldekort'}
                        tekstid={'naviger.forrige'}
                        className={'navigasjonsknapp'}
                    />
                    {aktivtMeldekort.korrigerbart ?
                        <NavKnapp
                            type={knappTyper.standard}
                            nestePath={router.location.pathname + '/korriger'}
                            tekstid={'korriger.meldekort'}
                            className={'navigasjonsknapp'}
                            nesteAktivtMeldekort={aktivtMeldekort}
                            nesteInnsendingstype={Innsendingstyper.korrigering}
                        /> : null
                    }
                    <PrintKnapp innholdRenderer={this.innhold} prerenderInnhold={true}/>
                </section>
            </div>
        );
    }
}

const mapStateToProps = (state: RootState): MapStateToProps => {
    return {
        meldekortdetaljer: state.meldekortdetaljer,
        aktivtMeldekort: state.aktivtMeldekort,
        router: selectRouter(state)
    };
};

const mapDispatchToProps = (dispatch: Dispatch): MapDispatchToProps => {
    return {
        hentMeldekortdetaljer: () => dispatch(MeldekortdetaljerActions.hentMeldekortdetaljer.request()),
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Detaljer);
