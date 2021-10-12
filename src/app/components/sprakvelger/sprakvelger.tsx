import * as React from 'react';
import { Dispatch } from 'redux';
import { RootState } from '../../store/configureStore';
import { Button, Menu, MenuItem, Wrapper } from 'react-aria-menubutton';

import { IntlAction, updateIntl } from 'react-intl-redux';
import { connect } from 'react-redux';
import NedChevron from 'nav-frontend-chevron/lib/ned-chevron';
import { messagesLoader, SprakObj } from '../../reducers/localesReducer';
import { Konstanter } from '../../utils/consts';

const mapStateToProps = ({ intl, locales }: RootState) => {
  return {
    locale: intl.locale,
    messages: intl.messages,
    locs: locales,
  };
};

const mapDispatchToProps = (dispatch: Dispatch<IntlAction>) => {
  return {
    updateIntl: (locale: any, messages: any) =>
      dispatch(updateIntl({ locale, messages })),
  };
};

type MergedProps = ReturnType<typeof mapStateToProps> &
  ReturnType<typeof mapDispatchToProps>;

const renderMenuItem = (sprakobj: SprakObj, valgtSprak: string) => {
  const erSprakObjValgtSprakObj = sprakobj.label === valgtSprak;
  return (
    !erSprakObjValgtSprakObj && (
      <li key={`language_list_item_${sprakobj.label}`} value={sprakobj.label}>
        <MenuItem className="languageToggle__menu__item">
          <div className="languageToggle__button__flag">{sprakobj.ikon}</div>
          <div
            key={sprakobj.label}
            id={`languagesprakobj_${sprakobj.label}`}
            className="languageToggle__button__language"
          >
            {sprakobj.tittel}
          </div>
        </MenuItem>
      </li>
    )
  );
};

const Sprakvelger: React.FunctionComponent<MergedProps> = props => {
  const { locale, locs } = props;

  const handleSelection = (value: JSX.Element[]) => {
    const newLocale: string = value[1].key
      ? value[1].key.toString()
      : Konstanter().defaultLocale;
    messagesLoader[newLocale]().then((messages: object) => {
      props.updateIntl(newLocale, messages);
    });
  };

  return (
    <div className="languageToggle">
      <Wrapper
        className="languageToggle__wrapper"
        onSelection={(value: JSX.Element[]) => handleSelection(value)}
      >
        <Button className="languageToggle__button">
          <div className="languageToggle__button__flag">
            {locs[locale].ikon}
          </div>
          <div className="languageToggle__button__language">
            {locs[locale].tittel}
          </div>
          <div>
            <NedChevron />
          </div>
        </Button>
        <Menu className="languageToggle__menu">
          <ul>
            {Object.keys(locs).map(sprakObj =>
              renderMenuItem(locs[sprakObj], locale)
            )}
          </ul>
        </Menu>
      </Wrapper>
    </div>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(Sprakvelger);
