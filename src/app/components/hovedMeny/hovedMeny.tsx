import * as React from 'react';
import classNames from 'classnames';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { hentIntl } from '../../utils/intlUtil';
import { MenyActions } from '../../actions/meny';
import { MenyPunkt } from '../../utils/menyConfig';
import { RootState, history } from '../../store/configureStore';

interface MapStateToProps {
    valgtMenyPunkt: MenyPunkt;
}

interface MapDispatchToProps {
    settValgtMenyPunkt: (menypunkt: MenyPunkt) => void;
}

interface HovedMenyProps {
    menypunkter: MenyPunkt[];
}

type Props = HovedMenyProps & MapStateToProps & MapDispatchToProps;

const HovedMeny: React.FunctionComponent<Props> = (props) => {
    const { menypunkter, settValgtMenyPunkt, valgtMenyPunkt} = props;

    const onChange = (item: MenyPunkt) => {
        settValgtMenyPunkt(item);
        history.push(item.urlparam);
    };

    return (
        <nav className="mainNav">
            <div className="mainNav__wrapper">
                <ul>
                    {
                        menypunkter.filter((item: MenyPunkt) => item.urlparam && item.urlparam !== '/new-project').map((item: MenyPunkt) =>
                            (
                                <li key={item.tittel}>
                                    <button
                                         onClick={() => onChange(item)}
                                         className={classNames('menypunkt underline', {
                                             active: valgtMenyPunkt.tittel === item.tittel
                                         })}

                                    >
                                        <span>{hentIntl().formatMessage({id: item.tekstid})}</span>
                                    </button>
                                </li>
                            )
                        )
                    }
                </ul>
            </div>
        </nav>
    );
};

const mapStateToProps = (state: RootState): MapStateToProps => {
    return {
        valgtMenyPunkt: state.meny.valgtMenyPunkt
    };
};

const mapDispatchToProps = (dispatch: Dispatch): MapDispatchToProps => {
    return {
        settValgtMenyPunkt: (menypunkt: MenyPunkt) =>
        dispatch(MenyActions.settValgtMenyPunkt(menypunkt)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(HovedMeny);
