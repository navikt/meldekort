import * as React from 'react';
import { Route, Switch } from 'react-router';
import { ConnectedRouter } from 'connected-react-router';
import { history, RootState } from './store/configureStore';
import Header from './components/header/header';
import MeldekortRoutes from './sider/meldekortRoutes';
import setupMock from './mock/setup-mock';
import { Dispatch } from 'redux';
import { erMock } from './mock/utils';
import { MeldeForm, Person } from './types/person';
import { PersonStatusActions } from './actions/personStatus';
import { PersonStatusState } from './reducers/personStatusReducer';
import { connect } from 'react-redux';
import Feilside from './components/feilside/feilside';
import UIModalWrapper from './components/modal/UIModalWrapper';
import { BaksystemFeilmelding } from './types/ui';
import { selectFeilmelding } from './selectors/ui';
import UIAlertstripeWrapper from './components/feil/UIAlertstripeWrapper';
import { MenyState } from './types/meny';
import { MenyPunkt } from './utils/menyConfig';
import { MenyActions } from './actions/meny';
import { Router } from './types/router';
import { selectRouter } from './selectors/router';
import { isEmpty } from 'ramda';
import { hentIntl } from './utils/intlUtil';
import classNames from 'classnames';
import { PersonActions } from './actions/person';
import { erBrukerRegistrertIArena } from './utils/meldekortUtils';

if (erMock()) {
    setupMock();
}

interface MapStateToProps {
    router: Router;
    personStatus: PersonStatusState;
    baksystemFeilmelding: BaksystemFeilmelding;
    person: Person;
    meny: MenyState;
}

interface MapDispatchToProps {
    hentPerson: () => void;
    hentPersonStatus: () => void;
    settValgtMenyPunkt: (menypunkt: MenyPunkt) => void;
    settMenyPunkter: ( menypunkter: MenyPunkt[]) => void;
    toggleMeny: (erApen: boolean) => void;

}

type Props = MapDispatchToProps&MapStateToProps;

class App extends React.Component<Props> {
    constructor(props: any) {
        super(props);

        this.props.hentPersonStatus();
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
        }  else if (erBrukerRegistrertIArena(this.props.personStatus.personStatus.statusArbeidsoker)) {
            if (this.props.person.personId === 0) {
                this.props.hentPerson();
            }
            return (
                <div>
                    <Header tittel={hentIntl().formatMessage({id: 'overskrift.meldekort'})}/>
                    <div
                        className={classNames({overlay: this.props.meny.erApen})}
                        onClick={() => this.props.meny.erApen && this.props.toggleMeny(!this.props.meny.erApen)}
                    >
                        <div className={'main-container'}>
                            <ConnectedRouter history={history}>
                                <Switch>
                                    <Route path="/" component={MeldekortRoutes}/>
                                </Switch>
                            </ConnectedRouter>
                        </div>
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

    settAktivMenuPunktBasertPaUrl = (meny: MenyState, url: string): void => {
        const urlparam = '/' + url.split('/')[1];
        for (let i = 0; i < meny.alleMenyPunkter.length; i++) {
            if (meny.alleMenyPunkter[i].urlparam === urlparam) {
                const menypunkt = meny.alleMenyPunkter[i];
            }
        }
    }

    /*settMenypunkterBasertPaPerson = (person: Person, menypunkter: MenyPunkt[]) => {
        const menypunktliste = menypunkter.map(menypunkt => {
            if (menypunkt.tittel === 'endreMeldeform') {
                return {...menypunkt, disabled: person.meldeform !== MeldeForm.PAPIR};
            } else if (menypunkt.tittel === 'etterregistrering') {
                return {...menypunkt, disabled: isEmpty(person.etterregistrerteMeldekort)};
            }
            return menypunkt;
        });

        this.props.settMenyPunkter(menypunktliste);
    }*/

    componentDidMount() {
        const { hentPersonStatus, hentPerson, person, meny, router  } = this.props;
        hentPersonStatus();
        this.settAktivMenuPunktBasertPaUrl(meny, router.location.pathname);
        // this.settMenypunkterBasertPaPerson(person, meny.alleMenyPunkter);
    }

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
        router: selectRouter(state),
        personStatus: state.personStatus,
        person: state.person,
        baksystemFeilmelding: selectFeilmelding(state),
        meny: state.meny

    };
};

const mapDispatchToProps = (dispatch: Dispatch): MapDispatchToProps => {
    return {
        hentPerson: () => dispatch(PersonActions.hentPerson.request()),
        hentPersonStatus: () => dispatch(PersonStatusActions.hentPersonStatus.request()),
        settValgtMenyPunkt: (menypunkt: MenyPunkt) => dispatch(MenyActions.settValgtMenyPunkt(menypunkt)),
        settMenyPunkter: (menypunkter: MenyPunkt[]) => dispatch(MenyActions.settAktiveMenyPunkter(menypunkter)),
        toggleMeny: (erApen: boolean) => dispatch(MenyActions.toggleMeny(erApen)),
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(App);