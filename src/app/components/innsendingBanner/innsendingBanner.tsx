import * as React from 'react';
import Stegindikator from 'nav-frontend-stegindikator/lib/stegindikator';
import { injectIntl, InjectedIntlProps } from 'react-intl';
import { RootState } from '../../store/configureStore';
import { selectRouter } from '../../selectors/router';
import { connect } from 'react-redux';
import { Router } from '../../types/router';

interface MapStateToProps {
    router: Router;
}

type InnsendingBannerProps = InjectedIntlProps & MapStateToProps;

const InnsendingBanner: React.StatelessComponent<InnsendingBannerProps> = (props) => {

    let stegobjekter = [];
    const routes = ['sporsmal', 'utfylling', 'bekreftelse', 'kvittering'];
    const erAktivRoute = (index: number) => (props.router.location.pathname.split('/')[2] === routes[index - 1]);
    const aktivtSteg = routes.findIndex( steg => steg === props.router.location.pathname.split('/')[2]);

    for (let i = 1; i < 5; i++) {
        const stegobj = Object.assign(
            {
                'index': i,
                'label': props.intl.formatMessage({id: 'overskrift.steg' + i}),
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

export default injectIntl(connect(mapStateToProps)(InnsendingBanner));
