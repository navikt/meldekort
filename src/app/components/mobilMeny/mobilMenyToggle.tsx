import * as React from 'react';
import { RootState } from '../../store/configureStore';
import { Dispatch } from 'redux';
import { MenyActions } from '../../actions/meny';
import { connect } from 'react-redux';

interface MapDispatchToProps {
    toggleMeny: (erApen: boolean) => void;
}

interface MapStateToProps {
    erApen: boolean;
}

const MobilMenyToggle: React.FunctionComponent<MapDispatchToProps&MapStateToProps> = (props) => {

    const mobilMenyToggleClass = props.erApen ? 'nav-icon open' : 'nav-icon';

    return (
        <div
            className={'burger-menu-toggle'}
            onClick={() => props.toggleMeny(!props.erApen)}
        >
            <div className={mobilMenyToggleClass}>
                <span/>
                <span/>
                <span/>
                <span/>
            </div>
        </div>
    );
};

const mapStateToProps = (state: RootState): MapStateToProps => {
    return {
        erApen: state.meny.erApen
    };
};

const mapDispatchToProps = (dispatch: Dispatch): MapDispatchToProps => {
    return {
        toggleMeny: (erApen: boolean) =>
            dispatch(MenyActions.toggleMeny(erApen)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(MobilMenyToggle);