import * as React from 'react';
import { Undertittel } from 'nav-frontend-typografi';
import HjelpetekstBase from 'nav-frontend-hjelpetekst';
import { FormattedMessage, FormattedHTMLMessage } from 'react-intl';
import { RadioPanelGruppe } from 'nav-frontend-skjema';
import { hentIntl } from '../../utils/intlUtil';

interface SporsmalProps {
    key: string;
    id: string;
    sporsmal: string;
    jaSvar: string;
    neiSvar: string;
    hjelpetekst: string;
    checked: string | undefined;
    sporsmalOnChange: (event: React.SyntheticEvent<EventTarget>) => void;
}

const Sporsmal: React.StatelessComponent<SporsmalProps> = (props) => {

    return (
        <section className="seksjon sporsmal">
            <div className="flex-sporsmal-hjelpetekst-container">
                <Undertittel>
                    <FormattedMessage id={props.sporsmal} />
                </Undertittel>
                <HjelpetekstBase id={props.id} type="over">
                    <FormattedHTMLMessage id={props.hjelpetekst} />
                </HjelpetekstBase>
            </div>
            <RadioPanelGruppe
                name={props.id}
                legend=""
                radios={[
                    {
                        label: hentIntl().formatMessage({ id: props.jaSvar }),
                        value: 'ja'
                    },
                    {
                        label: hentIntl().formatMessage({ id: props.neiSvar }),
                        value: 'nei'
                    }
                ]}
                checked={props.checked}
                onChange={props.sporsmalOnChange}
            />

        </section>
    );
};

export default Sporsmal;
