import { erLocalhost, erMock } from '../mock/utils';
import { Konstanter } from './consts';

type EnvironmentType = {
  minSideUrl: string;
  apiUrl: string;
  loginUrl: string;
  logoutUrl: string;
  amplitudeUrl: string;
  amplitudeKey: string;
};

const Environment = (): EnvironmentType => {
  if (erMock()) {
    return {
      minSideUrl: 'https://www.dev.nav.no/minside/',
      apiUrl: '',
      loginUrl: 'https://loginservice.dev.nav.no/login?level=Level3',
      logoutUrl: 'https://loginservice.dev.nav.no/slo',
      amplitudeUrl: '',
      amplitudeKey: '',
    };
  }

  if (erLocalhost()) {
    return {
      minSideUrl: 'https://www.dev.nav.no/minside/',
      apiUrl: 'http://localhost:8801/meldekort/meldekort-api/api/',
      loginUrl: 'https://loginservice.dev.nav.no/login?level=Level3',
      logoutUrl: 'https://loginservice.dev.nav.no/slo',
      amplitudeUrl: '',
      amplitudeKey: '',
    };
  }

  return {
    minSideUrl: process.env.REACT_APP_MIN_SIDE_URL || 'UNDEFINED_MIN_SIDE_URL',
    apiUrl: process.env.REACT_APP_API_URL || 'UNDEFINED_API_URL',
    loginUrl: process.env.REACT_APP_LOGIN_URL || 'UNDEFINED_LOGIN_URL',
    logoutUrl: process.env.REACT_APP_LOGOUT_URL || 'UNDEFINED_LOGOUT_URL',
    amplitudeUrl:
      process.env.REACT_APP_AMPLITUDE_URL || 'UNDEFINED_AMPLITUDE_URL',
    amplitudeKey:
      process.env.REACT_APP_AMPLITUDE_KEY || 'UNDEFINED_AMPLITUDE_KEY',
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
