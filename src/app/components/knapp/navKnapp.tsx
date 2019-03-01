import * as React from 'react';
import KnappBase from 'nav-frontend-knapper';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import { RootState, history } from '../../store/configureStore';
import { Router } from '../../types/router';
import { selectRouter } from '../../selectors/router';
import { Meldekort } from '../../types/meldekort';

interface MapStateToProps {
    router: Router;
}

interface NavKnappProps {
    type: knappTyper;
    nestePath: string;
    tekstid: string;
    className?: string;
    aktivtMeldekortObjekt?: Meldekort;
    onClick?: () => void;
}

export enum knappTyper {
    hoved = 'hoved',
    standard = 'standard',
}

type Props = MapStateToProps & NavKnappProps;

class NavKnapp extends React.Component<Props> {
    constructor(props: any) {
        super(props);
    }

    clickHandler = () => {

        const currentPath = this.props.router.location.pathname;
        const erPaInnsending = currentPath.slice(0, 11) === '/innsending';
        let newPath;
        if (erPaInnsending) {
            newPath = this.props.nestePath;
        } else {
            newPath = this.props.nestePath;
        }
        history.push(newPath);
        this.props.onClick;

    }

    render() {
        return (
            <KnappBase
                type={this.props.type}
                onClick={this.clickHandler}
                className={this.props.className}
            >
                <FormattedMessage id={this.props.tekstid}/>
            </KnappBase>
        );
    }
};

const mapStateToProps = (state: RootState): MapStateToProps => {
    return {
        router: selectRouter(state)
    };
};

export default connect(mapStateToProps)(NavKnapp);
