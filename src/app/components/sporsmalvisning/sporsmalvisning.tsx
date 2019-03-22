import * as React from 'react';
import { SporsmalOgSvar } from '../../types/meldekort';
import { Element, Undertittel } from 'nav-frontend-typografi';
import { FormattedHTMLMessage, FormattedMessage } from 'react-intl';
import checkMark from '../../ikoner/check.svg';
import HjelpetekstBase from 'nav-frontend-hjelpetekst';

interface Props {
    sporsmalOgSvar: SporsmalOgSvar[];
}

const Sporsmalvisning: React.FunctionComponent<Props> = (props) => {

    const hentTekstForSvar = (svar: boolean) => {
        if (svar) {
            return <FormattedMessage id="diverse.ja"/>;
        }
        return <FormattedMessage id="diverse.nei"/>;
    };

    return (
        <div>
            {props.sporsmalOgSvar.map((sporsmalOgSvar) => {
                return (
                    <section key={sporsmalOgSvar.sporsmalId} className="seksjon">
                        <div className="flex-sporsmal-hjelpetekst-container">
                            <Undertittel>
                                <FormattedMessage id={sporsmalOgSvar.sporsmalId}/>
                                {sporsmalOgSvar.formatertDato ?
                                    <span>
                                        {sporsmalOgSvar.formatertDato}?
                                    </span> : null
                                }
                            </Undertittel>
                            <HjelpetekstBase id={sporsmalOgSvar.forklaring} type="over">
                                <FormattedHTMLMessage id={sporsmalOgSvar.forklaring} />
                            </HjelpetekstBase>
                        </div>
                        <img src={checkMark}/>
                        <span> {hentTekstForSvar(sporsmalOgSvar.svar)} </span>
                    </section>
                );
            })}
        </div>
    );
};

export default Sporsmalvisning;