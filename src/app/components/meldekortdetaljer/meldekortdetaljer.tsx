import * as React from 'react';
import { MeldekortdetaljerState } from '../../reducers/meldekortdetaljerReducer';
import { SporsmalOgSvar } from '../../types/meldekort';
import { hentNestePeriodeMedUkerOgDato } from '../../utils/dates';
import { RootState } from '../../store/configureStore';
import { connect } from 'react-redux';
import BegrunnelseVisning from './begrunnelsevisning/begrunnelse';
import SporsmalVisning from './sporsmalvisning/sporsmal';
import Ukeliste from './ukevisning/ukeliste';

interface ErAap {
  erAap: boolean;
}

const mapStateToProps = (state: RootState) => {
  return {
    aktivtMeldekort: state.aktivtMeldekort,
  };
};

type Props = MeldekortdetaljerState & ErAap & ReturnType<typeof mapStateToProps>;

const Meldekortdetaljer: React.FunctionComponent<Props> = props => {
  const sporsmalOgSvar = (): SporsmalOgSvar[] => {
    let aap = '';
    if (props.erAap) {
      aap = '-AAP';
    }
    return [
      {
        sporsmalId: 'sporsmal.arbeid',
        svar: props.meldekortdetaljer.sporsmal.arbeidet,
        forklaring: 'forklaring.sporsmal.arbeid' + aap,
      },
      {
        sporsmalId: 'sporsmal.aktivitetArbeid' + aap,
        svar: props.meldekortdetaljer.sporsmal.kurs,
        forklaring: 'forklaring.sporsmal.aktivitetArbeid' + aap,
      },
      {
        sporsmalId: 'sporsmal.forhindret' + aap,
        svar: props.meldekortdetaljer.sporsmal.syk,
        forklaring: 'forklaring.sporsmal.forhindret' + aap,
      },
      {
        sporsmalId: 'sporsmal.ferieFravar' + aap,
        svar: props.meldekortdetaljer.sporsmal.annetFravaer,
        forklaring: 'forklaring.sporsmal.ferieFravar' + aap,
      },
      {
        sporsmalId: 'sporsmal.registrert',
        svar: props.meldekortdetaljer.sporsmal.arbeidssoker,
        forklaring: 'forklaring.sporsmal.registrert' + aap,
        formatertDato: hentNestePeriodeMedUkerOgDato(
          props.aktivtMeldekort.meldeperiode.fra,
          props.aktivtMeldekort.meldeperiode.til
        ),
      },
    ];
  };

  const meldekortdager = props.meldekortdetaljer.sporsmal.meldekortDager;

  return (
    <div className="meldekortdetaljer">
      <div className="sporsmalsvisning">
        <BegrunnelseVisning begrunnelse={props.meldekortdetaljer.begrunnelse} />
        <SporsmalVisning sporsmalOgSvar={sporsmalOgSvar()} />
      </div>
      <div className="ukevisning">
        <Ukeliste
          erAap={props.erAap}
          aktivtMeldekort={props.aktivtMeldekort}
          meldekortDager={meldekortdager.slice(0, 7)}
          ukeNr={1}
        />
        <Ukeliste
          erAap={props.erAap}
          aktivtMeldekort={props.aktivtMeldekort}
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
