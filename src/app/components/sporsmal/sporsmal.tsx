/*
import * as React from 'react';
import { Undertittel } from 'nav-frontend-typografi';
import HjelpetekstBase from 'nav-frontend-hjelpetekst';
import { FormattedMessage, FormattedHTMLMessage } from 'react-intl';
import { RadioPanelGruppe } from 'nav-frontend-skjema';

// Sender inn ID til teksten som skal brukes
interface SporsmalProps {
    AAP: boolean;
    id: string;
    sporsmal: string;
    svarJa: string;
    svarNei: string;
    hjelpetekst: string;
    sporsmalOnChange: (event: React.SyntheticEvent<EventTarget>) => void;
}

const Sporsmal: React.StatelessComponent<SporsmalProps> = (props) => {

    const svarsalternativer = {[
            { label: props.svarJa, value: props.svarJa },
    {}

            ]};

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
                    { label: 'Eplejuice', value: 'juice1' },
                    { label: 'Appelsinjuice', value: 'juice2'},
                    { label: 'Melk', value: 'melk'},
                    { label: 'Ananasjuice', value: 'juice3'}
                ]}
                checked="false"
                onChange={props.sporsmalOnChange}
            />

        </section>
    );
};

export default Sporsmal; */
