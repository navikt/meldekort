import * as React from 'react';
import Bekreftelse from './bekreftelsesside/bekreftelse';
import Kvittering from './kvitteringsside/kvittering';
import PeriodeBanner from '../../components/periodeBanner/periodeBanner';
import Sporsmalsside from './sporsmalsside/sporsmalsside';
import StegBanner from '../../components/stegBanner/stegBanner';
import Utfylling from './utfyllingsside/utfyllingsside';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { InnsendingActions } from '../../actions/innsending';
import { InnsendingState, Innsendingstyper } from '../../types/innsending';
import { Meldekort, Meldekortdetaljer, Sporsmal } from '../../types/meldekort';
import { Redirect, Route, RouteComponentProps, Switch } from 'react-router-dom';
import { RootState } from '../../store/configureStore';
import { Sporsmal as Spm } from './sporsmalsside/sporsmal/sporsmalConfig';
import { MeldekortdetaljerActions } from '../../actions/meldekortdetaljer';

interface MapStateToProps {
    innsending: InnsendingState;
    aktivtMeldekort: Meldekort;
    meldekortdetaljer: Meldekortdetaljer;
}

interface MapDispatchToProps {
    hentKorrigertId: () => void;
    hentMeldekortdetaljer: () => void;
    oppdaterSporsmalsobjekter: (sporsmalsobjekter: Spm[]) => void;
    resetSporsmalOgUtfylling: () => void;
    settMeldekortId: (meldekortId: number) => void;
}

type InnsendingRoutesProps = RouteComponentProps & MapStateToProps & MapDispatchToProps;

class InnsendingRoutes extends React.Component<InnsendingRoutesProps> {
    constructor(props: InnsendingRoutesProps) {
        super(props);
    }

    settMeldekortIdBasertPaInnsendingstype = () => {
        const { hentKorrigertId, innsending, settMeldekortId, aktivtMeldekort } = this.props;
        (innsending.innsendingstype === Innsendingstyper.korrigering) ?
            hentKorrigertId() : settMeldekortId(aktivtMeldekort.meldekortId);
    }

    resetSporsmalsHvisIkkeKorrigering = () => {
        const { innsending, oppdaterSporsmalsobjekter, resetSporsmalOgUtfylling } = this.props;
        const erIkkeUndefined = innsending.sporsmalsobjekter! && this.props.meldekortdetaljer.sporsmal!;
        if (innsending.innsendingstype === Innsendingstyper.korrigering  && erIkkeUndefined) {
            const konverterteSporsmalsobjekter = this.konverterMeldekortdetaljerSporsmalTilInnsendingSporsmal(
                this.props.meldekortdetaljer.sporsmal, innsending.sporsmalsobjekter
            );
            this.props.oppdaterSporsmalsobjekter(konverterteSporsmalsobjekter);
        } else {
            resetSporsmalOgUtfylling();
        }
    }

    returnerListeMedMeldekortdetaljerSporsmal = (mkdetaljerSporsmal: Sporsmal) => {
        return [
            {kategori: 'arbeid', checked: mkdetaljerSporsmal.arbeidet},
            {kategori: 'aktivitetArbeid', checked: mkdetaljerSporsmal.kurs},
            {kategori: 'forhindret', checked: mkdetaljerSporsmal.syk},
            {kategori: 'ferieFravar', checked: mkdetaljerSporsmal.annetFravaer},
            {kategori: 'registrert', checked: mkdetaljerSporsmal.arbeidssoker}
        ];
    }

    settCheckedBasertPaBoolean = (kategoritekst: string, sporsmalValg: boolean) => {
        return (sporsmalValg) ? kategoritekst + '.ja' :  kategoritekst + '.nei';
    }

    konverterMeldekortdetaljerSporsmalTilInnsendingSporsmal = (mkdetaljerSporsmal: Sporsmal, innsendingSporsmal: Spm[]): Spm[] => {
        console.log('inssSpm', innsendingSporsmal);
        const listeMedSporsmal = (mkdetaljerSporsmal!) ? this.returnerListeMedMeldekortdetaljerSporsmal(mkdetaljerSporsmal) : [];
        const konvertertListeMedInnsendingSpm: Spm[] = innsendingSporsmal
             .map( spm => {
                 for ( let i = 0; i < listeMedSporsmal.length; i++) {
                     if (spm.kategori === listeMedSporsmal[i].kategori) {
                         return { ...spm, checked: this.settCheckedBasertPaBoolean(spm.kategori, listeMedSporsmal[i].checked )};
                     }
                 }
                 return { ...spm};
             });
        console.log(konvertertListeMedInnsendingSpm);
        return konvertertListeMedInnsendingSpm;
    }

    componentDidMount() {
        this.settMeldekortIdBasertPaInnsendingstype();
        this.props.hentMeldekortdetaljer();
        this.resetSporsmalsHvisIkkeKorrigering();
    }

    render() {
        const { match, innsending } = this.props;

        return (
            <div className="sideinnhold">
                <PeriodeBanner/>
                <StegBanner/>
                <Switch>
                    <Route exact={true} path={`${match.url}` + '/sporsmal'} render={(props) => (<Sporsmalsside {...props}/>)}/>
                    <Route path={`${match.url}` + '/utfylling'} render={(props: RouteComponentProps<any>) => (<Utfylling {...props}/>)}/>
                    <Route path={`${match.url}` + '/bekreftelse'} render={(props: RouteComponentProps<any>) => (<Bekreftelse {...props}/>)}/>
                    <Route path={`${match.url}` + '/kvittering'} render={(props: RouteComponentProps<any>) => (<Kvittering {...props}/>)}/>
                    <Redirect exact={true} from={`${match.url}`} to={`${match.url}` + '/sporsmal'}/>
                </Switch>
            </div>
        );
    }
}

const mapStateToProps = (state: RootState): MapStateToProps => {
    return {
        innsending: state.innsending,
        aktivtMeldekort: state.aktivtMeldekort.meldekort,
        meldekortdetaljer: state.meldekortdetaljer.meldekortdetaljer,
    };
};

const mapDispatchToProps = (dispatch: Dispatch): MapDispatchToProps => {
    return {
        settMeldekortId: (meldekortId: number) =>
            dispatch(InnsendingActions.leggTilMeldekortId(meldekortId)),
        hentKorrigertId: () =>
            dispatch(InnsendingActions.hentKorrigertId.request()),
        resetSporsmalOgUtfylling: () =>
            dispatch(InnsendingActions.resetSporsmalOgUtfylling()),
        oppdaterSporsmalsobjekter: (sporsmalsobjekter: Spm[]) =>
            dispatch((InnsendingActions.oppdaterSpm(sporsmalsobjekter))),
        hentMeldekortdetaljer: () =>
            dispatch(MeldekortdetaljerActions.hentMeldekortdetaljer.request()),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(InnsendingRoutes);
