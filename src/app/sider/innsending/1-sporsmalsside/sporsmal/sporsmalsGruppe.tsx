import * as React from 'react';

import Sporsmal from './sporsmal';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { InnsendingState, Innsendingstyper } from '../../../../types/innsending';
import { InnsendingActions } from '../../../../actions/innsending';
import { RootState } from '../../../../store/configureStore';
import { Sporsmal as Spm } from './sporsmalConfig';
import { hentNestePeriodeMedUkerOgDato } from '../../../../utils/dates';
import { Meldekort } from '../../../../types/meldekort';
import { finnesIntlId, hentAapStreng } from '../../../../utils/teksterUtil';

interface MapStateToProps {
  aktivtMeldekort: Meldekort;
}

interface MapDispatchToProps {
  oppdaterSvar: (sporsmalsobjekt: Spm[]) => void;
}

interface Props {
  AAP: boolean;
  innsending: InnsendingState;
}

type SporsmalsGruppeProps = Props & MapStateToProps & MapDispatchToProps;

class SporsmalsGruppe extends React.Component<SporsmalsGruppeProps> {
  sporsmalOnChange = (event: React.SyntheticEvent<EventTarget>, value?: string) => {
    const nySporsmalsobjekterState = this.props.innsending.sporsmalsobjekter.map(sporsmalsobj => {
      const val = value !== undefined ? value : '';
      if (sporsmalsobj.kategori === val.split('.')[0]) {
        return {
          ...sporsmalsobj,
          checked: value,
        };
      }
      return { ...sporsmalsobj };
    });
    this.props.oppdaterSvar(nySporsmalsobjekterState);
  };

  lagSporsmal = (sporsmalsobj: Spm, erAAP: boolean, innsendingstype: Innsendingstyper | null) => {
    const tekstendelse = hentAapStreng(erAAP);
    let skalVareDisabled: boolean = false;
    for (let key in sporsmalsobj) {
      if (
        sporsmalsobj[key] !== sporsmalsobj.kategori &&
        sporsmalsobj[key] !== sporsmalsobj.feil &&
        sporsmalsobj[key] !== sporsmalsobj.checked &&
        sporsmalsobj[key] !== sporsmalsobj.id
      ) {
        sporsmalsobj[key] = finnesIntlId(sporsmalsobj[key] + tekstendelse);
      } else if (sporsmalsobj[key] === sporsmalsobj.feil) {
        sporsmalsobj.feil.feilmeldingId = finnesIntlId(sporsmalsobj.feil.feilmeldingId);
      } else if (
        sporsmalsobj[key] === 'registrert' &&
        innsendingstype !== Innsendingstyper.innsending
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
    const { innsending, AAP } = this.props;
    const sporsmalsgruppe = innsending.sporsmalsobjekter.map(sporsmalobj =>
      this.lagSporsmal(sporsmalobj, AAP, innsending.innsendingstype)
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

export default connect(
  mapStateToProps,
  mapDispatcherToProps
)(SporsmalsGruppe);
