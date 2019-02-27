import * as React from 'react';
import { SporsmalOgSvar } from '../../types/meldekort';
import { Element } from 'nav-frontend-typografi';
import { FormattedMessage } from 'react-intl';
import checkMark from '../../ikoner/check.svg';

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
                        <Element>
                            <FormattedMessage id={sporsmalOgSvar.sporsmalId}/>
                            {sporsmalOgSvar.formatertDato ?
                                <span>
                                    {sporsmalOgSvar.formatertDato}?
                                </span> : null
                            }
                        </Element>
                        <img src={checkMark}/>
                        <span> {hentTekstForSvar(sporsmalOgSvar.svar)} </span>
                    </section>
                );
            })}
        </div>
    );
};

export default Sporsmalvisning;