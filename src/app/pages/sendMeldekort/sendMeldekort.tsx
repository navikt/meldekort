import * as React from 'react';
import AlertStripe from 'nav-frontend-alertstriper';
import NavKnapp, { knappTyper } from '../../components/knapp/navKnapp';
import Sprakvelger from '../../components/sprakvelger/sprakvelger';
import Tabell from '../../components/tabell/tabell';
import { connect } from 'react-redux';
import { FormattedHTMLMessage } from 'react-intl';
import { hentMeldekort } from '../../api/api';
import { Innholdstittel } from 'nav-frontend-typografi';

class SendMeldekort extends React.Component<any, any> {
    constructor(props: any) {
        super(props);
    }

    // bruker sitt antall meldekort må hentes fra store (etter at vi har fått koblet sammen back2front)
    // TODO: Info varierer basert på antall mk

    render() {
        const mk = hentMeldekort();

        const rows = [
            {'periode': 'uke 31-32', 'dato': '30. jul 2018 - 13. aug 2018'},
            {'periode': 'uke 29-30', 'dato': '16. jul 2018 - 30. jul 2018'},
            {'periode': 'uke 27-28', 'dato': '2. jul 2018 - 16. jul 2018'},
        ];
        const columns = [
            {key: 'periode', label: 'Periode'},
            {key: 'dato', label: 'Dato'}
        ];

        return (
            <main className="sideinnhold">
                <Innholdstittel className="seksjon"> [X] meldekort klar for innsending </Innholdstittel>
                <section className="seksjon">
                    <Sprakvelger/>
                </section>
                <section className="seksjon">
                    <div className="item">
                        <FormattedHTMLMessage id="sendMeldekort.info.kanSende"/>
                    </div>
                    <div className="item">
                        <Tabell
                            rows={rows}
                            columns={columns}
                        />
                    </div>
                </section>
                <section className="seksjon">
                    <AlertStripe type="info" solid={true}>
                        <FormattedHTMLMessage id="sendMeldekort.info.automatiskLedet"/>
                        <FormattedHTMLMessage id="sendMeldekort.info.eldstePerioden"/>
                        <FormattedHTMLMessage id="sendMeldekort.info.neste"/>
                    </AlertStripe>
                </section>
                <section className="seksjon flex-innhold sentrert">
                    <NavKnapp
                        type={knappTyper.hoved}
                        nestePath={'/innsending'}
                        tekstid={'sendMeldekort.knapp.startUtfylling'}
                    />
                </section>
                {console.log(mk)}
            </main>
        );
    }
}

export default connect()(SendMeldekort);
