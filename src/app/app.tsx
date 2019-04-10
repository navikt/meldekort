import * as React from 'react';
import { Route, Switch } from 'react-router';
import { ConnectedRouter } from 'connected-react-router';
import { history, RootState } from './store/configureStore';
import Header from './components/header/header';
import MeldekortRoutes from './sider/meldekortRoutes';
import NavTabs from './components/meny/tabsmeny';
import setupMock from './mock/setup-mock';
import { Dispatch } from 'redux';
import { erMock } from './mock/utils';
import { isEmpty } from 'ramda';
import { MeldeForm, Person } from './types/person';
import { PersonStatusActions } from './actions/personStatus';
import { PersonStatusState } from './reducers/personStatusReducer';
import { connect } from 'react-redux';
import Feilside from './components/feilside/feilside';
import UIModalWrapper from './components/modal/UIModalWrapper';
import { BaksystemFeilmelding } from './types/ui';
import { selectFeilmelding } from './selectors/ui';
import UIAlertstripeWrapper from './components/feil/UIAlertstripeWrapper';
import menyConfig from './utils/menyConfig';

if (erMock()) {
    setupMock();
}

interface MapStateToProps {
    personStatus: PersonStatusState;
    baksystemFeilmelding: BaksystemFeilmelding;
    person: Person;
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

    settMenyPunkter = (person: Person) => {
        const tabsobjekter = menyConfig;
        const filtrertetabsobjekter = tabsobjekter.map(tabsobj => {
            if ((person.meldeform === MeldeForm.PAPIR) && (tabsobj.tittel === 'endreMeldeform')) {
                return { ...tabsobj, disabled: !tabsobj.disabled };
            } else if (!isEmpty(person.etterregistrerteMeldekort) && tabsobj.tittel === 'etterregistrering') {
                return { ...tabsobj, disabled: !tabsobj.disabled };
            } else {
                return { ...tabsobj };
            }
        });
        return (
            <>
                <Header tittel="Meldekort" menypunkter={filtrertetabsobjekter.filter(obj => !obj.disabled)}/>
                <NavTabs tabsobjekter={filtrertetabsobjekter.filter(obj => !obj.disabled)}/>
            </>
        );
    }

    settInnhold = () => {
        if (this.props.personStatus.personStatus.id === '') { // TODO: Denne testen burde kanskje endres. Må se an hvordan vi gjør det med feilhåndtering.
            return (
                <div className="main-container">
                {this.props.baksystemFeilmelding.visFeilmelding ?
                    <UIAlertstripeWrapper/> : <Feilside/>
                }
                </div>
            );
        }  else if (this.erBrukerRegistrertIArena()) {
            return (
                <div>
                    {this.settMenyPunkter(this.props.person)}
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

    componentDidMount() {
        this.props.hentPersonStatus();
    }

/*    componentWillUnmount() {

    }*/

    public render() {

        return(
            <div>
                <UIModalWrapper/>
                {this.settInnhold()}
            </div>
        );
    }
}

const mapStateToProps = (state: RootState): MapStateToProps => {
    return {
        personStatus: state.personStatus,
        person: state.person,
        baksystemFeilmelding: selectFeilmelding(state)
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