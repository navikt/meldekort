import * as React from "react";
import { connect } from "react-redux";
import { RootState } from "../../store/configureStore";
import { Meldekort, Meldekortdetaljer } from "../../types/meldekort";
import { Dispatch } from "redux";
import { InnsendingState, Innsendingstyper } from "../../types/innsending";
import { InnsendingActions } from "../../actions/innsending";
import { AktivtMeldekortActions } from "../../actions/aktivtMeldekort";
import { Sporsmal as Spm } from "../../sider/innsending/1-sporsmalsside/sporsmal/sporsmalConfig";
import { UtfyltDag } from "../../sider/innsending/2-utfyllingsside/utfylling/utfyltDagConfig";
import { settSporsmalOgUtfyllingHvisKorrigering } from "../../utils/korrigeringUtils";
import { formatMessage } from "../../utils/intlUtil";
import { useNavigate } from "react-router";
import { useLocation } from "react-router-dom";
import { Button } from "@navikt/ds-react";

interface MapStateToProps {
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
  HOVED = "primary",
  STANDARD = "secondary",
  FLAT = "tertiary"
}

type Props = MapStateToProps & MapDispatchToProps & NavKnappProps;

const NavKnapp: React.FunctionComponent<Props> = (props) => {
  const navigate = useNavigate();
  const location = useLocation();

  const harNestePathInnsending = (nestePathParams: string[]) => {
    return (
      nestePathParams[nestePathParams.length - 1] ===
        Innsendingstyper.INNSENDING ||
      nestePathParams[nestePathParams.length - 1] ===
        Innsendingstyper.KORRIGERING
    );
  };

  const clickHandler = () => { // (event: React.SyntheticEvent<EventTarget>)
    const {
      nesteAktivtMeldekort,
      innsendingstypeFraStore,
      nesteInnsendingstype,
      nestePath,
      tekstid,
    } = props;

    if (tekstid === "naviger.avbryt") {
      props.resetInnsending();
      navigate(nestePath)
    } else {
      if (
        nesteAktivtMeldekort !== undefined &&
        nesteInnsendingstype !== undefined
      ) {
        props.resettAktivtMeldekort();
        props.leggTilAktivtMeldekort(nesteAktivtMeldekort);
      }

      let validert: boolean = true;
      if (typeof props.validering !== "undefined") {
        validert = props.validering();
      }
      if (validert) {
        const nestePathParams = nestePath.split("/");
        const erPaKvittering = location.pathname.endsWith("kvittering");
        const erPaInnsending = innsendingstypeFraStore !== null;

        if (erPaInnsending && erPaKvittering) {
          props.resetInnsending();
          if (
            harNestePathInnsending(nestePathParams) &&
            nesteInnsendingstype !== undefined &&
            typeof nesteAktivtMeldekort !== "undefined"
          ) {
            props.leggTilMeldekortId(nesteAktivtMeldekort.meldekortId);
          }
        }
        if (
          harNestePathInnsending(nestePathParams) &&
          nesteInnsendingstype !== undefined
        ) {
          if (nesteInnsendingstype === Innsendingstyper.KORRIGERING) {
            const konverterteSporsmalOgDager = settSporsmalOgUtfyllingHvisKorrigering(
              props.meldekortdetaljer,
              props.innsending
            );
            props.oppdaterUtfylteDager(
              konverterteSporsmalOgDager.utfylteDager
            );
            props.oppdaterSporsmalsobjekter(
              konverterteSporsmalOgDager.sporsmalsobjekter
            );
          }
          props.settInnsendingstype(nesteInnsendingstype);
        }

        navigate(nestePath, { replace: true })
      }
    }
  };

    return (
      <Button
        variant={props.type}
        onClick={clickHandler}
        className={props.className}
        loading={
          typeof props.spinner === "undefined" ? false : props.spinner
        }
        disabled={
          typeof props.disabled === "undefined"
            ? false
            : props.disabled
        }
      >
        {formatMessage(props.tekstid)}
      </Button>
    );
}

const mapStateToProps = (state: RootState): MapStateToProps => {
  return {
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
