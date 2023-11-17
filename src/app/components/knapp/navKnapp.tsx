import * as React from 'react';
import KnappBase from 'nav-frontend-knapper';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import { history, RootState } from '../../store/configureStore';
import { Router } from '../../types/router';
import { selectRouter } from '../../selectors/router';
import { Meldekort, Meldekortdetaljer } from '../../types/meldekort';
import { Dispatch } from 'redux';
import { InnsendingState, Innsendingstyper } from '../../types/innsending';
import { InnsendingActions } from '../../actions/innsending';
import { AktivtMeldekortActions } from '../../actions/aktivtMeldekort';
import { Sporsmal as Spm } from '../../sider/innsending/1-sporsmalsside/sporsmal/sporsmalConfig';
import { UtfyltDag } from '../../sider/innsending/2-utfyllingsside/utfylling/utfyltDagConfig';
import { settSporsmalOgUtfyllingHvisKorrigering } from '../../utils/korrigeringUtils';

interface MapStateToProps {
  router: Router;
  innsendingstypeFraStore: Innsendingstyper | null;
  aktivtMeldekort: Meldekort;
  innsending: InnsendingState;
  meldekortdetaljer: Meldekortdetaljer;
}

interface MapDispatchToProps {
  leggTilAktivtMeldekort: (meldekort: Meldekort) => void;
  leggTilMeldekortId: (meldekortId: number) => void;
  oppdaterSporsmalsobjekter: (sporsmalsobjekter: Spm[]) => void;
  oppdaterUtfylteDager: (utfylteDager: UtfyltDag[]) => void;
  resetInnsending: () => void;
  resettAktivtMeldekort: () => void;
  settInnsendingstype: (innsendingstype: Innsendingstyper) => void;
}

interface NavKnappProps {
  type: KnappTyper;
  nestePath: string;
  tekstid: string;
  className?: string;
  nesteAktivtMeldekort?: Meldekort;
  nesteInnsendingstype?: Innsendingstyper;
  validering?: () => boolean;
  disabled?: boolean;
  spinner?: boolean;
}

export enum KnappTyper {
  HOVED = 'hoved',
  STANDARD = 'standard',
  FLAT = 'flat',
}

type Props = MapStateToProps & MapDispatchToProps & NavKnappProps;

class NavKnapp extends React.Component<Props, object> {
  harNestePathInnsending = (nestePathParams: string[]) => {
    return (
      nestePathParams[nestePathParams.length - 1] ===
        Innsendingstyper.INNSENDING ||
      nestePathParams[nestePathParams.length - 1] ===
        Innsendingstyper.KORRIGERING
    );
  };

  returnerNestePathInnenforInnsending = (
    params: string[],
    nestePathParams: string[]
  ) => {
    const editedParams = params;
    editedParams.pop();
    editedParams.push(nestePathParams[nestePathParams.length - 1]);
    return editedParams.join('/');
  };

  clickHandler = () => { // (event: React.SyntheticEvent<EventTarget>)
    const {
      nesteAktivtMeldekort,
      innsendingstypeFraStore,
      nesteInnsendingstype,
      nestePath,
      router,
      tekstid,
    } = this.props;

    if (tekstid === 'naviger.avbryt') {
      this.props.resetInnsending();
      history.push(nestePath);
    } else {
      if (
        nesteAktivtMeldekort !== undefined &&
        nesteInnsendingstype !== undefined
      ) {
        this.props.resettAktivtMeldekort();
        this.props.leggTilAktivtMeldekort(nesteAktivtMeldekort);
      }

      let validert: boolean = true;
      if (typeof this.props.validering !== 'undefined') {
        validert = this.props.validering();
      }
      if (validert) {
        const path = router.location.pathname;
        const params = path.split('/');
        const nestePathParams = nestePath.split('/');
        const erPaKvittering = params[params.length - 1] === 'kvittering';
        const erPaInnsending = innsendingstypeFraStore !== null;
        let nyPath: string = '';

        if (erPaInnsending) {
          if (!erPaKvittering) {
            nyPath = this.returnerNestePathInnenforInnsending(
              params,
              nestePathParams
            );
          } else {
            this.props.resetInnsending();
            nyPath = nestePath;
            if (
              this.harNestePathInnsending(nestePathParams) &&
              nesteInnsendingstype !== undefined &&
              typeof nesteAktivtMeldekort !== 'undefined'
            ) {
              this.props.leggTilMeldekortId(nesteAktivtMeldekort.meldekortId);
            }
          }
        }
        if (
          this.harNestePathInnsending(nestePathParams) &&
          nesteInnsendingstype !== undefined
        ) {
          if (nesteInnsendingstype === Innsendingstyper.KORRIGERING) {
            const konverterteSporsmalOgDager = settSporsmalOgUtfyllingHvisKorrigering(
              this.props.meldekortdetaljer,
              this.props.innsending
            );
            this.props.oppdaterUtfylteDager(
              konverterteSporsmalOgDager.utfylteDager
            );
            this.props.oppdaterSporsmalsobjekter(
              konverterteSporsmalOgDager.sporsmalsobjekter
            );
          }
          this.props.settInnsendingstype(nesteInnsendingstype);
        }
        if (!erPaInnsending) {
          nyPath = nestePath;
        }
        history.push(nyPath);
      }
    }
  };

  render() {
    return (
      <KnappBase
        type={this.props.type}
        onClick={this.clickHandler}
        className={this.props.className}
        spinner={
          typeof this.props.spinner === 'undefined' ? false : this.props.spinner
        }
        disabled={
          typeof this.props.disabled === 'undefined'
            ? false
            : this.props.disabled
        }
      >
        <FormattedMessage id={this.props.tekstid} />
      </KnappBase>
    );
  }
}

const mapStateToProps = (state: RootState): MapStateToProps => {
  return {
    router: selectRouter(state),
    innsendingstypeFraStore: state.innsending.innsendingstype,
    aktivtMeldekort: state.aktivtMeldekort,
    innsending: state.innsending,
    meldekortdetaljer: state.meldekortdetaljer.meldekortdetaljer,
  };
};

const mapDispatchToProps = (dispatch: Dispatch): MapDispatchToProps => {
  return {
    leggTilAktivtMeldekort: (aktivtMeldekort: Meldekort) =>
      dispatch(AktivtMeldekortActions.oppdaterAktivtMeldekort(aktivtMeldekort)),
    resettAktivtMeldekort: () =>
      dispatch(AktivtMeldekortActions.resettAktivtMeldekort()),
    settInnsendingstype: (innsendingstype: Innsendingstyper) =>
      dispatch(InnsendingActions.leggTilInnsendingstype(innsendingstype)),
    resetInnsending: () => dispatch(InnsendingActions.resetInnsending()),
    leggTilMeldekortId: (meldekortId: number) =>
      dispatch(InnsendingActions.leggTilMeldekortId(meldekortId)),
    oppdaterSporsmalsobjekter: (sporsmalsobjekter: Spm[]) =>
      dispatch(InnsendingActions.oppdaterSpm(sporsmalsobjekter)),
    oppdaterUtfylteDager: (utfylteDager: UtfyltDag[]) =>
      dispatch(InnsendingActions.oppdaterUtfylteDager(utfylteDager)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(NavKnapp);
