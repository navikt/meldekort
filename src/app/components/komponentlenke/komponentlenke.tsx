import * as React from 'react';
import 'nav-frontend-lenker-style';
import { history, RootState } from '../../store/configureStore';
import { oppdaterAktivtMeldekort } from '../../actions/aktivtMeldekort';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import { AktivtMeldekortState } from '../../reducers/aktivtMeldekortReducer';
import { selectRouter } from '../../selectors/router';
import { Router } from '../../types/router';
import { hentTabConfig, Tab } from '../meny/tabConfig';

interface KomponentlenkeProps {
    lenketekst: string;
    rute: string;
    meldekortId?: number;
}

interface MapStateToProps {
    aktivtMeldekort: AktivtMeldekortState;
    router: Router;
}

interface MapDispatcherToProps {
    leggTilAktivtMeldekort: (meldekortId: number) => void;
}

interface TabsState {
    tabsobjekter: Tab[];
    // windowSize: number;
}

type ReduxType =
    KomponentlenkeProps & MapDispatcherToProps & MapStateToProps;

class Komponentlenke extends React.Component<ReduxType, TabsState> {

    constructor(props: any) {
        super(props);
        this.state = {
            tabsobjekter: hentTabConfig().filter(obj => ! obj.disabled)
        };
    }

    clickHandler = () => {
        console.log('Click fired!');
        console.log(this.props);

        if (this.props.meldekortId) {
            console.log('Legger til aktivtMeldekort');
            this.props.leggTilAktivtMeldekort(this.props.meldekortId);
        }

        const pathname = this.props.router.location.pathname;
        console.log(pathname);
        pathname !== this.props.rute && history.push(this.props.rute);
    }

    render() {
        return (
            <div>
                <a className="lenke" onClick={this.clickHandler}> <span>{this.props.lenketekst}</span> </a>
            </div>
        );
    }
}

const mapStateToProps = (state: RootState): MapStateToProps => {
        let meldekort: AktivtMeldekortState = {
            meldekortId: state.aktivtMeldekort.meldekortId
        };
        return {
            aktivtMeldekort: meldekort,
            router: selectRouter(state)
        };
};

const mapDispatcherToProps = (dispatch: Dispatch): MapDispatcherToProps => {
    return {
        leggTilAktivtMeldekort: (meldekortId: number) =>
            dispatch(oppdaterAktivtMeldekort(meldekortId))
    };
};

export default connect(mapStateToProps, mapDispatcherToProps)(Komponentlenke);
