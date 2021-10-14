import * as React from 'react';
import 'nav-frontend-lenker-style';
import { history, RootState } from '../../store/configureStore';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import { selectRouter } from '../../selectors/router';
import { Router } from '../../types/router';
import { Meldekort } from '../../types/meldekort';
import { AktivtMeldekortActions } from '../../actions/aktivtMeldekort';
import Lenke from 'nav-frontend-lenker';
import { downloadMessages } from '../../reducers/localesReducer';
import { updateIntl } from 'react-intl-redux';

interface KomponentlenkeProps {
  lenketekst: string;
  rute: string;
  meldekort?: Meldekort;
}

interface MapStateToProps {
  aktivtMeldekort: Meldekort;
  router: Router;
  locale: string;
}

interface MapDispatcherToProps {
  resettAktivtMeldekort: () => void;
  leggTilAktivtMeldekort: (locale: string, meldekort: Meldekort) => void;
}

type ReduxType = KomponentlenkeProps & MapDispatcherToProps & MapStateToProps;

class Komponentlenke extends React.Component<ReduxType> {
  clickHandler = () => {
    const {
      resettAktivtMeldekort,
      leggTilAktivtMeldekort,
      meldekort,
      locale,
    } = this.props;

    resettAktivtMeldekort();
    if (meldekort) {
      leggTilAktivtMeldekort(locale, meldekort);
    }

    const pathname = this.props.router.location.pathname;
    pathname !== this.props.rute && history.push(this.props.rute);
  };

  render() {
    return (
      <Lenke href={'#'} onClick={this.clickHandler}>
        {this.props.lenketekst}
      </Lenke>
    );
  }
}

const mapStateToProps = (state: RootState): MapStateToProps => {
  let meldekort: Meldekort = {
    ...state.aktivtMeldekort,
  };
  return {
    aktivtMeldekort: meldekort,
    router: selectRouter(state),
    locale: state.intl.locale,
  };
};

const mapDispatcherToProps = (dispatch: Dispatch): MapDispatcherToProps => {
  return {
    leggTilAktivtMeldekort: (locale: string, aktivtMeldekort: Meldekort) => {
      dispatch(AktivtMeldekortActions.oppdaterAktivtMeldekort(aktivtMeldekort));
      downloadMessages(
        locale,
        aktivtMeldekort.meldeperiode.fra.toString().substring(0, 19)
      ).then((messages: object) => {
        dispatch(updateIntl({ locale: locale, messages: messages }));
      });
    },
    resettAktivtMeldekort: () =>
      dispatch(AktivtMeldekortActions.resettAktivtMeldekort()),
  };
};

export default connect(mapStateToProps, mapDispatcherToProps)(Komponentlenke);
