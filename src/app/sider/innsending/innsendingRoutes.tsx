import * as React from 'react';
import { Redirect, Route, RouteComponentProps, Switch } from 'react-router-dom';
import Bekreftelse from './bekreftelse';
import Kvittering from './kvittering';
import Utfylling from './utfyllingsside/utfyllingsside';
import Sporsmalsside from './sporsmalsside/sporsmalsside';
import StegBanner from '../../components/stegBanner/stegBanner';
import PeriodeBanner from '../../components/periodeBanner/periodeBanner';
import { InnsendingState, Innsendingstyper } from '../../types/innsending';
import { RootState } from '../../store/configureStore';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { oppdaterSpm } from '../../actions/innsending';
import { Sporsmal } from './sporsmalsside/sporsmal/sporsmalConfig';

interface MapStateToProps {
    innsending: InnsendingState;
}

interface MapDispatchToProps {
    oppdaterSvar: (sporsmalsobjekt: Sporsmal[]) => void;
}

type InnsendingRoutesProps = RouteComponentProps & MapStateToProps & MapDispatchToProps;

class InnsendingRoutes extends React.Component<InnsendingRoutesProps>{
    constructor(props: InnsendingRoutesProps) {
        super(props);
    }

    settInnsendingsobjekt = () => {
        const { innsendingstype } = this.props.innsending;
        if (innsendingstype === Innsendingstyper.innsending) {

        } else if (innsendingstype === Innsendingstyper.korrigering) {

        } else {
            console.log('Ikke innsending eller korrigering');
        }
    }

    componentDidMount() {
        this.settInnsendingsobjekt();
    }

    render() {
        const { match } = this.props;
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

const mapStateToProps = (state: RootState) : MapStateToProps => {
    return {
        innsending: state.innsending,
    }
}

const mapDispatcherToProps = (dispatch: Dispatch): MapDispatchToProps =>{
    return {
        oppdaterSvar: (sporsmalsobjekter: Sporsmal[]) =>
            dispatch(oppdaterSpm(sporsmalsobjekter))
    };
}

export default connect(mapStateToProps, mapDispatcherToProps)(InnsendingRoutes);
