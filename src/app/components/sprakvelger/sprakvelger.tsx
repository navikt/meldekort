import * as React from 'react';
import { Dispatch } from 'redux';
import { RootState } from '../../store/configureStore';
import { Select } from 'nav-frontend-skjema';
import { IntlAction, updateIntl } from 'react-intl-redux';
import { connect } from 'react-redux';
import EngelskFlaggSVG from './EngelskFlaggSVG';
import NorskFlaggSVG from './NorskFlaggSVG';

const mapStateToProps = ({ intl, locales }: RootState) => {
  return {
    locale: intl.locale,
    messages: intl.messages,
    locs: locales
  };
};

const mapDispatchToProps = (dispatch: Dispatch<IntlAction>) => {
  return {
    updateIntl: (locale: any, messages: any) =>
      dispatch(updateIntl({ locale, messages }))
  };
};

type ReduxType = ReturnType<typeof mapStateToProps> &
  ReturnType<typeof mapDispatchToProps>;

/*const renderMenuItem = (code: ) => {
  return (
    <li key={code}>
      <MenuItem className="languageToggle__menu__item">
        <div className="languageToggle__button__flag">
          {code === 'en' ? <UKFlagSVG /> : <NorwayFlagSVG />}
        </div>
        <div id={`languageCode_${code}`} className="languageToggle__button__language">
          {getLanguageTextFromCode(code, intl)}
        </div>
      </MenuItem>
    </li>
  );
};*/

const Sprakvelger: React.FunctionComponent<ReduxType> = (props) => {

  const handleOnChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    props.updateIntl(
      event.target.value,
      props.locs[event.target.value].tekster
    );
  };

  const { locale, locs } = props;
  const locsArray = [locs.nb, locs.en];

  return (
    <div className="sprakvelger-container">
      <Select label="" value={locale} onChange={handleOnChange}>
        {locsArray.map(loc => {
          return (
            <option key={loc.label} value={loc.label}>
              {loc.tittel}
            </option>
          );
        })}
      </Select>
    </div>
  );
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Sprakvelger);
