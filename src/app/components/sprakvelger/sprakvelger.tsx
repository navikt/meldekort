import * as React from 'react';
import { Select } from 'nav-frontend-skjema';
import { RootState } from '../../store/configureStore';
import { Dispatch } from 'redux';
import { LocalesActions } from '../../types/locales';
import { updateLocale } from '../../actions/locales';
import { connect } from 'react-redux';

type ReduxType =
    ReturnType<typeof mapStateToProps> &
    ReturnType<typeof mapDispatcherToProps>;

const Sprakvelger: React.StatelessComponent<ReduxType> = (props) => {

    return(
        <div className="sprakvelger-container">
            <Select label="">
                <option value="no" key="norsk">
                    Norsk
                </option>
                <option value="it" key="italian">
                    Italian
                </option>
            </Select>
        </div>
    );
};

const mapStateToProps = ({locales}: RootState) => {
    const { locale } = locales;
    return { locale };
};

const mapDispatcherToProps = (dispatch: Dispatch<LocalesActions>) => {
    return {
        updateLocale: (locale: string) =>
            dispatch(updateLocale(locale))
    };
};

export default connect(mapStateToProps, mapDispatcherToProps)(Sprakvelger);
