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

interface KomponentlenkeProps {
  lenketekst: string;
  rute: string;
  meldekort?: Meldekort;
}

interface MapStateToProps {
  aktivtMeldekort: Meldekort;
  router: Router;
}

interface MapDispatcherToProps {
  resettAktivtMeldekort: () => void;
  leggTilAktivtMeldekort: (meldekort: Meldekort) => void;
}

type ReduxType = KomponentlenkeProps & MapDispatcherToProps & MapStateToProps;

class Komponentlenke extends React.Component<ReduxType> {
  clickHandler = () => {
    this.props.resettAktivtMeldekort();
    if (this.props.meldekort) {
      this.props.leggTilAktivtMeldekort(this.props.meldekort);
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
  };
};

const mapDispatcherToProps = (dispatch: Dispatch): MapDispatcherToProps => {
  return {
    leggTilAktivtMeldekort: (aktivtMeldekort: Meldekort) =>
      dispatch(AktivtMeldekortActions.oppdaterAktivtMeldekort(aktivtMeldekort)),
    resettAktivtMeldekort: () =>
      dispatch(AktivtMeldekortActions.resettAktivtMeldekort()),
  };
};

export default connect(
  mapStateToProps,
  mapDispatcherToProps
)(Komponentlenke);
