import * as React from 'react';
import { Tab } from '../meny/tabConfig';
import { hentIntl } from '../../utils/intlUtil';
import { RootState } from '../../store/configureStore';
import { selectRouter } from '../../selectors/router';
import { connect } from 'react-redux';
import { Router } from '../../types/router';
import Lenke from 'nav-frontend-lenker';

interface MapStateToProps {
    router: Router;
}

interface HovedMenyProps {
    tabsobjekter: Tab[];
}

type Props = HovedMenyProps & MapStateToProps;

const HovedMeny: React.FunctionComponent<Props> = (props) => {
    const {router, tabsobjekter} = props;

    const pathname = '/meldekort/' + router.location.pathname.split('/')[1];
    console.log(pathname);
    const handleOnChange = ( event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
        console.log(event.currentTarget);
        // pathname !== event.target.urlparam && history.push(tabsobjekter[index].urlparam);
    };
    console.log(tabsobjekter);

    // TODO: sett default "tab".

    return (
        <nav className="mainNav">
            <div className="mainNav__wrapper">
                <ul>
                    {
                        tabsobjekter.filter((item: Tab) => item.urlparam && item.urlparam !== '/new-project').map((item: Tab, index: any) =>
                            (
                                <li key={item.tittel}>
                                    <Lenke
                                         href={'/meldekort' + item.urlparam}
                                         onClick={handleOnChange}
                                    >
                                        {hentIntl().formatMessage({id: item.tekstid})}
                                    </Lenke>
                                </li>
                            )
                        )
                    }
                </ul>
            </div>
        </nav>
    );
};

const mapStateToProps = (state: RootState): MapStateToProps => {
    return {
        router: selectRouter(state),
    };
};

export default connect(mapStateToProps)(HovedMeny);
