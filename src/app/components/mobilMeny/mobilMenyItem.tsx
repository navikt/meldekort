import React from 'react';
import classnames from 'classnames';
import { MenyPunkt } from '../../utils/menyConfig';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import { MenyActions } from '../../actions/meny';
import { hentIntl } from '../../utils/intlUtil';

interface MapDispatchToProps {
    toggleMeny: (toggle: boolean) => void;
}

interface Props {
    erApen: boolean;
    menypunkt: MenyPunkt;
}

const MobilMenyItem: React.FunctionComponent<Props&MapDispatchToProps> = (props) => {

    return (
        <li className={classnames({ 'open': props.erApen})}>
            {
                <button
                    onClick={() => props.toggleMeny(!props.erApen)}
                >
                    {hentIntl().formatMessage({ id: props.menypunkt.tekstid })}
                </button>
            }

        </li>
    );
};

const mapDispatchToProps = (dispath: Dispatch): MapDispatchToProps => {
    return {
        toggleMeny: (toggle: boolean ) => dispath(MenyActions.toggleMeny(toggle)),
    };
};

export default connect(null, mapDispatchToProps)(MobilMenyItem);
