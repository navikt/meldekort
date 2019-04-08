import * as React from 'react';
import { Sidetittel } from 'nav-frontend-typografi';
import { RootState } from '../../store/configureStore';
import { selectRouter } from '../../selectors/router';
import { connect } from 'react-redux';
import { Router } from '../../types/router';
import MobilMeny from '../mobilMeny/mobilMeny';
import HovedMeny from '../hovedMeny/hovedMeny';

interface MapStateToProps {
    router: Router;
}

export interface BannerProps {
    tittel: string;
}

type HeaderProps = MapStateToProps & BannerProps;

const Header: React.FunctionComponent<HeaderProps> = (props) => {
    const pathListe = props.router.location.pathname.split('/');
    const harPathInnsending = pathListe[pathListe.length - 2] === 'innsending' || pathListe[pathListe.length - 2] === 'korrigering' ;
    const headerClass = harPathInnsending ? 'meldekort-header__innsending' : 'meldekort-header';

    return (
        <header className={headerClass}>
            <div className="banner-container">
                <div className="banner-content">
                    <Sidetittel>{props.tittel}</Sidetittel>
                </div>
            </div>
            {!harPathInnsending ? (
                <>
                    <MobilMeny/>
                    <HovedMeny/>
                </>) : <></>
            }
        </header>
    );
};

const mapStateToProps = (state: RootState): MapStateToProps => {
    return {
        router: selectRouter(state),
    };
};

Header.displayName = 'Header';
export default connect(mapStateToProps)(Header);
