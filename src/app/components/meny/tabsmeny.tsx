import * as React from 'react';
import Tabs from 'nav-frontend-tabs';

import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import { history, RootState } from '../../store/configureStore';
import { Router } from '../../types/router';
import { selectRouter } from '../../selectors/router';
import { Tab } from './tabConfig';

interface MapStateToProps {
    router: Router;
}

interface Props {
    tabsobjekter: Tab[];
}

interface TabsState {
    windowSize: number;
}

type TabsProps = MapStateToProps & Props;

class Tabsmeny extends React.Component<TabsProps, TabsState> {
    constructor (props: TabsProps) {
        super(props);
        this.state = {
            windowSize: window.innerWidth
        };
    }

    lagTabs = (tabsobjekter: Tab[], aktivTab: string, mobilSkjerm: boolean) => {
        const tablabels = tabsobjekter.map(obj => this.lagTab(obj));
        const aktivTabIndex = tabsobjekter.findIndex( obj => obj.urlparam === aktivTab);

        // TODO: sett tabs ut ifra mobilSkjerm: Hvis den er true, så hvis mobilMeny. Ellers Tabs
        return (
            <Tabs
                onChange={this.handleOnChange}
                defaultAktiv={aktivTabIndex}
                tabs={tablabels}
                kompakt={true}
            />
        );
    }

    lagTab = (obj: Tab) => {
        const formattedTabLabel = <FormattedMessage id={obj.tekstid}/>;
        return({'label': formattedTabLabel});
    }

    handleOnChange = ( event: React.SyntheticEvent<EventTarget>, index: number ) => {
        const pathname = this.props.router.location.pathname;
        pathname !== this.props.tabsobjekter[index].urlparam && history.push(this.props.tabsobjekter[index].urlparam);
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

        const erMobilSkjerm = erDesktop ? false : true;

        const pathListe = this.props.router.location.pathname.split('/');
        const returnerFalseOmPathHarInnsending = pathListe[pathListe.length - 2] !== 'innsending';

        return(
            ( returnerFalseOmPathHarInnsending ? (
                <>
                    <nav className="tabsmeny">
                        {this.lagTabs(this.props.tabsobjekter, this.props.router.location.pathname, erMobilSkjerm)}
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
