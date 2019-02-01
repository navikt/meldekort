import * as React from 'react';
import { Dispatch } from 'redux';
import { RootState } from '../../store/configureStore';
import { Select } from 'nav-frontend-skjema';
import { IntlAction, updateIntl } from 'react-intl-redux';
import { connect } from 'react-redux';
// import { LocalesState } from '../../reducers/localesReducer';

type ReduxType =
    ReturnType<typeof mapStateToProps> &
    ReturnType<typeof mapDispatcherToProps>;

class Sprakvelger extends React.Component<ReduxType> {
    constructor(props: ReduxType) {
        super(props);
    }

   handleOnChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        console.log(this.props.locs[event.target.value]);
        this.props.updateIntl(
           event.target.value, this.props.locs[event.target.value]
           );
    }

    render() {
       const currentLocale = this.props.locale;

       return (
            <div className="sprakvelger-container">
                <Select
                    label=""
                    value={currentLocale}
                    onChange={this.handleOnChange}
                >
                    {Object.keys(this.props.locs).map(locale => (
                        <option key={locale}>{locale}</option>
                    ))}
                </Select>
            </div>
        );
    }
}

const mapStateToProps = ({ intl, locales }: RootState) => {
    const { locale, messages } = intl;
    const locs = locales;
    return { locale, messages, locs};
};

const mapDispatcherToProps = (dispatch: Dispatch<IntlAction>) => {
    return {

        updateIntl: (locale: any, messages: any) =>
            dispatch(updateIntl({ locale, messages }))
    };
};

export default connect(mapStateToProps, mapDispatcherToProps)(Sprakvelger);
