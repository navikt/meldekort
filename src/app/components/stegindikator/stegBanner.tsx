import * as React from 'react';
import Stegindikator from 'nav-frontend-stegindikator/lib/stegindikator';
import { RootState } from '../../store/configureStore';
import { selectRouter } from '../../selectors/router';
import { connect } from 'react-redux';
import { Router } from '../../types/router';
import { hentIntl } from '../../utils/intlUtil';

interface MapStateToProps {
    router: Router;
}

type StegBannerProps =  MapStateToProps;

const StegBanner: React.StatelessComponent<StegBannerProps> = (props) => {

    let stegobjekter = [];
    const routes = ['sporsmal', 'utfylling', 'bekreftelse', 'kvittering'];
    const erAktivRoute = (index: number) => (props.router.location.pathname.split('/')[2] === routes[index - 1]);
    const aktivtSteg = routes.findIndex( steg => steg === props.router.location.pathname.split('/')[2]);

    for (let i = 1; i < 5; i++) {
        const stegobj = Object.assign(
            {
                'index': i,
                'label': hentIntl().formatMessage({id: 'overskrift.steg' + i}),
                'disabled': !erAktivRoute(i)
            });
        stegobjekter.push(stegobj);
    }

    return (
        <Stegindikator
            steg={stegobjekter}
            aktivtSteg={aktivtSteg}
            kompakt={true}
            visLabel={true}
            autoResponsiv={true}
        />
    );
};

const mapStateToProps = (state: RootState): MapStateToProps => {
    return {
        router: selectRouter(state),
    };
};

export default connect(mapStateToProps)(StegBanner);
