import * as React from 'react';
import { Innholdstittel } from 'nav-frontend-typografi';
import Sprakvelger from '../../components/sprakvelger/sprakvelger';
import AlertStripe from 'nav-frontend-alertstriper';
import { FormattedMessage } from 'react-intl';
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
                <FormattedMessage id="app.greeting" defaultMessage="Hallois!" />
                <AlertStripe type="info" solid={true}>
                    De eldste meldekortene må fylles ut før du kan gå videre til de nyere. Klikk på "Start utfylling" nedenfor for å begynne nederst i bunken.
                </AlertStripe>

            </div>
        );
    }
}

export default connect()(SendMeldekort);
