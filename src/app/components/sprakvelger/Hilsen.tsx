import * as React from 'react';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';

const Hilsen = () => {

    return (
        <p>
            <FormattedMessage id="app.greeting" defaultMessage="Hello!" />
        </p>
    );
};

export default connect()(Hilsen);
