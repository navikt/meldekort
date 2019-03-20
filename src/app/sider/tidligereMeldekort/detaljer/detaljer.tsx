import * as React from 'react';
import EtikettBase from 'nav-frontend-etiketter';
import Meldekortdetaljer from '../../../components/meldekortdetaljer/meldekortdetaljer';
import PeriodeBanner from '../../../components/periodeBanner/periodeBanner';
import Tabell from '../../../components/tabell/tabell';
import { AktivtMeldekortState } from '../../../reducers/aktivtMeldekortReducer';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { finnRiktigEtikettType, HvisIngenBeregningSettBlaEtikett } from '../../../utils/statusEtikettUtil';
import { formaterDato } from '../../../utils/dates';
import { FormattedMessage } from 'react-intl';
import { history, RootState } from '../../../store/configureStore';
import { mapKortTypeTilTekst, mapKortStatusTilTekst } from '../../../utils/mapper';
import { MeldekortdetaljerActions } from '../../../actions/meldekortdetaljer';
import { MeldekortdetaljerState } from '../../../reducers/meldekortdetaljerReducer';
import { Router } from '../../../types/router';
import { selectRouter } from '../../../selectors/router';

import utklippstavle from '../../../ikoner/utklippstavle.svg';
import NavFrontendSpinner from 'nav-frontend-spinner';
import NavKnapp, { knappTyper } from '../../../components/knapp/navKnapp';
import { Meldekort } from '../../../types/meldekort';
import { Innsendingstyper } from '../../../types/innsending';

interface MapStateToProps {
    meldekortdetaljer: MeldekortdetaljerState;
    aktivtMeldekort: AktivtMeldekortState;
    router: Router;
}

interface MapDispatchToProps {
    hentMeldekortdetaljer: () => void;
}

type Props = MapDispatchToProps&MapStateToProps;

class Detaljer extends React.Component<Props> {
    constructor(props: any) {
        super(props);
    }

    settTabellrader = (meldekort: Meldekort) => {
        return [{
            mottattDato: formaterDato(meldekort.mottattDato),
            kortStatus: mapKortStatusTilTekst(meldekort.kortStatus),
            bruttoBelop: typeof meldekort.bruttoBelop === 'undefined' || meldekort.bruttoBelop === null ? '' : `${meldekort.bruttoBelop} kr`,
            kortType: mapKortTypeTilTekst(meldekort.kortType)
        }];
    }

    sjekkAktivtMeldekortOgRedirect = () => {
        if (this.props.aktivtMeldekort.meldekort.meldekortId === 0) {
            const pathname = this.props.router.location.pathname;
            const tidligereMeldekort = '/tidligere-meldekort';
            pathname !== tidligereMeldekort && history.push(tidligereMeldekort);
        }
    }

    componentDidMount() {
        this.props.hentMeldekortdetaljer();
        this.sjekkAktivtMeldekortOgRedirect();
    }

    render() {
        const { meldekortdetaljer, aktivtMeldekort, router } = this.props;
        const rows = this.settTabellrader(aktivtMeldekort.meldekort);
        const columns = [
            {key: 'mottattDato', label: <FormattedMessage id="overskrift.mottatt"/>},
            {key: 'kortStatus', label: <FormattedMessage id="overskrift.status"/>, cell: function( row: any, columnKey: any) {
                    return (
                        <EtikettBase
                            type={finnRiktigEtikettType(row.kortStatus)}
                            className={HvisIngenBeregningSettBlaEtikett(row.kortStatus)}
                        > {row.kortStatus}
                        </EtikettBase>
                    );
                }},
            {key: 'bruttoBelop', label: <FormattedMessage id="overskrift.bruttoBelop"/>},
            {key: 'kortType', label: <FormattedMessage id="overskrift.meldekorttype"/>}
        ];
        return(
            <div className="sideinnhold innhold-detaljer">
                <img src={utklippstavle}/>
                <PeriodeBanner/>
                <section className="seksjon">
                    <div className="tabell-detaljer">
                        <Tabell rows={rows} columns={columns}/>
                    </div>
                </section>
                { meldekortdetaljer.meldekortdetaljer.id !== '' ?
                    <Meldekortdetaljer meldekortdetaljer={ meldekortdetaljer.meldekortdetaljer}/> :
                    <div className="meldekort-spinner"><NavFrontendSpinner type={'XL'}/></div> }

                    <section className="seksjon flex-innhold sentrert">
                    <NavKnapp
                        type={knappTyper.standard}
                        nestePath={'/tidligere-meldekort'}
                        tekstid={'naviger.forrige'}
                        className={'navigasjonsknapp'}
                    />
                    { aktivtMeldekort.meldekort.korrigerbart ?
                        <NavKnapp
                            type={knappTyper.hoved}
                            nestePath={router.location.pathname + '/korriger'}
                            tekstid={'korriger.meldekort'}
                            className={'navigasjonsknapp'}
                            nesteAktivtMeldekort={ aktivtMeldekort.meldekort}
                            nesteInnsendingstype={Innsendingstyper.korrigering}

                        /> : null
                    }

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