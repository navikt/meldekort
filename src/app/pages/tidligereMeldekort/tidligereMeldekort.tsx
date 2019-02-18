import * as React from 'react';
import { Innholdstittel } from 'nav-frontend-typografi';
import { FormattedMessage } from 'react-intl';
import Sprakvelger from '../../components/sprakvelger/sprakvelger';
import { Dispatch } from 'redux';
import { HistoriskeMeldekortActions } from '../../actions/historiskeMeldekort';
import { connect } from 'react-redux';
import Tabell from '../../components/tabell/tabell';
import EtikettBase from 'nav-frontend-etiketter';
import Lenke from 'nav-frontend-lenker';
import { HistoriskeMeldekortState } from '../../reducers/historiskeMeldekortReducer';
import { RootState } from '../../store/configureStore';
import { formaterDato, hentDatoPeriode, hentUkePeriode } from '../../utils/dates';

interface MapStateToProps {
    historiskeMeldekort: HistoriskeMeldekortState;
}

interface MapDispatchToProps {
    hentHistoriskeMeldekort: () => void;
}

interface HistoriskeMeldekortRad {
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
                periode: hentUkePeriode(historiskeMeldekortListe[i].meldeperiode.fra, historiskeMeldekortListe[i].meldeperiode.til),
                dato: hentDatoPeriode(historiskeMeldekortListe[i].meldeperiode.fra, historiskeMeldekortListe[i].meldeperiode.til),
                mottatt: formaterDato(historiskeMeldekortListe[i].mottattDato),
                status: historiskeMeldekortListe[i].kortStatus,
                bruttobelop: `${historiskeMeldekortListe[i].bruttoBelop.toString()} kr`,
                detaljer: 'Detaljer >'
            };
            radliste.push(rad);
        }
        return radliste;
    }

    render() {
        const rows = this.hentRaderFraHistoriskeMeldekort();

        // TODO: Endres når vi vet mer om fargekodene.
        const finnRiktigEtikettType = (statustekst: any) => {
            if (statustekst === 'Til beregning' || statustekst === 'Til manuell') {
                return 'fokus';
            } else if (statustekst === 'Beregnet') {
                return 'suksess';
            } else {
                return 'info';
            }
        };

        const HvisIngenBeregningSettBlaEtikett = (statustekst: any) => {
          if (statustekst === 'Ingen beregning')  {
              return 'blaEtikett';
          } else {
              return '';
          }
        };

        const columns = [
            {key: 'periode', label: 'Periode', cell: 'periode'},
            {key: 'dato', label: 'Dato', cell: 'dato'},
            {key: 'mottatt', label: 'Mottatt', cell: 'mottatt'},
            {key: 'status', label: 'Status', cell: function( row: any, columnKey: any) {
                return (
                    <EtikettBase
                        type={finnRiktigEtikettType(row.status)}
                        className={HvisIngenBeregningSettBlaEtikett(row.status)}
                    > {row.status}
                    </EtikettBase>
                    );
                }},
            {key: 'bruttobelop', label: 'Bruttobelop', cell: 'bruttobelop'},
            {key: 'detaljer', label: 'Detaljer', cell: function( row: any, columnKey: any) {
                    return <Lenke href=""> {row.detaljer} </Lenke>;
                }}
        ];

        return(
            <div className="sideinnhold">
                <Innholdstittel className="seksjon"><FormattedMessage id="overskrift.tidligereMeldekort" /></Innholdstittel>
                <section className="seksjon">
                    <Sprakvelger/>
                </section>
                <section className="seksjon">
                    <FormattedMessage id="tidligereMeldekort.forklaring" />
                </section>
                <section className="seksjon">
                    <FormattedMessage id="tidligereMeldekort.forklaring.korrigering" />
                </section>
                <section className="seksjon">
                    <Tabell
                        rows={rows}
                        columns={columns}
                    />
                </section>
            </div>
        );
    }
}

const mapStateToProps = (historiskeMeldekort: RootState): MapStateToProps => {
    return {
        historiskeMeldekort: historiskeMeldekort.historiskeMeldekort,
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
