import * as React from 'react';
import { default as menyConfig, MenyPunkt } from '../../utils/menyConfig';
import { history, RootState } from '../../store/configureStore';
import { selectRouter } from '../../selectors/router';
import { connect } from 'react-redux';
import { Router } from '../../types/router';
import { hentIntl } from '../../utils/intlUtil';
import { MenyActions } from '../../actions/meny';
import { Dispatch } from 'redux';
import classNames from 'classnames';

interface MobilMenyProps {
    menypunkter: MenyPunkt[];
}

interface MapStateToProps {
    router: Router;
    erApen: boolean;
    valgtMenyPunkt: MenyPunkt;
}

interface MapDispatchToProps {
    settValgtMenyPunkt: (menypunkt: MenyPunkt) => void;
}

const MobilMeny: React.FunctionComponent<MobilMenyProps&MapStateToProps&MapDispatchToProps> = (props) => {
    const {settValgtMenyPunkt, valgtMenyPunkt, menypunkter, erApen} = props;

    const onChange = (item: MenyPunkt) => {
        settValgtMenyPunkt(item);
        history.push(item.urlparam);
    };

    return (
        <nav className={classNames('mobilMeny', {open: erApen})}>
                {menypunkter.map( menypunkt => (
                    <button
                        className={classNames('mobilMeny-item', {
                            active: valgtMenyPunkt.tittel === menypunkt.tittel
                        })}
                        onClick={() => onChange(menypunkt)}
                    >
                        {hentIntl().formatMessage({id: menypunkt.tekstid})}
                    </button>
                ))}
        </nav>
    );
};

const mapStateToProps = (state: RootState): MapStateToProps => {
    return {
        router: selectRouter(state),
        erApen: state.meny.erApen,
        valgtMenyPunkt: state.meny.valgtMenyPunkt
    };
};

const mapDispatchToProps = (dispatch: Dispatch): MapDispatchToProps => {
    return {
        settValgtMenyPunkt: (menypunkt: MenyPunkt) =>
            dispatch(MenyActions.settValgtMenyPunkt(menypunkt)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps) (MobilMeny);
