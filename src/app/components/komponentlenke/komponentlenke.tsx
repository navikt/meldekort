import * as React from 'react';
import 'nav-frontend-lenker-style';
import { Redirect } from 'react-router';
import { RootState } from '../../store/configureStore';
import { oppdaterAktivtMeldekort } from '../../actions/aktivtMeldekort';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import { AktivtMeldekortState } from '../../reducers/aktivtMeldekortReducer';

interface KomponentlenkeProps {
    lenketekst: string;
    rute: string;
    meldekortId?: number;
}

interface MapStateToProps {
    aktivtMeldekort: AktivtMeldekortState;
}

interface MapDispatcherToProps {
    leggTilAktivtMeldekort: (meldekortId: number) => void;
}

type ReduxType =
    KomponentlenkeProps & MapDispatcherToProps & MapStateToProps;

class Komponentlenke extends React.Component<ReduxType, {redirect: any}> {

    constructor(props: any) {
        super(props);
        this.state = {redirect: null};
    }

    clickHandler = () => {
        console.log('Click fired!');
        console.log(this.props);

        if (this.props.meldekortId) {
            console.log('Legger til aktivtMeldekort');
            this.props.leggTilAktivtMeldekort(this.props.meldekortId);
        }

        this.setState({
            redirect: <Redirect to={this.props.rute}/>
        });
    }

    render() {
        return (
            <div>
                <a className="lenke" onClick={this.clickHandler}> <span>{this.props.lenketekst}</span> </a>
                {this.state.redirect}
            </div>
        );
    }
}

const mapStateToProps = (state: RootState): MapStateToProps => {
        let meldekort: AktivtMeldekortState = {
            meldekortId: state.aktivtMeldekort.meldekortId
        };
        return {
            aktivtMeldekort: meldekort
        };
};

const mapDispatcherToProps = (dispatch: Dispatch): MapDispatcherToProps => {
    return {
        leggTilAktivtMeldekort: (meldekortId: number) =>
            dispatch(oppdaterAktivtMeldekort(meldekortId))
    };
};

export default connect(mapStateToProps, mapDispatcherToProps)(Komponentlenke);
