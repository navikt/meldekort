import * as React from 'react';
import 'nav-frontend-lenker-style';
import { history, RootState } from '../../store/configureStore';
import { oppdaterAktivtMeldekort } from '../../actions/aktivtMeldekort';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import { AktivtMeldekortState } from '../../reducers/aktivtMeldekortReducer';
import { selectRouter } from '../../selectors/router';
import { Router } from '../../types/router';
import { Meldekort } from '../../types/meldekort';
import { HoyreChevron } from 'nav-frontend-chevron';

interface KomponentlenkeProps {
    lenketekst: string;
    rute: string;
    meldekort?: Meldekort;
}

interface MapStateToProps {
    aktivtMeldekort: AktivtMeldekortState;
    router: Router;
}

interface MapDispatcherToProps {
    leggTilAktivtMeldekort: (meldekort: Meldekort) => void;
}

type ReduxType =
    KomponentlenkeProps & MapDispatcherToProps & MapStateToProps;

class Komponentlenke extends React.Component<ReduxType> {

    constructor(props: any) {
        super(props);
    }

    clickHandler = () => {
        if (this.props.meldekort) {
            this.props.leggTilAktivtMeldekort(this.props.meldekort);
        }

        const pathname = this.props.router.location.pathname;
        pathname !== this.props.rute && history.push(this.props.rute);
    }

    render() {
        return (
            <div>
                <a className="lenke" href="#" onClick={this.clickHandler}> <span>{this.props.lenketekst}<HoyreChevron/></span> </a>
            </div>
        );
    }
}

const mapStateToProps = (state: RootState): MapStateToProps => {
        let meldekort: AktivtMeldekortState = {
            meldekort: state.aktivtMeldekort.meldekort
        };
        return {
            aktivtMeldekort: meldekort,
            router: selectRouter(state)
        };
};

const mapDispatcherToProps = (dispatch: Dispatch): MapDispatcherToProps => {
    return {
        leggTilAktivtMeldekort: (aktivtMeldekort: Meldekort) =>
            dispatch(oppdaterAktivtMeldekort(aktivtMeldekort))
    };
};

export default connect(mapStateToProps, mapDispatcherToProps)(Komponentlenke);
