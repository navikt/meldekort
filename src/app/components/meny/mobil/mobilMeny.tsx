import * as React from 'react';
import { MenyPunkt } from '../../../utils/menyConfig';
import { history, RootState } from '../../../store/configureStore';
import { selectRouter } from '../../../selectors/router';
import { connect } from 'react-redux';
import { Router } from '../../../types/router';
import { hentIntl } from '../../../utils/intlUtil';
import { MenyActions } from '../../../actions/meny';
import { Dispatch } from 'redux';
import classNames from 'classnames';
import { Collapse } from 'react-collapse';
import Lenke from 'nav-frontend-lenker';

interface MobilMenyProps {
  menypunkter: MenyPunkt[];
}

interface MapStateToProps {
  router: Router;
  erApen: boolean;
  valgtMenyPunkt: MenyPunkt;
}

interface MapDispatchToProps {
  settValgtMenyPunkt: (menypunkt: MenyPunkt) => void;
  toggleMeny: (erApen: boolean) => void;
}

const MobilMeny: React.FunctionComponent<MobilMenyProps & MapStateToProps & MapDispatchToProps> = (
  props
) => {
  const { settValgtMenyPunkt, toggleMeny, valgtMenyPunkt, menypunkter, erApen } = props;

  const onChange = (item: MenyPunkt) => {
    settValgtMenyPunkt(item);
    history.push(item.urlparam);
  };

  return (
    <nav className={classNames('mobilMeny')}>
      <Collapse isOpened={props.erApen}>
        <ul className={classNames('mobilMeny-navlist', { open: erApen })}>
          {menypunkter.map((menypunkt) => (
            <li
              className={'navlist-item'}
              onClick={() => onChange(menypunkt)}
              key={menypunkt.tittel}
              aria-labelledby={'navlink'}
            >
              <Lenke
                className={classNames('item-wrapper', {
                  active: valgtMenyPunkt.tittel === menypunkt.tittel,
                })}
                href={'#'}
              >
                {hentIntl().formatMessage({ id: menypunkt.tekstid })}
              </Lenke>
            </li>
          ))}
        </ul>
      </Collapse>
      <div className={classNames('overlay', { on: erApen })} onClick={() => toggleMeny(false)} />
    </nav>
  );
};

const mapStateToProps = (state: RootState): MapStateToProps => {
  return {
    router: selectRouter(state),
    erApen: state.meny.erApen,
    valgtMenyPunkt: state.meny.valgtMenyPunkt,
  };
};

const mapDispatchToProps = (dispatch: Dispatch): MapDispatchToProps => {
  return {
    settValgtMenyPunkt: (menypunkt: MenyPunkt) =>
      dispatch(MenyActions.settValgtMenyPunkt(menypunkt)),
    toggleMeny: (erApen: boolean) => dispatch(MenyActions.toggleMeny(erApen)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MobilMeny);
