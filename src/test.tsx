import * as React from 'react';

import './test.less';

import Ekspanderbartpanel from 'nav-frontend-ekspanderbartpanel';

class Test extends React.Component {
    public render() {
        return (
            <div className="test">
                <Ekspanderbartpanel tittel="HABA HABA" tittelProps="undertittel">
                    Slik ser et åpent panel ut.
                </Ekspanderbartpanel>

                <p className="test boks">
                    To get started, edit <code>src/App.tsx</code> and save to reload.
                </p>
            </div>
        );
    }
}

export default Test;
