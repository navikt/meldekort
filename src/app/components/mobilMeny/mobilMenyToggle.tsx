import * as React from 'react';
import classnames from 'classnames';
import { hentIntl } from '../../utils/intlUtil';

interface State {
    shadow: boolean;
}

class MobilMenyToggle extends React.Component<any, State> {
    constructor(props: any) {
        super(props);

        this.state = {
            shadow: false
        };

        window.addEventListener('scroll', () => this.checkScroll());
    }

    checkScroll = () => {
        if (window.scrollY > 60) {
            this.setState({
                shadow: true
            });
        } else {
            this.setState({
                shadow: false
            });
        }
    }

    render() {
        return (
            <button
                className={classnames('meldekort-mobile-nav-toggle', { 'meldekort-mobile-nav-toggle--with-shadow': this.state.shadow })}
                {...this.props}
            >
                <span className="meldekort-mobile-nav-toggle__hamburger-icon">
                    {hentIntl().formatMessage({id: 'meny.toggle.apne'})}
                </span>
            </button>
        );
    }
}

export default MobilMenyToggle;
