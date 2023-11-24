import * as React from 'react';
import Stegindikator from 'nav-frontend-stegindikator/lib/stegindikator';
import { formatMessage } from '../../utils/intlUtil';
import { useLocation } from "react-router-dom";

const StegBanner: React.FunctionComponent = () => {
  const location = useLocation();

  const stegobjekter = [];
  const routes = ['sporsmal', 'utfylling', 'bekreftelse', 'kvittering'];
  const pathParams = location.pathname.split('/');
  const aktivtSteg = routes.findIndex(
    steg => steg === pathParams[pathParams.length - 1]
  );

  for (let i = 1; i < 5; i++) {
    const stegobj = Object.assign({
      index: i,
      label: formatMessage('overskrift.steg' + i),
    });
    stegobjekter.push(stegobj);
  }

  return (
    <section className="seksjon stegbanner noPrint">
      <Stegindikator
        steg={stegobjekter}
        aktivtSteg={aktivtSteg}
        kompakt={true}
        visLabel={true}
        autoResponsiv={true}
      />
    </section>
  );
};

export default StegBanner;
