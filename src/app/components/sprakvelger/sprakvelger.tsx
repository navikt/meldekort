import * as React from 'react';
import { Dispatch } from 'redux';
import { RootState } from '../../store/configureStore';
import { Button, Menu, MenuItem, Wrapper } from 'react-aria-menubutton';

import { IntlAction, updateIntl } from 'react-intl-redux';
import { connect } from 'react-redux';
import NedChevron from 'nav-frontend-chevron/lib/ned-chevron';
import { Locale, downloadMessages } from '../../reducers/localesReducer';
import { Konstanter } from '../../utils/consts';

const mapStateToProps = ({ intl, locales, aktivtMeldekort }: RootState) => {
  return {
    currentLocale: intl.locale,
    messages: intl.messages,
    locales: locales,
    aktivtMeldekort: aktivtMeldekort,
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

const renderMenuItem = (locale: Locale, valgtSprak: string) => {
  const erSprakObjValgtSprakObj = locale.label === valgtSprak;

  return (
    !erSprakObjValgtSprakObj && (
      <li key={`language_list_item_${locale.label}`} value={locale.label}>
        <MenuItem className="languageToggle__menu__item">
          <div className="languageToggle__button__flag">{locale.ikon}</div>
          <div
            key={locale.label}
            id={`languagesprakobj_${locale.label}`}
            className="languageToggle__button__language"
          >
            {locale.tittel}
          </div>
        </MenuItem>
      </li>
    )
  );
};

const Sprakvelger: React.FunctionComponent<MergedProps> = props => {
  const { currentLocale, locales, aktivtMeldekort } = props;

  const handleSelection = (value: JSX.Element[]) => {
    const newLocale: string = value[1].key
      ? value[1].key.toString()
      : Konstanter.defaultLocale;
    downloadMessages(
      newLocale,
      aktivtMeldekort
        ? aktivtMeldekort.meldeperiode.fra.toString()
        : Konstanter.defaultFromDate
    ).then((messages: object) => {
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
            {
              locales.find((locale: Locale) => locale.label === currentLocale)
                ?.ikon
            }
          </div>
          <div className="languageToggle__button__language">
            {
              locales.find((locale: Locale) => locale.label === currentLocale)
                ?.tittel
            }
          </div>
          <div>
            <NedChevron />
          </div>
        </Button>
        <Menu className="languageToggle__menu">
          <ul>
            {locales.map((locale: Locale) =>
              renderMenuItem(locale, currentLocale)
            )}
          </ul>
        </Menu>
      </Wrapper>
    </div>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(Sprakvelger);
