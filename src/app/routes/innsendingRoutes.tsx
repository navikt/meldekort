import * as React from 'react';
import { Redirect, Route, RouteComponentProps, Switch } from 'react-router-dom';
import Bekreftelse from '../pages/innsending/bekreftelse';
import Kvittering from '../pages/innsending/kvittering';
import Utfylling from '../pages/innsending/utfyllingsside/utfyllingsside';
import Sporsmalsside from '../pages/innsending/sporsmalsside/sporsmalsside';
import StegBanner from '../components/stegBanner/stegBanner';
import PeriodeBanner from '../components/periodeBanner/periodeBanner';
import { Innsendingstyper } from '../types/innsending';

interface InnsendingRoutesProps {
    innsendingstype: Innsendingstyper;
}

type PropsType = RouteComponentProps & InnsendingRoutesProps;

class InnsendingRoutes extends React.Component<PropsType>{
    constructor(props: PropsType) {
        super(props);

    }
    render() {

        const { match } = this.props;
        console.log('props.match:', match);
        return (
            <div className="sideinnhold">
                <PeriodeBanner/>
                <StegBanner/>
                <Switch>
                    <Route exact={true} path={`${match.url}`+"/sporsmal"} render={(props) => (<Sporsmalsside {...props}/>)}/>
                    <Route path={`${match.url}`+"/utfylling"} render={(props: RouteComponentProps<any>) => (<Utfylling {...props}/>)}/>
                    <Route path={`${match.url}`+"/bekreftelse"} render={(props: RouteComponentProps<any>) => (<Bekreftelse {...props}/>)}/>
                    <Route path={`${match.url}`+"/kvittering"} render={(props: RouteComponentProps<any>) => (<Kvittering {...props}/>)}/>
                    <Redirect exact={true} from={`${match.url}`} to={`${match.url}`+"/sporsmal"}/>
                </Switch>
            </div>
        );
    }
}

export default (InnsendingRoutes);
