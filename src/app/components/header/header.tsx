import * as React from 'react';
import HovedMeny from '../hovedMeny/hovedMeny';
import MobilMeny from '../mobilMeny/mobilMeny';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { MeldeForm, Person } from '../../types/person';
import { MenyActions } from '../../actions/meny';
import { MenyPunkt } from '../../utils/menyConfig';
import { MenyState } from '../../types/meny';
import { RootState } from '../../store/configureStore';
import { Router } from '../../types/router';
import { selectRouter } from '../../selectors/router';
import { Sidetittel } from 'nav-frontend-typografi';
import MobilMenyToggle from '../mobilMeny/mobilMenyToggle';
import { useEffect, useState } from 'react';

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
    const [oppdaterMeny, settMeny] = useState(meny.alleMenyPunkter);

    const oppdatertMeny = meny.alleMenyPunkter.map(menypunkt => {
        if (menypunkt.tittel === 'endreMeldeform' && person.meldeform === MeldeForm.ELEKTRONISK) {
            return {...menypunkt, disabled: true};
        } else if (menypunkt.tittel === 'etterregistrering' && person.etterregistrerteMeldekort.length === 0) {
            return {...menypunkt, disabled: true};
        }
        return menypunkt;
    });

    useEffect(() => {
            props.settMenyPunkter(oppdatertMeny);
        },
              [oppdaterMeny]
    );

    const params = router.location.pathname.split('/');
    const harPathInnsending = params[params.length - 2] === 'innsending' || params[params.length - 2] === 'korrigering' ;
    const headerClass = harPathInnsending ? 'meldekort-header__innsending' : 'meldekort-header';

    return (
        <header className={headerClass}>
            <div className="banner-container">
                <div className="banner-content">
                    <div className={'banner-title'}>
                        <Sidetittel>{props.tittel}</Sidetittel>
                    </div>
                    <MobilMenyToggle/>
                </div>
                {!harPathInnsending ? (
                    <MobilMeny menypunkter={meny.alleMenyPunkter.filter( menypunkt => !menypunkt.disabled)}/>
                ) : <></>
                }
            </div>
            {!harPathInnsending ? (
                <HovedMeny menypunkter={meny.alleMenyPunkter.filter( menypunkt => !menypunkt.disabled)}/>
                ) : <></>
            }
        </header>
    );
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
