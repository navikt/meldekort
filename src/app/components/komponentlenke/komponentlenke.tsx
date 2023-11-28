import * as React from "react";
import { RootState } from "../../store/configureStore";
import { Dispatch } from "redux";
import { connect } from "react-redux";
import { Meldekort } from "../../types/meldekort";
import { AktivtMeldekortActions } from "../../actions/aktivtMeldekort";
import { useNavigate } from "react-router";
import { useLocation } from "react-router-dom";
import { Link } from "@navikt/ds-react";

interface KomponentlenkeProps {
  lenketekst: string;
  rute: string;
  meldekort?: Meldekort;
}

interface MapStateToProps {
  aktivtMeldekort: Meldekort;
}

interface MapDispatcherToProps {
  resettAktivtMeldekort: () => void;
  leggTilAktivtMeldekort: (meldekort: Meldekort) => void;
}

type Props = KomponentlenkeProps & MapDispatcherToProps & MapStateToProps;

const Komponentlenke: React.FunctionComponent<Props> = props => {
  const location = useLocation();
  const navigate = useNavigate();

  const clickHandler = () => {
    props.resettAktivtMeldekort();
    if (props.meldekort) {
      props.leggTilAktivtMeldekort(props.meldekort);
    }

    location.pathname !== props.rute && navigate(props.rute, { replace: true });
  };

  return (
    <Link href={"#"} onClick={clickHandler}>
      {props.lenketekst}
    </Link>
  );
}

const mapStateToProps = (state: RootState): MapStateToProps => {
  const meldekort: Meldekort = {
    ...state.aktivtMeldekort,
  };
  return {
    aktivtMeldekort: meldekort
  };
};

const mapDispatcherToProps = (dispatch: Dispatch): MapDispatcherToProps => {
  return {
    leggTilAktivtMeldekort: (aktivtMeldekort: Meldekort) =>
      dispatch(AktivtMeldekortActions.oppdaterAktivtMeldekort(aktivtMeldekort)),
    resettAktivtMeldekort: () =>
      dispatch(AktivtMeldekortActions.resettAktivtMeldekort()),
  };
};

export default connect(mapStateToProps, mapDispatcherToProps)(Komponentlenke);
