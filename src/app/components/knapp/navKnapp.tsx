import * as React from 'react';
import KnappBase from 'nav-frontend-knapper';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import { RootState, history } from '../../store/configureStore';
import { Router } from '../../types/router';
import { selectRouter } from '../../selectors/router';
import { AktivtMeldekortState } from '../../reducers/aktivtMeldekortReducer';
import { oppdaterAktivtMeldekort } from '../../actions/aktivtMeldekort';
import { Meldekort } from '../../types/meldekort';
import { Dispatch } from 'redux';
import { Innsendingstyper } from '../../types/innsending';
import { InnsendingActions } from '../../actions/innsending';

interface MapStateToProps {
    router: Router;
    aktivtMeldekort: AktivtMeldekortState;
    innsendingstypeFraStore: Innsendingstyper | null;
}

interface MapDispatchToProps {
    leggTilAktivtMeldekort: (meldekort: Meldekort) => void;
    settInnsendingstype: (innsendingstype: Innsendingstyper) => void;
    settInnsendingMeldekortId: (meldekortId: number) => void;
    hentKorrigertId: () => void;
}

interface NavKnappProps {
    type: knappTyper;
    nestePath: string;
    tekstid: string;
    className?: string;
    nesteAktivtMeldekort?: Meldekort;
    nesteInnsendingstype?: Innsendingstyper;
}

export enum knappTyper {
    hoved = 'hoved',
    standard = 'standard',
}

type Props = MapStateToProps & MapDispatchToProps & NavKnappProps;

class NavKnapp extends React.Component<Props> {
    constructor(props: any) {
        super(props);
    }

    // TODO: Kort ned på koden her hvis det går.
    harNestePathInnsending = (nestePathParams: string[]) => {
        console.log('harNEstePathInnsending/korriger: ', nestePathParams[nestePathParams.length - 1]);
        return (nestePathParams[nestePathParams.length - 1] === Innsendingstyper.innsending
            || nestePathParams[nestePathParams.length - 1] === Innsendingstyper.korrigering)
    }

    returnerInnsendingstypeBasertPaString = (innsendingstypeFraPath: string) => {
        // legg tile tterregistrering
        return (innsendingstypeFraPath === Innsendingstyper.innsending) ? Innsendingstyper.innsending : Innsendingstyper.korrigering;
    }

    clickHandler = (event: React.SyntheticEvent<EventTarget>) => {
        const { aktivtMeldekort, nesteAktivtMeldekort, innsendingstypeFraStore,
            nesteInnsendingstype, nestePath, router } = this.props;

        const path = router.location.pathname;
        const params = path.split('/');
        const nestePathParams = nestePath.split('/');
        const sisteParamINestePathParams = nestePathParams[nestePathParams.length-1];
        let newPath: string = "";
        console.log('path', path, 'params', params);
        console.log('nestepath', nestePath, 'nesteparams', nestePathParams);

        // ---> Hverken på innsending (ennå) eller trykket på UTF knapp.
        if (innsendingstypeFraStore === null) {
            console.log('Hvis ikke på innsending (insstype=null):', innsendingstypeFraStore);

            if (this.harNestePathInnsending(nestePathParams) && nesteInnsendingstype !== undefined ) {
                // --> Hvis man skal til innsending (nestePath har innsending) (nestePath = "/korriger" eller "/innsending")
                console.log('Hvis man skal til innsending..newPath = nestePath');
                this.props.settInnsendingstype(nesteInnsendingstype);
                newPath = nestePath;
            } else {
                console.log('skal IKKE til dinnsending.. nestePath blir newPath');
                // --> Hvis man ikke skal til innsending (nestePath ikke har innsending)
                newPath = nestePath;
            }
        } else {
            // ---> På innsending/ ...
            console.log('Er På innsending: innstype er ikke null:', innsendingstypeFraStore);

            const erPaKvittering = params[params.length-1] === 'kvittering';

            // ---> på "kvittering"
            if (erPaKvittering) {
                // --> Hvis man skal tilbake til meldekortOversikt/DittNav (send-meldekort/tidligere)
                    // Overskriv newPath med NestePath (send-meldekort)

                typeof nesteAktivtMeldekort !== undefined
                // MeldekortOversikt / DittNAV
                history.push(nestePath);

                // --> Hvis man har innsendingstype.innsending & har flere meldekort
                newPath = path + '/' + sisteParamINestePathParams;

            } else {
                // --> Hvis man ikke er på "Kvittering",
                //  Må fjerne sporsmal/ replace med utfylling. Sjekk kodeunder
                const editedParams = params;
                editedParams.pop();
                editedParams.push(sisteParamINestePathParams);
                newPath  = editedParams.join('/');
                console.log('newPath hvis man er på innS, men ikke kvittering', newPath)
            }
        }
        console.log('final newPath:', newPath);
        history.push(newPath);
        (nesteAktivtMeldekort !== undefined && nesteInnsendingstype !== undefined)
        && this.props.leggTilAktivtMeldekort(nesteAktivtMeldekort);
    }

    render() {
        return (
            <KnappBase
                type={this.props.type}
                onClick={this.clickHandler}
                className={this.props.className}
            >
                <FormattedMessage id={this.props.tekstid}/>
            </KnappBase>
        );
    }
}

const mapStateToProps = (state: RootState): MapStateToProps => {
    let meldekort: AktivtMeldekortState = {
        meldekort: state.aktivtMeldekort.meldekort
    };
    return {
        aktivtMeldekort: meldekort,
        router: selectRouter(state),
        innsendingstypeFraStore: state.innsending.innsendingstype,
    };
};

const mapDispatchToProps = (dispatch: Dispatch): MapDispatchToProps => {
    return {
        leggTilAktivtMeldekort: (aktivtMeldekort: Meldekort) =>
            dispatch(oppdaterAktivtMeldekort(aktivtMeldekort)),
        settInnsendingstype: (innsendingstype: Innsendingstyper) =>
            dispatch(InnsendingActions.leggTilInnsendingstype(innsendingstype)),
        settInnsendingMeldekortId: (meldekortId: number) => {
            dispatch(InnsendingActions.leggTilMeldekortId(meldekortId))
        },
        hentKorrigertId: () => {
            dispatch(InnsendingActions.hentKorrigertId.request())
        }

    };
};

export default connect(mapStateToProps, mapDispatchToProps)(NavKnapp);
