import * as React from "react";
import { formatMessage } from "../../utils/intlUtil";
import { useLocation } from "react-router-dom";
import { Stepper } from "@navikt/ds-react";

const StegBanner: React.FunctionComponent = () => {
  const location = useLocation();

  const routes = ["sporsmal", "utfylling", "bekreftelse", "kvittering"];
  const pathParams = location.pathname.split("/");
  const aktivtSteg = routes.findIndex(
    steg => steg === pathParams[pathParams.length - 1]
  );

  return (
    <section className="seksjon stegbanner noPrint">
      <Stepper
        aria-labelledby="stepper-heading"
        activeStep={aktivtSteg+1}
        interactive={false}
        orientation="horizontal"
      >
        <Stepper.Step href="#">{formatMessage("overskrift.steg1")}</Stepper.Step>
        <Stepper.Step href="#">{formatMessage("overskrift.steg2")}</Stepper.Step>
        <Stepper.Step href="#">{formatMessage("overskrift.steg3")}</Stepper.Step>
        <Stepper.Step href="#">{formatMessage("overskrift.steg4")}</Stepper.Step>
      </Stepper>
    </section>
  );
};

export default StegBanner;
