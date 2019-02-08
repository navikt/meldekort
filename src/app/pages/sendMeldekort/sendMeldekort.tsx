import * as React from 'react';
import { Innholdstittel } from 'nav-frontend-typografi';
import Sprakvelger from '../../components/sprakvelger/sprakvelger';
import AlertStripe from 'nav-frontend-alertstriper';
import { FormattedMessage, FormattedHTMLMessage } from 'react-intl';
import { connect } from 'react-redux';
import KnappBase from 'nav-frontend-knapper';

class SendMeldekort extends React.Component<any, any> {
    constructor(props: any) {
        super(props);
    }

    // bruker sitt antall meldekort må hentes fra store (etter at vi har fått koblet sammen back2front)

    render() {
        return(
            <main className="sideinnhold">
                <Innholdstittel className="seksjon"> [X] meldekort klar for innsending </Innholdstittel>
                <Sprakvelger/>
                <section className="seksjon">
                    <FormattedMessage id="annetFravar.required-AAP" defaultMessage="Hallois!" />
                </section>
                <section className="seksjon">
                    <AlertStripe type="info" solid={true}>
                        <FormattedHTMLMessage id="sendMeldekort.alert.forklaring"/>
                    </AlertStripe>
                </section>
                <section className="seksjon flex-innhold sentrert">
                    <KnappBase type="hoved">
                        <FormattedMessage id="sendMeldekort.knapp.startUtfylling" />
                    </KnappBase>
                </section>
            </main>
        );
    }
}

export default connect()(SendMeldekort);
