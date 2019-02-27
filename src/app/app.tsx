import * as React from 'react';
import { Route, Switch } from 'react-router';
import { ConnectedRouter } from 'connected-react-router';
import { history, RootState } from './store/configureStore';
import Banner from './components/banner/banner';
import MeldekortRoutes from './routes/meldekortRoutes';
import NavTabs from './components/meny/tabsmeny';
import setupMock from './mock/setup-mock';
import { erMock } from './mock/utils';
import { PersonStatusState } from './reducers/personStatusReducer';
import { Dispatch } from 'redux';
import { PersonStatusActions } from './actions/personStatus';
import { connect } from 'react-redux';
import Feilside from './components/feilside/feilside';

if (erMock()) {
    setupMock();
}

interface MapStateToProps {
    personStatus: PersonStatusState;
}

interface MapDispatchToProps {
    hentPersonStatus: () => void;
}

type Props = MapDispatchToProps&MapStateToProps;

class App extends React.Component<Props> {
    constructor(props: any) {
        super(props);

        this.props.hentPersonStatus();
    }

    erBrukerRegistrertIArena = (): boolean => {
        let arbeidssokerStatus = this.props.personStatus.personStatus.statusArbeidsoker;
        return !(arbeidssokerStatus === null || arbeidssokerStatus === '');
    }

    setInnhold = () => {
        if (this.props.personStatus.personStatus.id === '') { // TODO: Denne testen burde kanskje endres. Må se an hvordan vi gjør det med feilhåndtering.
            return null;
        }  else if (this.erBrukerRegistrertIArena()) {
            return (
                <div>
                <NavTabs/>
                <div className="main-container">
                    <ConnectedRouter history={history}>
                        <Switch>
                            <Route path="/" component={MeldekortRoutes}/>
                        </Switch>
                    </ConnectedRouter>
                </div>
                </div>
            );
        } else {
             return (
                 <div className="main-container">
                    <Feilside/>
                 </div>
             );
        }
    }

    public render() {

        return(
            <div>
                <Banner tittel="Meldekort"/>
                {this.setInnhold()}
            </div>
        );
    }
}

const mapStateToProps = (personStatus: RootState): MapStateToProps => {
    return {
        personStatus: personStatus.personStatus,
    };
};

const mapDispatchToProps = (dispatch: Dispatch): MapDispatchToProps => {
    return {
        hentPersonStatus: () => dispatch(PersonStatusActions.hentPersonStatus.request()),
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(App);