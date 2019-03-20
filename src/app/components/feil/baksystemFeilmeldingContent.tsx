import * as React from 'react';
import { Undertittel } from 'nav-frontend-typografi';
import { FormattedMessage } from 'react-intl';

export const baksystemFeilmeldingContent = () => {
    return (
        <div>
            <Undertittel children={<FormattedMessage id="feilmelding.baksystem.overskrift"/>}/>
            <FormattedMessage id={'feilmelding.baksystem'} />
        </div>
    );
};