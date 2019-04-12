import { FormattedMessage } from 'react-intl';
import * as React from 'react';
import { hentIntl } from './intlUtil';
import {combineAll} from "rxjs/operators";
import {guid} from "nav-frontend-js-utils";

export const hentUkedagerSomElementListe = (): JSX.Element[] => {
    return [
        <FormattedMessage key={guid()} id="ukedag.mandag"/>,
        <FormattedMessage key={guid()} id="ukedag.tirsdag"/>,
        <FormattedMessage key={guid()} id="ukedag.onsdag"/>,
        <FormattedMessage key={guid()} id="ukedag.torsdag"/>,
        <FormattedMessage key={guid()} id="ukedag.fredag"/>,
        <FormattedMessage key={guid()} id="ukedag.lordag"/>,
        <FormattedMessage key={guid()} id="ukedag.sondag"/>
    ];
};

export const hentUkedagerSomStringListe = (): string[] => {
    const intl = hentIntl();
    return [
        intl.formatMessage({id: 'ukedag.mandag'}).trim(),
        intl.formatMessage({id: 'ukedag.tirsdag'}).trim(),
        intl.formatMessage({id: 'ukedag.onsdag'}).trim(),
        intl.formatMessage({id: 'ukedag.torsdag'}).trim(),
        intl.formatMessage({id: 'ukedag.fredag'}).trim(),
        intl.formatMessage({id: 'ukedag.lordag'}).trim(),
        intl.formatMessage({id: 'ukedag.sondag'}).trim(),
    ];
};

export const matchUkedager = (norskUkedag: string, testUkedag: string): boolean => {
    return norskUkedag.trim() === konverterUkedag(testUkedag.trim());
};

export const konverterUkedag = (ukedag: string): string => {
    let index = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].indexOf(ukedag.trim());
    if ( index >= 0) {
        return hentNorskeUkedager()[index];
    }
    return ukedag.trim();
};

export const hentNorskeUkedager = (): string[] => {
    return ['Mandag', 'Tirsdag', 'Onsdag', 'Torsdag', 'Fredag', 'Lørdag', 'Søndag'];
};