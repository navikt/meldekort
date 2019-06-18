import * as React from 'react';
import { MeldekortdetaljerState } from '../../reducers/meldekortdetaljerReducer';
import { hentNestePeriodeMedUkerOgDato } from '../../utils/dates';
import { RootState } from '../../store/configureStore';
import { connect } from 'react-redux';
import BegrunnelseVisning from './begrunnelsevisning/begrunnelse';
import SporsmalOgSvarVisning from './sporsmalvisning/sporsmalOgSvar';
import Ukeliste from './ukevisning/ukeliste';
import {
  hentSporsmalConfig,
  Sporsmal,
} from '../../sider/innsending/1-sporsmalsside/sporsmal/sporsmalConfig';
import { hentAapStreng } from '../../utils/teksterUtil';

interface ErAap {
  erAap: boolean;
}

const mapStateToProps = (state: RootState) => {
  return {
    aktivtMeldekort: state.aktivtMeldekort,
  };
};

type Props = MeldekortdetaljerState & ErAap & ReturnType<typeof mapStateToProps>;

const Meldekortdetaljer: React.FunctionComponent<Props> = ({
  aktivtMeldekort,
  erAap,
  meldekortdetaljer,
}) => {
  const config = hentSporsmalConfig();
  const meldekortdager = meldekortdetaljer.sporsmal.meldekortDager;

  const hentSvar = (spmid: string) => {
    for (let sporsmalKey in meldekortdetaljer.sporsmal) {
      if (sporsmalKey === spmid) {
        return meldekortdetaljer.sporsmal[sporsmalKey];
        break;
      }
    }
  };

  const hentSporsmalOgSvar = (formatertDato: string, erAap: boolean) => {
    const aap = hentAapStreng(erAap);

    const sporsmalOgSvarConfig = config.map(sporsmalsObj => {
      return {
        kategori: sporsmalsObj.kategori,
        sporsmal: sporsmalsObj.sporsmal + aap,
        forklaring: sporsmalsObj.forklaring + aap,
        svar: hentSvar(sporsmalsObj.id),
        formatertDato: sporsmalsObj.kategori === 'registrert' ? formatertDato : undefined,
      };
    });
    return sporsmalOgSvarConfig;
  };

  const sporsmalOgSvar = hentSporsmalOgSvar(
    hentNestePeriodeMedUkerOgDato(
      aktivtMeldekort.meldeperiode.fra,
      aktivtMeldekort.meldeperiode.til
    ),
    erAap
  );

  return (
    <div className="meldekortdetaljer">
      <div className="sporsmalsvisning">
        <BegrunnelseVisning begrunnelse={meldekortdetaljer.begrunnelse} />
        <SporsmalOgSvarVisning sporsmalOgSvar={sporsmalOgSvar} />
      </div>
      <div className="ukevisning">
        <Ukeliste
          erAap={erAap}
          aktivtMeldekort={aktivtMeldekort}
          meldekortDager={meldekortdager.slice(0, 7)}
          ukeNr={1}
        />
        <Ukeliste
          erAap={erAap}
          aktivtMeldekort={aktivtMeldekort}
          meldekortDager={meldekortdager.slice(7, 14)}
          ukeNr={2}
        />
      </div>
    </div>
  );
};

export default connect(
  mapStateToProps,
  null
)(Meldekortdetaljer);
