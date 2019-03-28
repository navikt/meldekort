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
    constructor(props: ReduxType) {
        super(props);
    }

   handleOnChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        this.props.updateIntl(
           event.target.value, this.props.locs[event.target.value].tekster
           );
    }

    render() {
        const { locale, locs } = this.props;
        const locsArray = [locs.nb, locs.en];
        
        return (
            <div className="sprakvelger-container">
                <Select
                    label=""
                    value={locale}
                    onChange={this.handleOnChange}
                >
                    {locsArray.map( loc => {
                        return (
                            <option key={loc.label} value={loc.label}> {loc.tittel} </option>
                        );
                    })}
                </Select>
            </div>
        );
    }
}

const mapStateToProps = ({ intl, locales }: RootState) => {
    return {
        locale: intl.locale,
        messages: intl.messages,
        locs: locales
    };
};

const mapDispatcherToProps = (dispatch: Dispatch<IntlAction>) => {
    return {
        updateIntl: (locale: any, messages: any) =>
            dispatch(updateIntl({locale, messages}))
    };
};

export default connect(mapStateToProps, mapDispatcherToProps)(Sprakvelger);
