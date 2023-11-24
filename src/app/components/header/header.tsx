import * as React from 'react';
import HovedMeny from '../meny/desktop/hovedmeny';
import MobilMeny from '../meny/mobil/mobilMeny';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { Person } from '../../types/person';
import { MenyActions } from '../../actions/meny';
import { MenyPunkt } from '../../utils/menyConfig';
import { MenyState } from '../../types/meny';
import { RootState } from '../../store/configureStore';
import { Sidetittel } from 'nav-frontend-typografi';
import MobilMenyToggle from '../meny/mobil/mobilmenyToggle';
import { isEmpty } from 'ramda';
import classNames from 'classnames';
import {
  isIE,
  isOldChrome,
  isOldEdge,
  isOldFirefox,
  isOldIE,
  isOldSafari
} from '../../utils/browsers';
import GammelNettleserMelding from '../gammelNetteleserMelding/gammelNettleserMelding';
import { useLocation } from "react-router-dom";
import { useEffect, useRef } from "react";

interface MapStateToProps {
  meny: MenyState;
  person: Person;
}

interface MapDispatchToProps {
  settValgtMenyPunkt: (menypunkt: MenyPunkt) => void;
  settMenyPunkter: (menypunkter: MenyPunkt[]) => void;
}

interface BannerProps {
  tittel: string;
}

type HeaderProps = MapStateToProps & MapDispatchToProps & BannerProps;

const usePrevious = <T extends object>(value: T): T | undefined => {
  const ref = useRef<T>();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
};

const Header: React.FunctionComponent<HeaderProps> = (props) => {
  const {person, meny } = props
  const prevProps = usePrevious({person, meny});

  useEffect(() => {
    if (person.etterregistrerteMeldekort !== prevProps?.person.etterregistrerteMeldekort) {
      oppdatertMeny();
    }
  })

  const oppdatertMeny = () => {
    const { meny, person } = props;
    const oppdatertMeny = meny.alleMenyPunkter.map(menypunkt => {
      if (menypunkt.tittel === 'etterregistrering') {
        return {
          ...menypunkt,
          disabled: isEmpty(person.etterregistrerteMeldekort),
        };
      }
      return menypunkt;
    });
    props.settMenyPunkter(oppdatertMeny);
  };

  const hentMenypunkter = () => {
    return props.meny.alleMenyPunkter.filter(
      menypunkt => !menypunkt.disabled
    );
  };

  const { tittel } = props;
  const location = useLocation();
  const params = location.pathname.split('/');
  const harPathInnsending =
    params[params.length - 2] === 'innsending' ||
    params[params.length - 2] === 'korriger';
  const headerClass = harPathInnsending
    ? 'meldekortHeader meldekortHeader__innsending'
    : 'meldekortHeader';
  const browserSpecificStyling = classNames(headerClass, {
    partialGridSupportedStyling: isIE || isOldEdge,
    oldBrowserStyling: isOldSafari || isOldChrome || isOldIE || isOldFirefox,
  });
  return (
    <>
      <header className={browserSpecificStyling}>
        <div className="banner__container">
          <div className="banner__content">
            <div className={'banner__title'}>
              <Sidetittel>{tittel}</Sidetittel>
            </div>
            <MobilMenyToggle />
          </div>
          {!harPathInnsending ? (
            <MobilMeny menypunkter={hentMenypunkter()} />
          ) : (
            <></>
          )}
        </div>
        {!harPathInnsending ? (
          <HovedMeny menypunkter={hentMenypunkter()} />
        ) : (
          <></>
        )}
      </header>
      <GammelNettleserMelding />
    </>
  );
}

const mapStateToProps = (state: RootState): MapStateToProps => {
  return {
    meny: state.meny,
    person: state.person,
  };
};

const mapDispatchToProps = (dispatch: Dispatch): MapDispatchToProps => {
  return {
    settValgtMenyPunkt: (menypunkt: MenyPunkt) =>
      dispatch(MenyActions.settValgtMenyPunkt(menypunkt)),
    settMenyPunkter: (menypunkter: MenyPunkt[]) =>
      dispatch(MenyActions.settAktiveMenyPunkter(menypunkter)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Header);
