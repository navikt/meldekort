import * as React from 'react';
import { Sidetittel } from 'nav-frontend-typografi';
import { RootState } from '../../store/configureStore';
import { selectRouter } from '../../selectors/router';
import { connect } from 'react-redux';
import { Router } from '../../types/router';
import MobilMeny from '../mobilMeny/mobilMeny';
import HovedMeny from '../hovedMeny/hovedMeny';
import { MenyState } from '../../types/meny';
import { MeldeForm, Person } from '../../types/person';
import { isEmpty } from 'ramda';
import { MenyPunkt } from '../../utils/menyConfig';
import { MenyActions } from '../../actions/meny';
import { Dispatch } from 'redux';

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

type HeaderProps = MapStateToProps & BannerProps;

const Header: React.FunctionComponent<HeaderProps> = (props) => {
    const {router, meny, person} = props;
    const pathListe = router.location.pathname.split('/');
    const harPathInnsending = pathListe[pathListe.length - 2] === 'innsending' || pathListe[pathListe.length - 2] === 'korrigering' ;
    const headerClass = harPathInnsending ? 'meldekort-header__innsending' : 'meldekort-header';
    const kunAktiveMenyPunkter = settMenyPunkter(person, meny.alleMenyPunkter).filter((menypunkt: MenyPunkt) => {return !menypunkt.disabled; });

    return (
        <header className={headerClass}>
            <div className="banner-container">
                <div className="banner-content">
                    <Sidetittel>{props.tittel}</Sidetittel>
                </div>
            </div>
            {!harPathInnsending ? (
                <>
                    <MobilMeny tabsobjekter={kunAktiveMenyPunkter}/>
                    <HovedMeny menypunkter={kunAktiveMenyPunkter}/>
                </>) : <></>
            }
        </header>
    );
};

const settMenyPunkter = (person: Person, menypunkter: MenyPunkt[]) => {
    const filtrertetabsobjekter = menypunkter
        .filter(tab => !tab.disabled)
        .map(tabsobj => {
            if ((person.meldeform === MeldeForm.PAPIR) && (tabsobj.tittel === 'endreMeldeform')) {
                return { ...tabsobj, disabled: !tabsobj.disabled };
            } else if (!isEmpty(person.etterregistrerteMeldekort) && tabsobj.tittel === 'etterregistrering') {
                return { ...tabsobj, disabled: !tabsobj.disabled };
            } else {
                return { ...tabsobj };
            }
        });
    return filtrertetabsobjekter;
};

const mapStateToProps = (state: RootState): MapStateToProps => {
    return {
        router: selectRouter(state),
        meny: state.meny,
        person: state.person
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

Header.displayName = 'Header';
export default connect(mapStateToProps, mapDispatchToProps)(Header);
