import * as React from 'react';
import { MeldekortdetaljerState } from '../../../reducers/meldekortdetaljerReducer';
import { RootState } from '../../../store/configureStore';
import { Dispatch } from 'redux';
import { MeldekortdetaljerActions } from '../../../actions/meldekortdetaljer';
import { connect } from 'react-redux';
import Meldekortdetaljer from '../../../components/meldekortdetaljer/meldekortdetaljer';
import { Innholdstittel } from 'nav-frontend-typografi';

interface MapStateToProps {
    meldekortdetaljer: MeldekortdetaljerState;
}

interface MapDispatchToProps {
    hentMeldekortdetaljer: () => void;
}

type Props = MapDispatchToProps&MapStateToProps;

class Detaljer extends React.Component<Props> {
    constructor(props: any) {
        super(props);
        this.props.hentMeldekortdetaljer();
    }

    render() {
        return(
            <div className="sideinnhold">
                <Innholdstittel>Hei</Innholdstittel>
                { this.props.meldekortdetaljer.meldekortdetaljer.id !== '' ?
                    <Meldekortdetaljer meldekortdetaljer={this.props.meldekortdetaljer.meldekortdetaljer}/> : null }
            </div>
        );
    }
}

const mapStateToProps = (state: RootState): MapStateToProps => {
    return {
        meldekortdetaljer: state.meldekortdetaljer,
    };
};

const mapDispatchToProps = (dispatch: Dispatch): MapDispatchToProps => {
    return {
        hentMeldekortdetaljer: () => dispatch(MeldekortdetaljerActions.hentMeldekortdetaljer.request()),
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Detaljer);
