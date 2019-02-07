import * as React from 'react';
import { Innholdstittel } from 'nav-frontend-typografi';
import Sprakvelger from '../../components/sprakvelger/sprakvelger';
import AlertStripe from 'nav-frontend-alertstriper';
import { FormattedMessage, FormattedHTMLMessage } from 'react-intl';
import { connect } from 'react-redux';

class SendMeldekort extends React.Component<any, any> {
    constructor(props: any) {
        super(props);
    }

    render() {
        return(
            <div className="sideinnhold">
                <Innholdstittel> Send Meldekort siden </Innholdstittel>
                <Sprakvelger/>
                <FormattedMessage id="annetFravaer.Required_AAP" defaultMessage="Hallois!" />
                <AlertStripe type="info" solid={true}>
                    <FormattedHTMLMessage id="sendMeldekort.alert.forklaring"/>
                </AlertStripe>


            </div>
        );
    }
}

export default connect()(SendMeldekort);
