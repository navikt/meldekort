import * as React from 'react';
import { Undertittel } from 'nav-frontend-typografi';
import HjelpetekstBase from 'nav-frontend-hjelpetekst';
import { FormattedMessage, FormattedHTMLMessage } from 'react-intl';
import { RadioPanelGruppe } from 'nav-frontend-skjema';
import { hentIntl } from '../../../../utils/intlUtil';
import { Sporsmal as Spm } from './sporsmalConfig';
import AlertStripe from 'nav-frontend-alertstriper';
import Normaltekst from 'nav-frontend-typografi/lib/normaltekst';
import Ingress from 'nav-frontend-typografi/lib/ingress';

interface SporsmalProps {
    sporsmalsobjekt: Spm;
    checked: string | undefined;
    sporsmalOnChange: (event: React.SyntheticEvent<EventTarget>) => void;
    formatertDato?: string;
    disabled: boolean;
}

const Sporsmal: React.FunctionComponent<SporsmalProps> = (props) => {

    return (
        <section className="seksjon sporsmal">
            <div className="flex-sporsmal-hjelpetekst-container">
                <Undertittel>
                    <FormattedMessage id={props.sporsmalsobjekt.sporsmal} />
                    {props.formatertDato ?
                        <span> {props.formatertDato} ? </span> : null
                    }
                </Undertittel>
                {props.disabled ? (
                    <>
                        <Ingress> {hentIntl().formatMessage({ id: 'korrigering.registrert.merknad'})}</Ingress>
                    </>
                ) : (
                    <>
                        <HjelpetekstBase id={props.sporsmalsobjekt.kategori} type="over">
                            <FormattedHTMLMessage id={props.sporsmalsobjekt.forklaring} />
                        </HjelpetekstBase>
                    </>
                )}
            </div>

            <RadioPanelGruppe
                name={props.sporsmalsobjekt.kategori}
                legend=""
                radios={[
                    {
                        label: hentIntl().formatMessage({ id: props.sporsmalsobjekt.ja }),
                        value: props.sporsmalsobjekt.kategori + '.ja',
                        disabled: props.disabled
                    },
                    {
                        label: hentIntl().formatMessage({ id: props.sporsmalsobjekt.nei }),
                        value: props.sporsmalsobjekt.kategori + '.nei',
                        disabled: props.disabled
                    }
                ]}
                checked={props.checked}
                onChange={props.sporsmalOnChange}
                feil={props.sporsmalsobjekt.feil.erFeil ?
                    {feilmelding: hentIntl().formatMessage({id: props.sporsmalsobjekt.feil.feilmeldingId})}
                    : undefined
                }
            />

        </section>
    );
};

export default Sporsmal;
