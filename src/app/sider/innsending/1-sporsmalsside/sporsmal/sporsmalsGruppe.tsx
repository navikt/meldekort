import * as React from 'react';

import Sporsmal from './sporsmal';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import {
  InnsendingState,
  Innsendingstyper,
} from '../../../../types/innsending';
import { InnsendingActions } from '../../../../actions/innsending';
import { RootState } from '../../../../store/configureStore';
import { Sporsmal as Spm } from './sporsmalConfig';
import { hentNestePeriodeMedUkerOgDato } from '../../../../utils/dates';
import { Meldekort } from '../../../../types/meldekort';
import { finnesIntlId } from '../../../../utils/teksterUtil';

interface MapStateToProps {
  aktivtMeldekort: Meldekort;
}

interface MapDispatchToProps {
  oppdaterSvar: (sporsmalsobjekt: Spm[]) => void;
}

interface Props {
  typeYtelsePostfix: string;
  innsending: InnsendingState;
}

type SporsmalsGruppeProps = Props & MapStateToProps & MapDispatchToProps;

class SporsmalsGruppe extends React.Component<SporsmalsGruppeProps> {
  sporsmalOnChange = (
    event: React.SyntheticEvent<EventTarget>,
    value?: string
  ) => {
    const nySporsmalsobjekterState = this.props.innsending.sporsmalsobjekter.map(
      sporsmalsobj => {
        const val = value !== undefined ? value : '';
        if (sporsmalsobj.kategori === val.split('.')[0]) {
          return {
            ...sporsmalsobj,
            checked: value,
          };
        }
        return { ...sporsmalsobj };
      }
    );
    this.props.oppdaterSvar(nySporsmalsobjekterState);
  };

  lagSporsmal = (
    sporsmalsobj: Spm,
    typeYtelsePostfix: string,
    innsendingstype: Innsendingstyper | null
  ) => {
    let skalVareDisabled: boolean = false;
    console.log(typeYtelsePostfix);
    for (let key in sporsmalsobj) {
      if (
        sporsmalsobj[key] !== sporsmalsobj.kategori &&
        sporsmalsobj[key] !== sporsmalsobj.feil &&
        sporsmalsobj[key] !== sporsmalsobj.checked &&
        sporsmalsobj[key] !== sporsmalsobj.id
      ) {
        sporsmalsobj[key] = finnesIntlId(sporsmalsobj[key] + typeYtelsePostfix);
      } else if (sporsmalsobj[key] === sporsmalsobj.feil) {
        sporsmalsobj.feil.feilmeldingId = finnesIntlId(
          sporsmalsobj.feil.feilmeldingId
        );
      } else if (
        sporsmalsobj[key] === 'registrert' &&
        innsendingstype !== Innsendingstyper.INNSENDING
      ) {
        skalVareDisabled = true;
      }
    }
    let { til, fra } = this.props.aktivtMeldekort.meldeperiode;
    return (
      <Sporsmal
        sporsmalsobjekt={sporsmalsobj}
        key={sporsmalsobj.kategori}
        checked={sporsmalsobj.checked}
        disabled={skalVareDisabled}
        sporsmalOnChange={this.sporsmalOnChange}
        formatertDato={
          sporsmalsobj.kategori === 'registrert'
            ? hentNestePeriodeMedUkerOgDato(fra, til)
            : undefined
        }
      />
    );
  };

  render() {
    const { innsending, typeYtelsePostfix } = this.props;
    const sporsmalsgruppe = innsending.sporsmalsobjekter.map(sporsmalobj =>
      this.lagSporsmal(
        sporsmalobj,
        typeYtelsePostfix,
        innsending.innsendingstype
      )
    );

    return <>{sporsmalsgruppe}</>;
  }
}

const mapStateToProps = (state: RootState): MapStateToProps => {
  return {
    aktivtMeldekort: state.aktivtMeldekort,
  };
};

const mapDispatcherToProps = (dispatch: Dispatch): MapDispatchToProps => {
  return {
    oppdaterSvar: (sporsmalsobjekt: Spm[]) =>
      dispatch(InnsendingActions.oppdaterSpm(sporsmalsobjekt)),
  };
};

export default connect(mapStateToProps, mapDispatcherToProps)(SporsmalsGruppe);
