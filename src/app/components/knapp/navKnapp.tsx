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
    innsendingstypeFraStore: Innsendingstyper | null;
}

interface MapDispatchToProps {
    leggTilAktivtMeldekort: (meldekort: Meldekort) => void;
    settInnsendingstype: (innsendingstype: Innsendingstyper) => void;
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

    harNestePathInnsending = (nestePathParams: string[]) => {
        return (nestePathParams[nestePathParams.length - 1] === Innsendingstyper.innsending
            || nestePathParams[nestePathParams.length - 1] === Innsendingstyper.korrigering)
    };

    returnerNestePathInnenforInnsending = (params: string[], nestePathParams: string[]) => {
        const editedParams = params;
        editedParams.pop();
        editedParams.push(nestePathParams[nestePathParams.length-1]);
        return editedParams.join('/');
    };

    clickHandler = (event: React.SyntheticEvent<EventTarget>) => {
        const { nesteAktivtMeldekort, innsendingstypeFraStore, nesteInnsendingstype,
            nestePath, router } = this.props;

        const path = router.location.pathname;
        const params = path.split('/');
        const nestePathParams = nestePath.split('/');
        const erPaKvittering = params[params.length-1] === 'kvittering';
        const erPaInnsending = innsendingstypeFraStore !== null;

        let nyPath: string = "";

        (nesteAktivtMeldekort !== undefined && nesteInnsendingstype !== undefined)
        && this.props.leggTilAktivtMeldekort(nesteAktivtMeldekort);

        if (erPaInnsending) {
            if (!erPaKvittering) {
                nyPath = this.returnerNestePathInnenforInnsending(params, nestePathParams);
            } else {
                nyPath = nestePath;
            }
        } else {
            (this.harNestePathInnsending(nestePathParams) && nesteInnsendingstype !== undefined)
            && this.props.settInnsendingstype(nesteInnsendingstype);
            nyPath = nestePath;
        }
        history.push(nyPath);
    };

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
    return {
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
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(NavKnapp);
