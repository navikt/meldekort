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

type StegBannerProps = InjectedIntlProps & MapStateToProps;

const StegBanner: React.StatelessComponent<StegBannerProps> = (props) => {

    return (
        <Stegindikator
            steg={[
                {'index': 1, 'label': props.intl.formatMessage({id: 'overskrift.steg1'})},
                {'index': 2, 'label': props.intl.formatMessage({id: 'overskrift.steg2'}), 'aktiv': true},
                {'index': 3, 'label': props.intl.formatMessage({id: 'overskrift.steg3'})},
                {'index': 4, 'label': props.intl.formatMessage({id: 'overskrift.steg4'})}
            ]}
            onChange={() => {
                const newPath = props.router.location.pathname;
                console.log(newPath);
            }}
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

export default injectIntl(connect(mapStateToProps)(StegBanner));
