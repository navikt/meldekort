import * as React from 'react';
import './navtabs.less';

import { connect } from 'react-redux';
import { history, RootState } from '../../store/configureStore';
import { selectRouter } from '../../selectors/router';
import { Router } from '../../types/router';

interface MapStateToProps {
    router: Router;
}

const NavTabs: React.StatelessComponent<MapStateToProps> = ({ router }) => {
    const pathname = router.location.pathname;
    // const navRoute = pathname.split('/')[1];
    console.log(pathname);

    return (
        <nav>
            <button
                onClick={() =>
                pathname !== '/meldekort/send-meldekort/' && history.push('/send-meldekort')}
            >
                Send Meldekort
            </button>
            <button
                onClick={() =>
                pathname !== '/meldekort/tidligere-meldekort/' && history.push('/tidligere-meldekort')}
            >
                Tidligere Meldekort
            </button>
        </nav>
    );
};

const mapStateToProps = (state: RootState): MapStateToProps => {
    return {
        router: selectRouter(state),
    };
};

export default connect(mapStateToProps)(NavTabs);
