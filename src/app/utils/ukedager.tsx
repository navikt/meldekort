import { FormattedMessage } from 'react-intl';
import * as React from 'react';
import { hentIntl } from './intlUtil';
import { guid } from 'nav-frontend-js-utils';
import Ingress from 'nav-frontend-typografi/lib/ingress';

export const hentUkedagerSomElementListe = (): JSX.Element[] => {
  return [
    <FormattedMessage key={guid()} id="ukedag.mandag" />,
    <FormattedMessage key={guid()} id="ukedag.tirsdag" />,
    <FormattedMessage key={guid()} id="ukedag.onsdag" />,
    <FormattedMessage key={guid()} id="ukedag.torsdag" />,
    <FormattedMessage key={guid()} id="ukedag.fredag" />,
    <FormattedMessage key={guid()} id="ukedag.lordag" />,
    <FormattedMessage key={guid()} id="ukedag.sondag" />,
  ];
};

export const hentUkedagerSomStringListe = (): string[] => {
  const intl = hentIntl();
  return [
    intl.formatMessage({ id: 'ukedag.mandag' }).trim(),
    intl.formatMessage({ id: 'ukedag.tirsdag' }).trim(),
    intl.formatMessage({ id: 'ukedag.onsdag' }).trim(),
    intl.formatMessage({ id: 'ukedag.torsdag' }).trim(),
    intl.formatMessage({ id: 'ukedag.fredag' }).trim(),
    intl.formatMessage({ id: 'ukedag.lordag' }).trim(),
    intl.formatMessage({ id: 'ukedag.sondag' }).trim(),
  ];
};

// Fra mandag-søndag 0-6 til 1-0
export const konverterUkedag = (index: number): number => {
  return index === 6 ? 0 : index + 1;
};

export const hentUkedager = () => {
  return hentUkedagerSomStringListe().map((dag, index) => {
    return (
      <Ingress key={dag + index}>
        <abbr key={'ukedager-' + dag} title={dag}>
          {dag.toUpperCase()[0]}
        </abbr>
      </Ingress>
    );
  });
};
