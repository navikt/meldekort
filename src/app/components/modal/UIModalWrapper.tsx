import * as React from "react";
import { IModal, ModalKnapp } from "../../types/ui";
import { RootState } from "../../store/configureStore";
import { selectModal } from "../../selectors/ui";
import { Dispatch } from "redux";
import { UiActions } from "../../actions/ui";
import { connect } from "react-redux";
import { Button, Modal } from "@navikt/ds-react";
interface MapStateToProps {
  modal: IModal;
}

interface MapDispatchToProps {
  skjulModal: () => void;
}

type UIModalWrapperProps = MapStateToProps & MapDispatchToProps;

const UIModalWrapper: React.FunctionComponent<UIModalWrapperProps> = ({
  modal,
  skjulModal
}) => {
  return (
    <Modal
      open={modal.visModal}
      onClose={() => {
        modal.onRequestClose ? modal.onRequestClose() : skjulModal();
      }}
      header={{ heading: modal.header() }}
    >
      <Modal.Body>
        {modal.content()}
      </Modal.Body>
      <Modal.Footer>
        {modal.knapper &&
          modal.knapper.map((knapp: ModalKnapp) => {
            return (
              <Button
                key={knapp.label}
                variant={knapp.type}
                onClick={() => knapp.action()}
              >
                {knapp.label}
              </Button>
            );
          })}
      </Modal.Footer>
    </Modal>
  );
};

const mapStateToProps = (state: RootState): MapStateToProps => {
  return {
    modal: selectModal(state),
  };
};

const mapDispatchToProps = (dispatch: Dispatch): MapDispatchToProps => {
  return {
    skjulModal: () => dispatch(UiActions.skjulModal()),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(UIModalWrapper);
