import * as React from 'react';
import { Innholdstittel } from 'nav-frontend-typografi';
import { FormattedMessage } from 'react-intl';
import Sprakvelger from '../../components/sprakvelger/sprakvelger';
import Tabell from '../../components/tabell/tabell';

class TidligereMeldekort extends React.Component<any, any> {
    constructor(props: any) {
        super(props);
    }

    render() {

        const rows = [
            {'periode': 'uke 31-32', 'dato': '30. jul 2018 - 13. aug 2018'},
            {'periode': 'uke 29-30', 'dato': '16. jul 2018 - 30. jul 2018'},
            {'periode': 'uke 27-28', 'dato': '2. jul 2018 - 16. jul 2018'},
        ];
        const columns = [
            {key: 'periode', label: 'Periode'},
            {key: 'dato', label: 'Dato'}
        ];

        return(
            <div className="sideinnhold">
                <Innholdstittel className="seksjon"> Tidligere meldekort </Innholdstittel>
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

export default TidligereMeldekort;
