import * as React from 'react';
import { Route, Switch } from 'react-router';
import { ConnectedRouter } from 'connected-react-router';
import { history, RootState } from './store/configureStore';
import MeldekortBanner from './components/meldekortBanner/meldekortBanner';
import MeldekortRoutes from './routes/meldekortRoutes';
import NavTabs from './components/meny/tabsmeny';
import setupMock from './mock/setup-mock';
import { erMock } from './mock/utils';
import { PersonStatusState } from './reducers/personStatusReducer';
import { Dispatch } from 'redux';
import { PersonStatusActions } from './actions/personStatus';
import { connect } from 'react-redux';
import Feilside from './components/feilside/feilside';
import { hentTabConfig, Tab } from './components/meny/tabConfig';
import { MeldeForm, Person } from './types/person';
import EtterregistrerMeldekort from './pages/etterregistrerMeldekort/etterregistrerMeldekort';
import { isEmpty } from 'ramda';
import { Meldekort } from './types/meldekort';


if (erMock()) {
    setupMock();
}

interface MapStateToProps {
    personStatus: PersonStatusState;
    person: Person;
}

interface MapDispatchToProps {
    hentPersonStatus: () => void;
}

type Props = MapDispatchToProps&MapStateToProps;

class App extends React.Component<Props> {
    constructor(props: any) {
        super(props);
    }

    erBrukerRegistrertIArena = (): boolean => {
        let arbeidssokerStatus = this.props.personStatus.personStatus.statusArbeidsoker;
        return !(arbeidssokerStatus === null || arbeidssokerStatus === '');
    }

    settMenyPunkter = (person: Person) => {
        const tabsobjekter = hentTabConfig();
        const filtrertetabsobjekter = tabsobjekter.map(tabsobj => {
            if ((person.meldeform === MeldeForm.PAPIR) && (tabsobj.tittel === "endreMeldeform")) {
                return {
                    ...tabsobj, disabled: !tabsobj.disabled
                }
            } else if (!isEmpty(person.etterregistrerteMeldekort) && tabsobj.tittel === "etterregistrering") {
                return {
                    ...tabsobj, disabled: !tabsobj.disabled
                }
            } else { return { ...tabsobj }}
        });
        return (
            <NavTabs tabsobjekter={filtrertetabsobjekter.filter(obj => !obj.disabled)}/>
        )
    }

    setInnhold = () => {
        if (this.props.personStatus.personStatus.id === '') { // TODO: Denne testen burde kanskje endres. Må se an hvordan vi gjør det med feilhåndtering.
            return null;
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

    public render() {

        return(
            <div>
                <MeldekortBanner tittel="Meldekort"/>
                {this.setInnhold()}
            </div>
        );
    }
}

const mapStateToProps = (state: RootState): MapStateToProps => {
    return {
        personStatus: state.personStatus,
        person: state.person.person,
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