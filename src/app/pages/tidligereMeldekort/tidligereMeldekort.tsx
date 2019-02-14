import * as React from 'react';
import { Innholdstittel } from 'nav-frontend-typografi';
import { FormattedMessage } from 'react-intl';
import Sprakvelger from '../../components/sprakvelger/sprakvelger';
import { fetchHistoriskeMeldekort } from '../../api/api';
import { Dispatch } from 'redux';
import { HistoriskeMeldekortActions } from '../../actions/historiskeMeldekort';
import { connect } from 'react-redux';
import { hentHistoriskeMeldekort } from '../../api/api';
import Tabell from '../../components/tabell/tabell';
import EtikettBase from 'nav-frontend-etiketter';
import Lenke from 'nav-frontend-lenker';

interface MapDispatchToProps {
    hentHistoriskeMeldekort: () => void;
}

type Props = MapDispatchToProps;

class TidligereMeldekort extends React.Component<Props> {
    constructor(props: any) {
        super(props);

        this.props.hentHistoriskeMeldekort();
    }

    render() {
        console.log(hentHistoriskeMeldekort());

        // Hentes fra store når ting er sammenkoblet.
        const rows = [
            {
                'periode': 'uke 31-32',
                'dato': '30. jul 2018 - 13. aug 2018',
                'mottatt': '02.09.2018',
                'status': 'Til beregning',
                'bruttobelop': '9 270,00',
                'detaljer': 'Detaljer >'
            },
            {
                'periode': 'uke 29-30',
                'dato': '16. jul 2018 - 30. jul 2018',
                'mottatt': '30.07.2018',
                'status': 'Til manuell',
                'bruttobelop': '9 270,00',
                'detaljer': 'Detaljer >'
            },
            {
                'periode': 'uke 27-28',
                'dato': '2. jul 2018 - 16. jul 2018',
                'mottatt': '16.06.2018',
                'status': 'Beregnet',
                'bruttobelop': '9 270,00',
                'detaljer': 'Detaljer >'
            },
            {
                'periode': 'uke 27-28',
                'dato': '2. jul 2018 - 16. jul 2018',
                'mottatt': '16.06.2018',
                'status': 'Ingen beregning',
                'bruttobelop': '9 270,00',
                'detaljer': 'Detaljer >'
            },
        ];

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

const mapDispatchToProps = (dispatch: Dispatch): MapDispatchToProps => {
        return {
            hentHistoriskeMeldekort: () => dispatch(HistoriskeMeldekortActions.hentHistoriskeMeldekort.request()),
        };
};

export default connect(
    null,
    mapDispatchToProps,
) (TidligereMeldekort);
