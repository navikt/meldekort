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

interface SprakvelgerState {
    // locales: LocalesState;
}

class Sprakvelger extends React.Component<ReduxType, SprakvelgerState> {
    constructor(props: ReduxType) {
        super(props);
        const locales = Object.assign(this.props.en, this.props.no);
        console.log(locales);
        /*this.state = {
            locales: locales
        }*/
    }

   handleOnChange = (event: React.SyntheticEvent<EventTarget>) => {
       // handle on change sånn at man tar event.target.value
       // og setter den som locale & tilhørende messages.
       /*this.props.updateIntl(
           event.target, {
           messages: locales[event.target]});*/

       this.props.updateIntl('no' , { 'app.greeting' : 'xake'});
    }

                    /*
                    <option value="no" key="norsk">
                        Norsk
                    </option>
                    <option value="en" key="english" >
                        English
                    </option>
                    */

    render() {
       const currentLocale = this.props.locale;
       const locales = Object.assign(this.props.en, this.props.no);

       return (
            <div className="sprakvelger-container">
                <Select
                    label=""
                    value={currentLocale}
                    onChange={this.handleOnChange}
                >
                    {Object.keys(locales).map(locale => (
                        <option key={locale}>{locale}</option>
                    ))}
                </Select>
            </div>
        );
    }
}

const mapStateToProps = ({ intl, locales }: RootState) => {
    const { locale, messages } = intl;
    const { no, en } = locales;
    return { locale, messages, no, en};
};

const mapDispatcherToProps = (dispatch: Dispatch<IntlAction>) => {
    return {

        updateIntl: (locale: any, messages: any) =>
            dispatch(updateIntl({ locale, messages }))
    };
};

export default connect(mapStateToProps, mapDispatcherToProps)(Sprakvelger);
