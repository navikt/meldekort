import { erLocalhost, erMock } from '../mock/utils';
import { Konstanter } from './consts';

const Environment = () => {
  if (
    window.location.hostname.indexOf('meldekort-frontend-q0.dev.nav.no') > -1
  ) {
    return {
      dittNavUrl: 'https://www.dev.nav.no/person/dittnav',
      apiUrl:
        'https://meldekort-api-q0.dev.nav.no/meldekort/meldekort-api/api/',
      loginUrl: 'https://meldekort-api-q0.dev.nav.no/oauth2/login',
      logoutUrl: 'https://meldekort-api-q0.dev.nav.no/oauth2/logout',
      amplitudeUrl: 'amplitude.nav.no/collect',
      amplitudeKey: '2f190e67f31d7e4719c5ff048ad3d3e6',
    };
  } else if (
    window.location.hostname.indexOf('meldekort-frontend-q1.dev.nav.no') > -1
  ) {
    return {
      dittNavUrl: 'https://www-q1.nav.no/person/dittnav',
      apiUrl:
        'https://meldekort-api-q1.dev.nav.no/meldekort/meldekort-api/api/',
      loginUrl: 'https://meldekort-api-q1.dev.nav.no/oauth2/login',
      logoutUrl: 'https://meldekort-api-q1.dev.nav.no/oauth2/logout',
      amplitudeUrl: 'amplitude.nav.no/collect',
      amplitudeKey: '2f190e67f31d7e4719c5ff048ad3d3e6',
    };
  } else if (erMock()) {
    return {
      dittNavUrl: 'https://www.nav.no/person/dittnav',
      apiUrl: '',
      loginUrl: 'https://loginservice-q.nav.no/login?level=Level3',
      logoutUrl: 'https://loginservice-q.nav.no/slo',
    };
  } else if (erLocalhost()) {
    return {
      dittNavUrl: 'https://www.nav.no/person/dittnav',
      apiUrl: 'http://localhost:8801/meldekort/meldekort-api/api/',
      loginUrl: 'https://loginservice-q.nav.no/login?level=Level3',
      logoutUrl: 'https://loginservice-q.nav.no/slo',
    };
  }
  return {
    dittNavUrl: 'https://www.nav.no/person/dittnav',
    apiUrl: 'https://www.nav.no/meldekort/meldekort-api/api/',
    loginUrl: 'https://meldekort-api.nav.no/oauth2/login',
    logoutUrl: 'https://meldekort-api.nav.no/oauth2/logout',
    amplitudeUrl: 'amplitude.nav.no/collect',
    amplitudeKey: 'b0bccdd4dd75081606ef7bcab668a7ed',
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
