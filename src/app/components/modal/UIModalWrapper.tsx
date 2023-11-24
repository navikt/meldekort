import * as React from 'react';
import { IModal, ModalKnapp } from '../../types/ui';
import { RootState } from '../../store/configureStore';
import { selectModal } from '../../selectors/ui';
import { Dispatch } from 'redux';
import { UiActions } from '../../actions/ui';
import { connect } from 'react-redux';
import KnappBase from 'nav-frontend-knapper';
import Modal from 'nav-frontend-modal';

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
  Modal.setAppElement('#meldekort__root');
  return (
    <Modal
      className={'uimodal'}
      isOpen={modal.visModal}
      onRequestClose={() => {
        modal.onRequestClose ? modal.onRequestClose() : skjulModal();
      }}
      contentLabel={'ui-modal'}
      closeButton={true}
    >
      <div className={'uimodal__content'}>{modal.content()}</div>
      <div className={'uimodal__actions-knapp'}>
        {modal.knapper &&
          modal.knapper.map((knapp: ModalKnapp) => {
            return (
              <KnappBase
                key={knapp.label}
                className={'uimodal__actions-knapp'}
                type={knapp.type}
                onClick={() => knapp.action()}
              >
                {knapp.label}
              </KnappBase>
            );
          })}
      </div>
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
