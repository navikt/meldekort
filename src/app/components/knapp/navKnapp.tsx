import * as React from 'react';
import KnappBase from 'nav-frontend-knapper';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import { RootState, history } from '../../store/configureStore';
import { Router } from '../../types/router';
import { selectRouter } from '../../selectors/router';

interface MapStateToProps {
    router: Router;
}

interface Props {
    type: knappTyper;
    nestePath: string;
    tekstid: string;
    className?: string;
}

export enum knappTyper {
    hoved = 'hoved',
    standard = 'standard',
}

type NavKnappProps = MapStateToProps & Props;

const NavKnapp: React.StatelessComponent<NavKnappProps> = (props) => {
    return (
        <KnappBase
            type={props.type}
            onClick={() => {
                const currentPath =  props.router.location.pathname;
                let newPath;
                if (currentPath.slice(0, 11) !== '/innsending') {
                    newPath = props.nestePath;
                } else {
                    newPath = currentPath + props.nestePath;
                }
                console.log('cp:', currentPath);
                console.log('np:', newPath);
                history.push(newPath);
            }}
            className={props.className}
        >
            <FormattedMessage id={props.tekstid}/>
        </KnappBase>
    );
};

const mapStateToProps = (state: RootState): MapStateToProps => {
    return {
        router: selectRouter(state),
    };
};

export default connect(mapStateToProps)(NavKnapp);
