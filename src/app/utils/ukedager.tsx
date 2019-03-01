import { FormattedMessage } from 'react-intl';
import * as React from 'react';
import { hentIntl } from './intlUtil';

export const hentUkedagerSomElementListe = (): JSX.Element[] => {
    return [
        <FormattedMessage key={1} id="ukedag.mandag"/>,
        <FormattedMessage key={2} id="ukedag.tirsdag"/>,
        <FormattedMessage key={3} id="ukedag.onsdag"/>,
        <FormattedMessage key={4} id="ukedag.torsdag"/>,
        <FormattedMessage key={5} id="ukedag.fredag"/>,
        <FormattedMessage key={6} id="ukedag.lordag"/>,
        <FormattedMessage key={7} id="ukedag.sondag"/>
    ];
};

export const hentUkedagerSomStringListe = (): string[] => {
    const intl = hentIntl();
    return [
        intl.formatMessage({id: 'ukedag.mandag'}),
        intl.formatMessage({id: 'ukedag.tirsdag'}),
        intl.formatMessage({id: 'ukedag.onsdag'}),
        intl.formatMessage({id: 'ukedag.torsdag'}),
        intl.formatMessage({id: 'ukedag.fredag'}),
        intl.formatMessage({id: 'ukedag.lordag'}),
        intl.formatMessage({id: 'ukedag.sondag'}),
    ];
};