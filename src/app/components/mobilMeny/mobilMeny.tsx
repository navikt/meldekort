import * as React from 'react';
import { default as menyConfig, MenyPunkt } from '../../utils/menyConfig';
import classnames from 'classnames';
import { RootState } from '../../store/configureStore';
import { selectRouter } from '../../selectors/router';
import { connect } from 'react-redux';
import { Router } from '../../types/router';
import MobilMenyItem from './mobilMenyItem';

const cls = (erApen: boolean) => classnames('meldekort-mobile-nav', {
    'meldekort-mobile-nav--open': erApen,
    'meldekort-mobile-nav--hidden': !erApen
});

/*
const cls = (erApen: boolean) => erApen ? 'meldekort-mobile-nav';
*/

interface MobilMenyProps {
    menypunkter: MenyPunkt[];
}

interface MapStateToProps {
    router: Router;
    erApen: boolean;
}

const MobilMeny: React.FunctionComponent<MobilMenyProps&MapStateToProps> = (props) => {

    const renderMenyPunkt = (menypunkt: MenyPunkt, index: number) => {
        return (
            <MobilMenyItem erApen={props.erApen} menypunkt={menypunkt}/>
        );
    };

    return (
        <nav className={cls(props.erApen)}>
            <ul className={'nav-list'}>
                {
                    menyConfig.filter((menypunkt: MenyPunkt) => menypunkt.urlparam)
                        .map((menypunkt: MenyPunkt, index: number) => renderMenyPunkt(menypunkt, index))
                }
            </ul>
        </nav>
    );

};

const mapStateToProps = (state: RootState): MapStateToProps => {
    return {
        router: selectRouter(state),
        erApen: state.meny.erApen,
    };
};

export default connect(mapStateToProps) (MobilMeny);
