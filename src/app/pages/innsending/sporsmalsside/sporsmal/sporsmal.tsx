import * as React from 'react';
import { Undertittel } from 'nav-frontend-typografi';
import HjelpetekstBase from 'nav-frontend-hjelpetekst';
import { FormattedMessage, FormattedHTMLMessage } from 'react-intl';
import { RadioPanelGruppe } from 'nav-frontend-skjema';
import { hentIntl } from '../../../../utils/intlUtil';
import { Sporsmal as Spm } from './sporsmalConfig';

interface SporsmalProps {
    sporsmalsobjekt: Spm;
    checked: string | undefined;
    sporsmalOnChange: (event: React.SyntheticEvent<EventTarget>) => void;
}

const Sporsmal: React.StatelessComponent<SporsmalProps> = (props) => {

    return (
        <section className="seksjon sporsmal">
            <div className="flex-sporsmal-hjelpetekst-container">
                <Undertittel>
                    <FormattedMessage id={props.sporsmalsobjekt.sporsmal} />
                </Undertittel>
                <HjelpetekstBase id={props.sporsmalsobjekt.kategori} type="over">
                    <FormattedHTMLMessage id={props.sporsmalsobjekt.forklaring} />
                </HjelpetekstBase>
            </div>
            <RadioPanelGruppe
                name={props.sporsmalsobjekt.kategori}
                legend=""
                radios={[
                    {
                        label: hentIntl().formatMessage({ id: props.sporsmalsobjekt.ja }),
                        value: props.sporsmalsobjekt.kategori + '.ja'
                    },
                    {
                        label: hentIntl().formatMessage({ id: props.sporsmalsobjekt.nei }),
                        value: props.sporsmalsobjekt.kategori + '.nei',
                    }
                ]}
                checked={props.checked}
                onChange={props.sporsmalOnChange}
            />

        </section>
    );
};

export default Sporsmal;
