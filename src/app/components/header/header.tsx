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
import { Router } from '../../types/router';
import { selectRouter } from '../../selectors/router';
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
  isOldSafari,
} from '../../utils/browsers';
import GammelNettleserMelding from '../gammelNetteleserMelding/gammelNettleserMelding';

interface MapStateToProps {
  router: Router;
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

class Header extends React.Component<HeaderProps> {
  componentDidUpdate(
    prevProps: Readonly<MapStateToProps & MapDispatchToProps & BannerProps>
  ): void {
    const { person } = this.props;
    if (
      person.etterregistrerteMeldekort !==
      prevProps.person.etterregistrerteMeldekort
    ) {
      this.oppdatertMeny();
    }
  }

  oppdatertMeny = () => {
    const { meny, person } = this.props;
    const oppdatertMeny = meny.alleMenyPunkter.map(menypunkt => {
      if (menypunkt.tittel === 'etterregistrering') {
        return {
          ...menypunkt,
          disabled: isEmpty(person.etterregistrerteMeldekort),
        };
      }
      return menypunkt;
    });
    this.props.settMenyPunkter(oppdatertMeny);
  };

  hentMenypunkter = () => {
    return this.props.meny.alleMenyPunkter.filter(
      menypunkt => !menypunkt.disabled
    );
  };

  render() {
    const { router, tittel } = this.props;
    const params = router.location.pathname.split('/');
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
              <MobilMeny menypunkter={this.hentMenypunkter()} />
            ) : (
              <></>
            )}
          </div>
          {!harPathInnsending ? (
            <HovedMeny menypunkter={this.hentMenypunkter()} />
          ) : (
            <></>
          )}
        </header>
        <GammelNettleserMelding />
      </>
    );
  }
}

const mapStateToProps = (state: RootState): MapStateToProps => {
  return {
    router: selectRouter(state),
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

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Header);
