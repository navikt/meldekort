import { Undertittel } from 'nav-frontend-typografi';
import { FormattedMessage } from 'react-intl';
import * as React from 'react';

export const obsFeilmeldingContent = () => {
    return (
        <div>
            <Undertittel children={<FormattedMessage id="obs.feilmelding.overskrift"/>}/>
            <FormattedMessage id={'obs.feilmelding'} />
        </div>
    );
};