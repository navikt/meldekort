import * as React from 'react';
import { RadioPanelGruppe } from 'nav-frontend-skjema';
import { formatHtmlMessage, hentIntl } from '../../../../utils/intlUtil';
import { Sporsmal as Spm } from './sporsmalConfig';
import UtvidetInformasjon from '../../../../components/utvidetinformasjon/utvidetInformasjon';

interface SporsmalProps {
  sporsmalsobjekt: Spm;
  checked: string | undefined;
  sporsmalOnChange: (event: React.SyntheticEvent<EventTarget>) => void;
  formatertDato?: string;
  disabled: boolean;
}

const Sporsmal: React.FunctionComponent<SporsmalProps> = props => {
  const legend = (
    <div className="typo-undertittel" style={{ marginBottom: '-2rem' }}>
      {formatHtmlMessage(props.sporsmalsobjekt.sporsmal)}
      {props.formatertDato ? <span> {props.formatertDato} ? </span> : null}{' '}
      {props.disabled ? (formatHtmlMessage("korrigering.registrert.merknad")) : null}
    </div>
  );

  const description = (
    <UtvidetInformasjon>
      {formatHtmlMessage(props.sporsmalsobjekt.forklaring)}
    </UtvidetInformasjon>
  );

  return (
    <section className="seksjon sporsmal">
      <RadioPanelGruppe
        name={props.sporsmalsobjekt.kategori}
        legend={legend}
        description={description}
        radios={[
          {
            label: hentIntl().formatMessage({ id: props.sporsmalsobjekt.ja }),
            value: props.sporsmalsobjekt.kategori + '.ja',
            disabled: props.disabled,
          },
          {
            label: hentIntl().formatMessage({ id: props.sporsmalsobjekt.nei }),
            value: props.sporsmalsobjekt.kategori + '.nei',
            disabled: props.disabled,
          },
        ]}
        checked={props.checked}
        onChange={props.sporsmalOnChange}
        feil={props.sporsmalsobjekt.feil.erFeil}
      />
    </section>
  );
};

export default Sporsmal;
