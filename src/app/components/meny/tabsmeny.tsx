import * as React from 'react';
import Tabs from 'nav-frontend-tabs';

import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import { history, RootState, store } from '../../store/configureStore';
import { Router } from '../../types/router';
import { selectRouter } from '../../selectors/router';
import { Tab, hentTabConfig } from './tabConfig';

interface MapStateToProps {
    router: Router;
}

interface TabsState {
    tabsobjekter: Tab[];
    windowSize: number;
}

type TabsProps = MapStateToProps;

class Tabsmeny extends React.Component<TabsProps, TabsState> {
    constructor (props: TabsProps) {
        super(props);
        this.state = {
            tabsobjekter: hentTabConfig().filter(obj => !obj.disabled),
            windowSize: window.innerWidth
        };
    }

    lagTabs = (tabsobjekter: Tab[], aktivTab: string, kompakt: boolean) => {
        const tablabels = tabsobjekter.map(obj => this.lagTab(obj));
        console.log(tablabels);
        const aktivTabIndex = tabsobjekter.findIndex( obj => obj.urlparam === aktivTab);

        return (
            <Tabs
                onChange={this.handleOnChange}
                defaultAktiv={aktivTabIndex}
                tabs={tablabels}
                kompakt={kompakt}
            />
        );
    }

    lagTab = (obj: Tab) => {
        const formattedTabLabel = <FormattedMessage id={obj.tittel}/>;
        return({'label': formattedTabLabel});
    }

    handleOnChange = ( event: React.SyntheticEvent<EventTarget>, index: number ) => {
        const pathname = this.props.router.location.pathname;
        console.log(store.getState());
        pathname !== this.state.tabsobjekter[index].urlparam && history.push(this.state.tabsobjekter[index].urlparam);
    }

    handleWindowSize = () => {
        this.setState({
            windowSize: window.innerWidth
        });
    }

    componentDidMount() {
        window.addEventListener('resize', this.handleWindowSize);
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.handleWindowSize);
    }

    render() {
        const {windowSize} = this.state;
        const erDesktop = windowSize > 767;

        const trengerKompakt = erDesktop ? false : true;

        const path = this.props.router.location.pathname.slice(1, 11);
        const sjekkOmPathHarInnsending = path !== 'innsending';

        return(
            ( sjekkOmPathHarInnsending ? (
                <>
                    <nav className="tabsmeny">
                        {this.lagTabs(this.state.tabsobjekter, this.props.router.location.pathname, trengerKompakt)}
                    </nav>
                </>) : <></>
            )
        );
    }
}

const mapStateToProps = (state: RootState): MapStateToProps => {
    return {
        router: selectRouter(state),
    };
};

export default connect(mapStateToProps)(Tabsmeny);
