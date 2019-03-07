import * as React from 'react';
import { Redirect, Route, RouteComponentProps, Switch } from 'react-router-dom';
import Bekreftelse from '../pages/innsending/bekreftelse';
import Kvittering from '../pages/innsending/kvittering';
import Utfylling from '../pages/innsending/utfyllingsside/utfyllingsside';
import Sporsmalsside from '../pages/innsending/sporsmalsside/sporsmalsside';
import StegBanner from '../components/stegBanner/stegBanner';
import PeriodeBanner from '../components/periodeBanner/periodeBanner';

class InnsendingRoutes extends React.Component<RouteComponentProps<{innsendingstype:string}>>{
    constructor(props:RouteComponentProps<{innsendingstype: string}>) {
        super(props);

    }
    // const { match: params } = this.props;
    render() {
        return (
            <div className="sideinnhold">
                <PeriodeBanner/>
                <StegBanner/>
                <Switch>
                    <Route exact={true} path={this.props.match.params + "/:innsendingstype/sporsmal"}
                           render={(props: RouteComponentProps<any>) => (<Sporsmalsside/>)}/>
                    <Route path="/innsending/utfylling" render={(props: RouteComponentProps<any>) => (<Utfylling/>)}/>
                    <Route path="/innsending/bekreftelse" render={(props: RouteComponentProps<any>) => (<Bekreftelse/>)}/>
                    <Route path="/innsending/kvittering" render={(props: RouteComponentProps<any>) => (<Kvittering/>)}/>
                    <Redirect exact={true} from="/:innsendingstype" to="/:innsendingstype/sporsmal"/>
                </Switch>
            </div>
        );
    }
}

export default InnsendingRoutes;
