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

interface MapStateToProps {
    router: Router;
    aktivtMeldekort: AktivtMeldekortState;
}

interface MapDispatcherToProps {
    leggTilAktivtMeldekort: (meldekort: Meldekort) => void;
}

interface NavKnappProps {
    type: knappTyper;
    nestePath: string;
    tekstid: string;
    className?: string;
    aktivtMeldekortObjekt?: Meldekort;
}

export enum knappTyper {
    hoved = 'hoved',
    standard = 'standard',
}

type Props = MapStateToProps & MapDispatcherToProps & NavKnappProps;

class NavKnapp extends React.Component<Props> {
    constructor(props: any) {
        super(props);
    }

    clickHandler = () => {

        const currentPath = this.props.router.location.pathname;
        const erPaInnsending = currentPath.slice(0, 11) === '/innsending';
        let newPath;
        if (erPaInnsending) {
            newPath = this.props.nestePath;
        } else {
            newPath = this.props.nestePath;

        }
        if (this.props.aktivtMeldekortObjekt  && currentPath.slice(0, 15) === '/send-meldekort') {
            this.props.leggTilAktivtMeldekort(this.props.aktivtMeldekortObjekt);
        }
        history.push(newPath);
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
};

const mapStateToProps = (state: RootState): MapStateToProps => {
    let meldekort: AktivtMeldekortState = {
        meldekort: state.aktivtMeldekort.meldekort
    };
    return {
        aktivtMeldekort: meldekort,
        router: selectRouter(state),
    };
};

const mapDispatcherToProps = (dispatch: Dispatch): MapDispatcherToProps => {
    return {
        leggTilAktivtMeldekort: (aktivtMeldekort: Meldekort) =>
            dispatch(oppdaterAktivtMeldekort(aktivtMeldekort))
    };
};

export default connect(mapStateToProps, mapDispatcherToProps)(NavKnapp);
