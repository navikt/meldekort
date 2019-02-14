import * as React from 'react';
import { Innholdstittel } from 'nav-frontend-typografi';
import Sprakvelger from '../../components/sprakvelger/sprakvelger';
import { fetchHistoriskeMeldekort } from '../../api/api';
import { Dispatch } from 'redux';
import { HistoriskeMeldekortActions } from '../../actions/historiskeMeldekort';
import { connect } from 'react-redux';

interface MapDispatchToProps {
    hentHistoriskeMeldekort: () => void;
}

type Props = MapDispatchToProps;

class TidligereMeldekort extends React.Component<Props> {
    constructor(props: any) {
        super(props);

        this.props.hentHistoriskeMeldekort();
    }

    render() {
        console.log(fetchHistoriskeMeldekort());
        return(
            <div className="sideinnhold">
                <Innholdstittel> Tidligere meldekort</Innholdstittel>
                <Sprakvelger/>
            </div>
        );
    }
}

const mapDispatchToProps = (dispatch: Dispatch): MapDispatchToProps => {
        return {
            hentHistoriskeMeldekort: () => dispatch(HistoriskeMeldekortActions.hentHistoriskeMeldekort.request()),
        };
};

export default connect(
    null,
    mapDispatchToProps,
) (TidligereMeldekort);
