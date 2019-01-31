import * as React from 'react';
import { addLocaleData, IntlProvider as Provider } from 'react-intl';
import en from 'react-intl/locale-data/en';
import nb from 'react-intl/locale-data/nb';
import tekster from './messages';

interface IntlProviderState {
    locale: string;
    tekster: any;
}

class IntlProvider extends React.Component<{}, IntlProviderState> {

    settLocale(localeString: string, locale: ReactIntl.Locale[], teksterPaValgtSprak: any) {
        addLocaleData(locale);
        this.setState({locale: localeString, tekster: teksterPaValgtSprak});
    }

    componentWillMount() {
        const pathname = window.location.pathname;
        pathname.includes('/engelsk/') ?
            this.settLocale('en', en, tekster.en) : this.settLocale('nb', nb, tekster.nb);
    }

    render() {
        const {children, ...props} = this.props;

        return (
            <Provider {...props} locale={this.state.locale} messages={this.state.tekster || []}>
                {children}
            </Provider>
        );
    }
}

export default IntlProvider;
