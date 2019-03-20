import * as React from 'react';
import { Redirect, Route, RouteComponentProps, Switch } from 'react-router-dom';
import Bekreftelse from './bekreftelse';
import Kvittering from './kvitteringsside/kvittering';
import Utfylling from './utfyllingsside/utfyllingsside';
import Sporsmalsside from './sporsmalsside/sporsmalsside';
import StegBanner from '../../components/stegBanner/stegBanner';
import PeriodeBanner from '../../components/periodeBanner/periodeBanner';
import { InnsendingState, Innsendingstyper } from '../../types/innsending';
import { RootState } from '../../store/configureStore';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { InnsendingActions } from '../../actions/innsending';
import { Sporsmal } from './sporsmalsside/sporsmal/sporsmalConfig';
import { Meldekort } from '../../types/meldekort';
import { Router } from '../../types/router';

interface MapStateToProps {
    innsending: InnsendingState;
    aktivtMeldekort: Meldekort;
    router: Router;
}

interface MapDispatchToProps {
    oppdaterSvar: (sporsmalsobjekt: Sporsmal[]) => void;
    settMeldekortId: (meldekortId: number) => void;
    hentKorrigertId: () => void;
}

type InnsendingRoutesProps = RouteComponentProps & MapStateToProps & MapDispatchToProps;

class InnsendingRoutes extends React.Component<InnsendingRoutesProps>{
    constructor(props: InnsendingRoutesProps) {
        super(props);
    }

    settMeldekortIdBasertPaInnsendingstype = () => {
        const { hentKorrigertId, innsending, settMeldekortId, aktivtMeldekort } = this.props;
        (innsending.innsendingstype === Innsendingstyper.korrigering) ?
            hentKorrigertId() : settMeldekortId(aktivtMeldekort.meldekortId);
    };

    componentDidMount() {
        this.settMeldekortIdBasertPaInnsendingstype()
    }

    render() {
        const { pathname } = this.props.router.location;
        const { match } = this.props;
        return (
            <div className="sideinnhold">
                <PeriodeBanner/>
                <StegBanner/>
                <Switch>
                    <Route exact={true} path={pathname +"/sporsmal"} render={(props) => (<Sporsmalsside {...props}/>)}/>
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
        aktivtMeldekort: state.aktivtMeldekort.meldekort,
        router: state.router
    }
}

const mapDispatcherToProps = (dispatch: Dispatch): MapDispatchToProps => {
    return {
        oppdaterSvar: (sporsmalsobjekter: Sporsmal[]) =>
            dispatch(InnsendingActions.oppdaterSpm(sporsmalsobjekter)),
        settMeldekortId: (meldekortId: number) =>
            dispatch(InnsendingActions.leggTilMeldekortId(meldekortId)),
        hentKorrigertId: () =>
            dispatch(InnsendingActions.hentKorrigertId.request())
    }
}

export default connect(mapStateToProps, mapDispatcherToProps)(InnsendingRoutes);
