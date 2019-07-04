import * as React from 'react';
import { RootState } from '../../../store/configureStore';
import { Dispatch } from 'redux';
import { MenyActions } from '../../../actions/meny';
import { connect } from 'react-redux';
import classNames from 'classnames';

interface MapDispatchToProps {
  toggleMeny: (erApen: boolean) => void;
}

interface MapStateToProps {
  erApen: boolean;
}

const MobilMenyToggle: React.FunctionComponent<MapDispatchToProps & MapStateToProps> = props => {
  return (
    <div className={'burger-menu-toggle'} onClick={() => props.toggleMeny(!props.erApen)}>
      <div className={classNames('nav-icon', { open: props.erApen })}>
        <span />
        <span />
        <span />
        <span />
      </div>
    </div>
  );
};

const mapStateToProps = (state: RootState): MapStateToProps => {
  return {
    erApen: state.meny.erApen,
  };
};

const mapDispatchToProps = (dispatch: Dispatch): MapDispatchToProps => {
  return {
    toggleMeny: (erApen: boolean) => dispatch(MenyActions.toggleMeny(erApen)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MobilMenyToggle);
