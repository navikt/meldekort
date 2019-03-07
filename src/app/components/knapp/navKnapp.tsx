import * as React from 'react';
import KnappBase from 'nav-frontend-knapper';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import { RootState, history } from '../../store/configureStore';
import { innsendingsTyper, Router } from '../../types/router';
import { selectRouter } from '../../selectors/router';
import { AktivtMeldekortState } from '../../reducers/aktivtMeldekortReducer';
import { oppdaterAktivtMeldekort } from '../../actions/aktivtMeldekort';
import { KortStatus, Meldekort } from '../../types/meldekort';
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

    returnerInnsendingstypeEllersTomString = (currentPath: string) => {
        let innsendingstype: string = "";
        for (let type in innsendingsTyper) {
            const pathType = "/" + type;
            if (isNaN(Number(type)) && (pathType === this.props.nestePath)) {
                innsendingstype = pathType;
                console.log('type: ', innsendingstype);
            }
        }
        return innsendingstype;
    }

    clickHandler = (event: React.SyntheticEvent<EventTarget>) => {

        const currentPath = this.props.router.location.pathname;
        const urlListe = currentPath.split('/');
        let newPath = currentPath + this.returnerInnsendingstypeEllersTomString(this.props.nestePath);
        console.log('url liste:', urlListe);

        const aktivtMeldekort = this.props.aktivtMeldekort;
        if (this.props.aktivtMeldekortObjekt  && urlListe[1] === 'send-meldekort') {
            this.props.leggTilAktivtMeldekort(aktivtMeldekort.meldekort);
        }
        console.log('newpath:', newPath);
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
}

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
