import * as React from 'react';
import classNames from 'classnames';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { hentIntl } from '../../utils/intlUtil';
import { MenyActions } from '../../actions/meny';
import { MenyPunkt } from '../../utils/menyConfig';
import { RootState } from '../../store/configureStore';
import { Router } from '../../types/router';
import { selectRouter } from '../../selectors/router';

interface MapStateToProps {
    router: Router;
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
    const {router, menypunkter, settValgtMenyPunkt, valgtMenyPunkt} = props;

    const pathname = '/meldekort/' + router.location.pathname.split('/')[1];

    return (
        <nav className="mainNav">
            <div className="mainNav__wrapper">
                <ul>
                    {
                        menypunkter.filter((item: MenyPunkt) => item.urlparam && item.urlparam !== '/new-project').map((item: MenyPunkt, index: any) =>
                            (
                                <li key={item.tittel}>
                                    <button
                                         onClick={() => settValgtMenyPunkt(item)}
                                         className={classNames('menypunkt', {
                                             active: valgtMenyPunkt.tittel === item.tittel
                                         })}

                                    >
                                        {hentIntl().formatMessage({id: item.tekstid})}
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
        router: selectRouter(state),
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
