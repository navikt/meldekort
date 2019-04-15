import * as React from 'react';
import HovedMeny from '../hovedMeny/hovedMeny';
import MobilMeny from '../mobilMeny/mobilMeny';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { isEmpty } from 'ramda';
import { MeldeForm, Person } from '../../types/person';
import { MenyActions } from '../../actions/meny';
import { MenyPunkt } from '../../utils/menyConfig';
import { MenyState } from '../../types/meny';
import { RootState } from '../../store/configureStore';
import { Router } from '../../types/router';
import { selectRouter } from '../../selectors/router';
import { Sidetittel } from 'nav-frontend-typografi';
import MobilMenyToggle from '../mobilMeny/mobilMenyToggle';
import { useState } from 'react';

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

const Header: React.FunctionComponent<HeaderProps> = (props) => {

    const {router, meny, person} = props;
    const params = router.location.pathname.split('/');
    const harPathInnsending = params[params.length - 2] === 'innsending' || params[params.length - 2] === 'korrigering' ;
    const headerClass = harPathInnsending ? 'meldekort-header__innsending' : 'meldekort-header';
    const filtrerteMenyPunkter = settMenyPunkterBasertPaMeldeformOgEtterregistrering(person, meny.alleMenyPunkter)
        .filter((menypunkt: MenyPunkt) => {return !menypunkt.disabled; });

    return (
        <header className={headerClass}>
            <div className="banner-container">
                <div className="banner-content">
                    <Sidetittel>{props.tittel}</Sidetittel>
                </div>
            </div>
            {!harPathInnsending ? (
                <>
                    <MobilMenyToggle />
                    <MobilMeny menypunkter={filtrerteMenyPunkter}/>
                    <HovedMeny menypunkter={filtrerteMenyPunkter}/>
                </>) : <></>
            }
        </header>
    );
};

const settMenyPunkterBasertPaMeldeformOgEtterregistrering = (person: Person, menypunkter: MenyPunkt[]) => {
    const personHarPapirMeldeform = (mp: MenyPunkt) => (person.meldeform === MeldeForm.PAPIR) && (mp.tittel === 'endreMeldeform');
    const personHarEtterregistrerteMeldekort = (mp: MenyPunkt) =>  !isEmpty(person.etterregistrerteMeldekort) && mp.tittel === 'etterregistrering';
    const menypunktliste = menypunkter
        .map(menypunkt => {
            if (personHarPapirMeldeform(menypunkt) || personHarEtterregistrerteMeldekort(menypunkt)) {
                return { ...menypunkt, disabled: !menypunkt.disabled };
            } else {
                return { ...menypunkt };
            }
        });
    return menypunktliste;
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
