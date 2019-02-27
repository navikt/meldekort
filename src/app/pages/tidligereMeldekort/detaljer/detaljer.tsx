import * as React from 'react';
import { MeldekortdetaljerState } from '../../../reducers/meldekortdetaljerReducer';
import { history, RootState } from '../../../store/configureStore';
import { Dispatch } from 'redux';
import { MeldekortdetaljerActions } from '../../../actions/meldekortdetaljer';
import { connect } from 'react-redux';
import Meldekortdetaljer from '../../../components/meldekortdetaljer/meldekortdetaljer';
import { Ingress, Innholdstittel, Element, Normaltekst } from 'nav-frontend-typografi';
import { AktivtMeldekortState } from '../../../reducers/aktivtMeldekortReducer';
import { FormattedMessage } from 'react-intl';
import Tabell from '../../../components/tabell/tabell';
import { formaterDato, hentDatoPeriode, hentUkePeriode } from '../../../utils/dates';
import { mapKortTypeTilTekst, mapKortStatusTilTekst } from '../../../utils/mapper';
import { Router } from '../../../types/router';
import { selectRouter } from '../../../selectors/router';
import EtikettBase from 'nav-frontend-etiketter';
import { finnRiktigEtikettType, HvisIngenBeregningSettBlaEtikett } from '../../../utils/statusEtikettUtil';

import utklippstavle from '../../../ikoner/utklippstavle.svg';

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
        this.props.hentMeldekortdetaljer();
        this.sjekkAktivtMeldekortOgRedirect();
    }

    setTabellrader = () => {
        return [{
            mottattDato: formaterDato(this.props.aktivtMeldekort.meldekort.mottattDato),
            kortStatus: mapKortStatusTilTekst(this.props.aktivtMeldekort.meldekort.kortStatus),
            bruttoBelop: this.props.aktivtMeldekort.meldekort.bruttoBelop + ' kr',
            kortType: mapKortTypeTilTekst(this.props.meldekortdetaljer.meldekortdetaljer.kortType)
        }];
    }

    sjekkAktivtMeldekortOgRedirect = () => {
        if (this.props.aktivtMeldekort.meldekort.meldekortId === 0) {
            const pathname = this.props.router.location.pathname;
            const tidligereMeldekort = '/tidligere-meldekort';
            pathname !== tidligereMeldekort && history.push(tidligereMeldekort);
        }
    }

    render() {
        const meldeperiode = this.props.aktivtMeldekort.meldekort.meldeperiode;
        const rows = this.setTabellrader();
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
                <Ingress className="ingress-detaljer flex-innhold sentrert">
                    <FormattedMessage id="meldekort.for.perioden"/>
                </Ingress>
                <Innholdstittel className="flex-innhold sentrert">
                    {hentUkePeriode(meldeperiode.fra, meldeperiode.til)}
                </Innholdstittel>
                <Normaltekst className="flex-innhold sentrert">{hentDatoPeriode(meldeperiode.fra, meldeperiode.til)}</Normaltekst>
                <section className="seksjon">
                    <div className="tabell-detaljer">
                        <Tabell rows={rows} columns={columns}/>
                    </div>
                </section>
                { this.props.meldekortdetaljer.meldekortdetaljer.id !== '' ?
                    <Meldekortdetaljer meldekortdetaljer={this.props.meldekortdetaljer.meldekortdetaljer}/> : null }
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
