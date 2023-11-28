import * as React from "react";
import { formatHtmlMessage, formatMessage } from "../../../../utils/intlUtil";
import { Sporsmal as Spm } from "./sporsmalConfig";
import UtvidetInformasjon from "../../../../components/utvidetinformasjon/utvidetInformasjon";
import { Radio, RadioGroup } from "@navikt/ds-react";

interface SporsmalProps {
  sporsmalsobjekt: Spm;
  checked: string | undefined;
  sporsmalOnChange: (value: string) => void;
  formatertDato?: string;
  disabled: boolean;
}

const Sporsmal: React.FunctionComponent<SporsmalProps> = props => {
  const legend = (
    <div className="typo-undertittel" style={{ marginBottom: "-2rem" }}>
      {formatHtmlMessage(props.sporsmalsobjekt.sporsmal)}
      {props.formatertDato ? <span> {props.formatertDato} ? </span> : null}{" "}
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
      <RadioGroup
        name={props.sporsmalsobjekt.kategori}
        legend={legend}
        description={description}
        disabled={props.disabled}
        onChange={props.sporsmalOnChange}
        error={props.sporsmalsobjekt.feil.erFeil}
        value={props.checked || ''}
      >
        <Radio value={props.sporsmalsobjekt.kategori + ".ja"}>{formatMessage(props.sporsmalsobjekt.ja)}</Radio>
        <Radio value={props.sporsmalsobjekt.kategori + ".nei"}>{formatMessage(props.sporsmalsobjekt.nei)}</Radio>
      </RadioGroup>
    </section>
  );
};

export default Sporsmal;
