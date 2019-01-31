import * as React from 'react';
import { Dispatch } from 'redux';
import { RootState } from '../../store/configureStore';
import { Select } from 'nav-frontend-skjema';
import { IntlAction, updateIntl } from 'react-intl-redux';
import { connect } from 'react-redux';

type ReduxType =
    ReturnType<typeof mapStateToProps> &
    ReturnType<typeof mapDispatcherToProps>;

class Sprakvelger extends React.Component<ReduxType> {

    /*handleLoadlLocales = () => {
        store.dispatch({
            type: Constants.UPDATE_LOCALES,
            payload: {
                no: {
                    'app.greeting': 'Hei!',
                },
                en: {
                    'app.greeting': 'Hello!',
                },
            },
        });
    }*/
   handleOnChange = (event: React.SyntheticEvent<EventTarget>) => {

       // this.props.updateIntl(event.target.value);
       this.props.updateIntl({locale: 'no'});
    }

    render() {
        return (
            <div className="sprakvelger-container">
                <Select
                    label=""
                    value="velgSprak"
                    onChange={this.handleOnChange}
                >
                    <option value="no" key="norsk">
                        Norsk
                    </option>
                    <option value="en" key="english" >
                        English
                    </option>
                </Select>
            </div>
        );
    }
}

const mapStateToProps = ({ intl }: RootState) => {
    const { locale, messages } = intl;
    return { locale, messages };
};

const mapDispatcherToProps = (dispatch: Dispatch<IntlAction>) => {
    return {

        updateIntl: (locale: any) =>
            dispatch(updateIntl(locale))
    };
};

export default connect(mapStateToProps, mapDispatcherToProps)(Sprakvelger);
