import * as React from 'react';
import { Redirect, Route, RouteComponentProps, Switch, withRouter } from 'react-router-dom';
import Bekreftelse from '../pages/innsending/bekreftelse';
import Kvittering from '../pages/innsending/kvittering';
import Utfylling from '../pages/innsending/utfyllingsside/utfyllingsside';
import Sporsmalsside from '../pages/innsending/sporsmalsside/sporsmalsside';
import StegBanner from '../components/stegBanner/stegBanner';
import PeriodeBanner from '../components/periodeBanner/periodeBanner';
import { RootState } from '../store/configureStore';
import { connect } from 'react-redux';

type PathParams = {
    innsendingstype: string,
}

type PropsType = RouteComponentProps<PathParams>;

class InnsendingRoutes extends React.Component<PropsType>{
    constructor(props: PropsType) {
        super(props);

    }
    // const { match: params } = this.props;
    render() {

        console.log('props.match:', this.props.match);
        return (
            <div className="sideinnhold">
                <PeriodeBanner/>
                <StegBanner/>
                <Switch>
                    <Route exact={true} path={"/innsending/sporsmal"} render={(props) => (<Sporsmalsside/>)}/>
                    <Route path="/innsending/utfylling" render={(props: RouteComponentProps<any>) => (<Utfylling/>)}/>
                    <Route path="/innsending/bekreftelse" render={(props: RouteComponentProps<any>) => (<Bekreftelse/>)}/>
                    <Route path="/innsending/kvittering" render={(props: RouteComponentProps<any>) => (<Kvittering/>)}/>
                    <Redirect exact={true} from={"/send-meldekort/innsending"} to="/send-meldekort/innsending/sporsmal"/>
                </Switch>
            </div>
        );
    }
}

const mapStateToProps = (state: RootState, props: PropsType ): PathParams => {
    const innsendingstype = props.match.params.innsendingstype;
    return { innsendingstype };
}
export default withRouter(connect(mapStateToProps)(InnsendingRoutes));
