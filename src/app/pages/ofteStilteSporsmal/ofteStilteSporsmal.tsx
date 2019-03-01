import * as React from 'react';
import { Innholdstittel } from 'nav-frontend-typografi';
import Sprakvelger from '../../components/sprakvelger/sprakvelger';
import { FormattedMessage, FormattedHTMLMessage } from 'react-intl';

class OfteStilteSporsmal extends React.Component<any, any> {
    constructor(props: any) {
        super(props);
    }

    render() {
        return(
            <div className="sideinnhold">
                <section className="seksjon flex-innhold tittel-sprakvelger">
                    <Innholdstittel><FormattedMessage id="overskrift.ofteStilteSporsmal" /></Innholdstittel>
                    <Sprakvelger/>
                </section>
                <section className="seksjon">
                    <FormattedHTMLMessage id="genereltOmMeldekort.innhold" />
                </section>
            </div>
        );
    }
}

export default OfteStilteSporsmal;
