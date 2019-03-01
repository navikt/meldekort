import * as React from 'react';
import { Innholdstittel } from 'nav-frontend-typografi';
import Sprakvelger from '../../components/sprakvelger/sprakvelger';
import { FormattedHTMLMessage, FormattedMessage } from 'react-intl';
import { EkspanderbartpanelPure } from 'nav-frontend-ekspanderbartpanel';
import { hentIntl } from '../../utils/intlUtil';

import sporrende from '../../ikoner/sporrende.svg';

interface SporsmalProps {
    overskriftId: string;
    tekstId: string;
    id: number;
}

interface SporsmalVisningState {
    valgtSporsmalId: number;
}

class OfteStilteSporsmal extends React.Component<any, SporsmalVisningState> {
    constructor(props: any) {
        super(props);
        this.state = {valgtSporsmalId: 0};
        this.handleClick = this.handleClick.bind(this);
    }

    sporsmal = (): SporsmalProps[] => {
        return [
            {overskriftId: 'oss.sende.overskrift', tekstId: 'oss.sende.tekst', id: 1},
            {overskriftId: 'oss.frist.overskrift', tekstId: 'oss.frist.tekst', id: 2},
            {overskriftId: 'oss.korrigere.overskrift', tekstId: 'oss.korrigere.tekst', id: 3},
            {overskriftId: 'oss.pengene.overskrift', tekstId: 'oss.pengene.tekst', id: 4},
            {overskriftId: 'oss.utbetalt.overskrift', tekstId: 'oss.utbetalt.tekst', id: 5}
        ];
    }

    handleClick = (sporsmalId: number) => {
        this.setState( {
            valgtSporsmalId: this.state.valgtSporsmalId === sporsmalId ? 0 : sporsmalId
        });
    }

    hentFormatertOverskrift = (id: string): string => {
        return hentIntl().formatMessage({id: id});
    }

    render() {
        return(
            <div className="sideinnhold">
                <section className="seksjon flex-innhold tittel-sprakvelger">
                    <Innholdstittel><FormattedMessage id="overskrift.ofteStilteSporsmal" /></Innholdstittel>
                <img className="oss-ikon" src={sporrende}/>
                <section className="seksjon">
                    <Sprakvelger/>
                </section>
                <section className="oss-seksjon seksjon">
                    {
                        this.sporsmal().map((sporsmal) => {
                            return (
                                <EkspanderbartpanelPure
                                    key={sporsmal.id}
                                    onClick={() => this.handleClick(sporsmal.id)}
                                    border={true}
                                    tittel={this.hentFormatertOverskrift(sporsmal.overskriftId)}
                                    apen={this.state.valgtSporsmalId === sporsmal.id}
                                >
                                    <FormattedHTMLMessage id={sporsmal.tekstId}/>
                                </EkspanderbartpanelPure>
                            );
                        })
                    }
                </section>
            </div>
        );
    }
}

export default OfteStilteSporsmal;
