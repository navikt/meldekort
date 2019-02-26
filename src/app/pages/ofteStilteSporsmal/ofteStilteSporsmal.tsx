import * as React from 'react';
import { Innholdstittel } from 'nav-frontend-typografi';
import Sprakvelger from '../../components/sprakvelger/sprakvelger';
import { FormattedMessage, FormattedHTMLMessage } from 'react-intl';
import Ekspanderbartpanel from 'nav-frontend-ekspanderbartpanel';
import { hentIntl } from '../../utils/intlUtil';

import sporrende from '../../ikoner/sporrende.svg';

class OfteStilteSporsmal extends React.Component<any, any> {
    constructor(props: any) {
        super(props);
    }

    hentFormatertOverskrift = (id: string): string => {
        return hentIntl().formatMessage({id: id});
    }

    render() {
        return(
            <div className="sideinnhold">
                <Innholdstittel className="seksjon"><FormattedMessage id="overskrift.ofteStilteSporsmal" /></Innholdstittel>
                <img className="oss-ikon" src={sporrende}/>
                <section className="seksjon">
                    <Sprakvelger/>
                </section>
                <section className="oss-seksjon seksjon">
                    <Ekspanderbartpanel tittel={this.hentFormatertOverskrift('oss.sende.overskrift')} border={true}>
                        <FormattedHTMLMessage id={'oss.sende.tekst'}/>
                    </Ekspanderbartpanel>
                    <Ekspanderbartpanel tittel={this.hentFormatertOverskrift('oss.frist.overskrift')} border={true}>
                        <FormattedHTMLMessage id={'oss.frist.tekst'}/>
                    </Ekspanderbartpanel>
                    <Ekspanderbartpanel tittel={this.hentFormatertOverskrift('oss.korrigere.overskrift')} border={true}>
                        <FormattedHTMLMessage id={'oss.korrigere.tekst'}/>
                    </Ekspanderbartpanel>
                    <Ekspanderbartpanel tittel={this.hentFormatertOverskrift('oss.pengene.overskrift')} border={true}>
                        <FormattedHTMLMessage id={'oss.pengene.tekst'}/>
                    </Ekspanderbartpanel>
                    <Ekspanderbartpanel tittel={this.hentFormatertOverskrift('oss.utbetalt.overskrift')} border={true}>
                        <FormattedHTMLMessage id={'oss.utbetalt.tekst'}/>
                    </Ekspanderbartpanel>
                </section>
            </div>
        );
    }
}

export default OfteStilteSporsmal;
