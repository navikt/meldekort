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

const NavKnapp: React.FC<Props> = (props) => {

    const clickHandler = () => {
        const currentPath = props.router.location.pathname;
        const erPaInnsending = currentPath.slice(0, 11) === '/innsending';
        let newPath;
        (erPaInnsending)? newPath = props.nestePath : newPath = props.nestePath;
        history.push(newPath);
        props.onClick;
    }

    return (
        <KnappBase
            type={props.type}
            onClick={clickHandler}
            className={props.className}
        >
            <FormattedMessage id={props.tekstid}/>
        </KnappBase>
    );
};

const mapStateToProps = (state: RootState): MapStateToProps => {
    return {
        router: selectRouter(state)
    };
};

export default connect(mapStateToProps)(NavKnapp);
