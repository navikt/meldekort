import * as React from 'react';
import { Undertittel } from 'nav-frontend-typografi';
import HjelpetekstBase from 'nav-frontend-hjelpetekst';
import { FormattedMessage, FormattedHTMLMessage } from 'react-intl';
import { RadioPanelGruppe } from 'nav-frontend-skjema';
import { injectIntl, InjectedIntlProps } from 'react-intl';

interface SporsmalProps {
    id: string;
    sporsmal: string;
    jaSvar: string;
    neiSvar: string;
    hjelpetekst: string;
    sporsmalOnChange: (event: React.SyntheticEvent<EventTarget>) => void;
}

const Sporsmal: React.StatelessComponent<SporsmalProps & InjectedIntlProps> = (props) => {

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
                        label: props.intl.formatMessage({ id: props.jaSvar }),
                        value: 'ja'
                    },
                    {
                        label: props.intl.formatMessage({ id: props.neiSvar }),
                        value: 'nei'
                    }
                ]}
                checked="false"
                onChange={props.sporsmalOnChange}
            />

        </section>
    );
};

export default injectIntl(Sporsmal);
