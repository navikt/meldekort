import * as React from 'react';
import { Dispatch } from 'redux';
import { RootState } from '../../store/configureStore';
import { Wrapper, Button, Menu, MenuItem } from 'react-aria-menubutton';

import { IntlAction, updateIntl } from 'react-intl-redux';
import { connect } from 'react-redux';
import EngelskFlaggSVG from './EngelskFlaggSVG';
import NorskFlaggSVG from './NorskFlaggSVG';
import NedChevron from 'nav-frontend-chevron/lib/ned-chevron';
import { SprakObj } from '../../reducers/localesReducer';

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

type MergedProps = ReturnType<typeof mapStateToProps> &
  ReturnType<typeof mapDispatchToProps>;

const renderMenuItem = (sprakobj: SprakObj) => {
  return (
    <li key={sprakobj.label} value={sprakobj.label}>
      <MenuItem className="languageToggle__menu__item">
        <div className="languageToggle__button__flag">
          {sprakobj.label === 'nb' ? <NorskFlaggSVG/> : <EngelskFlaggSVG />}
        </div>
        <div id={`languagesprakobj_${sprakobj}`} className="languageToggle__button__language">
          {sprakobj.tittel}
        </div>
      </MenuItem>
    </li>
  );
};

const Sprakvelger: React.FunctionComponent<MergedProps> = (props) => {
  const { locale, locs, updateIntl} = props;
  const sprakArray = [locs.nb, locs.en];

  const handleSelection = (value: JSX.Element[]) => {
    const erNorskValgtSprak = (value[1].props.children === 'Norsk');
    const sprak: string = (erNorskValgtSprak) ? locs.nb.label : locs.en.label;
    const tekster: {} = (erNorskValgtSprak) ? locs.nb.tekster : locs.en.tekster;
    updateIntl(sprak, tekster);
  };

  return (
    <div className="languageToggle">
      <Wrapper
        className="languageToggle__wrapper"
        onSelection={(value: JSX.Element[]) =>
          handleSelection(value)
        }
      >
        <Button className="languageToggle__button">
          <div className="languageToggle__button__flag">
            {locale === 'nb' ? <NorskFlaggSVG/> : <EngelskFlaggSVG />}
          </div>
          <div className="languageToggle__button__language">
            {locale === 'nb' ? locs.nb.tittel : locs.en.tittel}
          </div>
          <div>
            <NedChevron />
          </div>
        </Button>
        <Menu className="languageToggle__menu">
          <ul>{sprakArray.map((sprakObj) => renderMenuItem(sprakObj))}</ul>
        </Menu>
      </Wrapper>
    </div>
  );
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Sprakvelger);
