import * as React from 'react';
import { MeldekortdetaljerState } from '../../reducers/meldekortdetaljerReducer';
import { hentNestePeriodeMedUkerOgDato } from '../../utils/dates';
import { RootState } from '../../store/configureStore';
import { connect } from 'react-redux';
import BegrunnelseVisning from './begrunnelsevisning/begrunnelse';
import SporsmalOgSvarVisning from './sporsmalvisning/sporsmalOgSvar';
import Ukeliste from './ukevisning/ukeliste';
import { hentSporsmalConfig } from '../../sider/innsending/1-sporsmalsside/sporsmal/sporsmalConfig';
import { finnesIntlId } from '../../utils/teksterUtil';

interface localProps {
  typeYtelse: string;
}

const mapStateToProps = (state: RootState) => {
  return {
    aktivtMeldekort: state.aktivtMeldekort,
  };
};

type Props = MeldekortdetaljerState &
  localProps &
  ReturnType<typeof mapStateToProps>;

const Meldekortdetaljer: React.FunctionComponent<Props> = ({
  aktivtMeldekort,
  typeYtelse,
  meldekortdetaljer,
}) => {
  const config = hentSporsmalConfig();
  const meldekortdager = meldekortdetaljer.sporsmal.meldekortDager;

  const hentSvar = (spmid: string) => {
    for (const sporsmalKey in meldekortdetaljer.sporsmal) {
      if (sporsmalKey === spmid) {
        return meldekortdetaljer.sporsmal[sporsmalKey];
      }
    }
  };

  const hentSporsmalOgSvar = (formatertDato: string, typeYtelse: string) => {
    return config.map(sporsmalsObj => {
      return {
        kategori: sporsmalsObj.kategori,
        sporsmal: finnesIntlId(sporsmalsObj.sporsmal + typeYtelse),
        forklaring: finnesIntlId(sporsmalsObj.forklaring + typeYtelse),
        svar: hentSvar(sporsmalsObj.id),
        formatertDato:
          sporsmalsObj.kategori === 'registrert' ? formatertDato : undefined,
      };
    });
  };

  const sporsmalOgSvar = hentSporsmalOgSvar(
    hentNestePeriodeMedUkerOgDato(
      aktivtMeldekort.meldeperiode.fra,
      aktivtMeldekort.meldeperiode.til
    ),
    typeYtelse
  );

  return (
    <div className="meldekortdetaljer">
      <div className="sporsmalsvisning">
        <BegrunnelseVisning begrunnelse={meldekortdetaljer.begrunnelse} />
        <SporsmalOgSvarVisning sporsmalOgSvar={sporsmalOgSvar} />
      </div>
      <div className="ukevisning">
        <Ukeliste
          typeYtelse={typeYtelse}
          aktivtMeldekort={aktivtMeldekort}
          meldekortDager={meldekortdager.slice(0, 7)}
          ukeNr={1}
        />
        <Ukeliste
          typeYtelse={typeYtelse}
          aktivtMeldekort={aktivtMeldekort}
          meldekortDager={meldekortdager.slice(7, 14)}
          ukeNr={2}
        />
      </div>
    </div>
  );
};

export default connect(mapStateToProps, null)(Meldekortdetaljer);
