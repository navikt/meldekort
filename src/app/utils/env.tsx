import { erLocalhost, erMock } from '../mock/utils';
import { Konstanter } from './consts';

const Environment = () => {
  if (
    window.location.hostname.indexOf(
      'meldekort-frontend-q2.intern.dev.nav.no'
    ) > -1
  ) {
    return {
      minSideUrl: 'https://www.dev.nav.no/minside/',
      apiUrl:
        'https://meldekort-api-q2.dev.nav.no/meldekort/meldekort-api/api/',
      loginUrl: 'https://meldekort-api-q2.intern.dev.nav.no/oauth2/login',
      logoutUrl: 'https://meldekort-api-q2.intern.dev.nav.no/oauth2/logout',
      amplitudeUrl: 'amplitude.nav.no/collect',
      amplitudeKey: '9845ded64c69cd068651cd0d968e0796',
      testEnv: true,
    };
  } else if (
    window.location.hostname.indexOf(
      'meldekort-frontend-q1.intern.dev.nav.no'
    ) > -1
  ) {
    return {
      minSideUrl: 'https://www.dev.nav.no/minside/',
      apiUrl:
        'https://meldekort-api-q1.dev.nav.no/meldekort/meldekort-api/api/',
      loginUrl: 'https://meldekort-api-q1.intern.dev.nav.no/oauth2/login',
      logoutUrl: 'https://meldekort-api-q1.intern.dev.nav.no/oauth2/logout',
      amplitudeUrl: 'amplitude.nav.no/collect',
      amplitudeKey: '9845ded64c69cd068651cd0d968e0796',
      testEnv: true,
    };
  } else if (erMock()) {
    return {
      minSideUrl: 'https://www.dev.nav.no/minside/',
      apiUrl: '',
      loginUrl: 'https://loginservice.dev.nav.no/login?level=Level3',
      logoutUrl: 'https://loginservice.dev.nav.no/slo',
      testEnv: true,
    };
  } else if (erLocalhost()) {
    return {
      minSideUrl: 'https://www.dev.nav.no/minside/',
      apiUrl: 'http://localhost:8801/meldekort/meldekort-api/api/',
      loginUrl: 'https://loginservice.dev.nav.no/login?level=Level3',
      logoutUrl: 'https://loginservice.dev.nav.no/slo',
      testEnv: true,
    };
  }
  return {
    minSideUrl: 'https://www.nav.no/minside/',
    apiUrl: 'https://meldekort-api.nav.no/meldekort/meldekort-api/api/',
    loginUrl: 'https://meldekort-api.nav.no/oauth2/login',
    logoutUrl: 'https://meldekort-api.nav.no/oauth2/logout',
    amplitudeUrl: 'amplitude.nav.no/collect',
    amplitudeKey: '913768927b84cde5eac0d0d18c737561',
    testEnv: false,
  };
};

export default Environment;

export function hentEnvSetting(variableName: string) {
  const meldekort = 'meldekort';

  const varName1 = `${variableName}_${Konstanter.pas}`;
  const varName2 = `${variableName}_${Konstanter.use}`;

  const value1 = window[meldekort][varName1];

  const value2 = window[meldekort][varName2];

  return getKey(value1, value2);
}

function getKey(one: string, two: string) {
  return btoa(`${one}:${two}`);
}
