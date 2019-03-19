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
import { Meldekort, Meldekortdetaljer } from '../../types/meldekort';
import MeldekortRoutes from '../meldekortRoutes';
import { Router } from '../../types/router';
import meldekortdetaljer from '../../components/meldekortdetaljer/meldekortdetaljer';

interface MapStateToProps {
    innsending: InnsendingState;
    meldekortDetaljer: Meldekortdetaljer;
    aktivtMeldekort: Meldekort;
    router: Router;
}

interface MapDispatchToProps {
    oppdaterSvar: (sporsmalsobjekt: Sporsmal[]) => void;
    settMeldekortId: (meldekortId: number) => void;
    hentKorrigertId: () => void;
    settInnsendingstype: (innsendingstype: Innsendingstyper) => void;
}

type InnsendingRoutesProps = RouteComponentProps & MapStateToProps & MapDispatchToProps;

class InnsendingRoutes extends React.Component<InnsendingRoutesProps>{
    constructor(props: InnsendingRoutesProps) {
        super(props);
    }

    settMeldekortIdBasertPaInnsendingstype = () => {
        if (this.props.innsending.innsendingstype === Innsendingstyper.korrigering) {
            this.props.hentKorrigertId();
        } else {
            this.props.settMeldekortId(this.props.aktivtMeldekort.meldekortId);
        }
    }

    componentDidMount() {
        this.settMeldekortIdBasertPaInnsendingstype()
    }

    render() {
        const { match, router } = this.props;
        console.log('route: ', router.location.pathname );

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
        aktivtMeldekort: state.aktivtMeldekort.meldekort,
        meldekortDetaljer: state.meldekortdetaljer.meldekortdetaljer,
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
            dispatch(InnsendingActions.hentKorrigertId.request()),
        settInnsendingstype: (innsendingstype: Innsendingstyper) =>
                dispatch(InnsendingActions.leggTilInnsendingstype(innsendingstype)),
    }
}

export default connect(mapStateToProps, mapDispatcherToProps)(InnsendingRoutes);
