import * as React from "react";
import { BaksystemFeilmelding } from "../../types/ui";
import { RootState } from "../../store/configureStore";
import { selectFeilmelding } from "../../selectors/ui";
import { Dispatch } from "redux";
import { UiActions } from "../../actions/ui";
import { connect } from "react-redux";
import { Alert } from "@navikt/ds-react";

interface MapStateToProps {
  baksystemFeilmelding: BaksystemFeilmelding;
}

interface MapDispatchToProps {
  skjulFeilmelding: () => void;
}

type UIAlertstripeWrapperProps = MapStateToProps & MapDispatchToProps;

const UIAlertstripeWrapper: React.FunctionComponent<UIAlertstripeWrapperProps> = ({ baksystemFeilmelding}) => { // { baksystemFeilmelding, skjulFeilmelding }
  return (
    <div className={"alertstripe_wrapper"}>
      {baksystemFeilmelding.visFeilmelding ? (
        <Alert variant="error">
          <div>{baksystemFeilmelding.content()}</div>
        </Alert>
      ) : null}
    </div>
  );
};

const mapStateToProps = (state: RootState): MapStateToProps => {
  return {
    baksystemFeilmelding: selectFeilmelding(state),
  };
};

const mapDispatchToProps = (dispatch: Dispatch): MapDispatchToProps => {
  return {
    skjulFeilmelding: () => dispatch(UiActions.skjulBaksystemFeilmelding()),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(UIAlertstripeWrapper);
