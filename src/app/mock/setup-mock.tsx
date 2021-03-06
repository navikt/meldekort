import { prefferedAxios } from '../types/fetch';
import { Konstanter } from '../utils/consts';
import person from './responses/person.json';
import historiskeMeldekort from './responses/historiskemeldekort.json';
import meldekortdetaljer from './responses/meldekortdetaljer.json';
import personstatus from './responses/personstatus.json';
import korrigertid from './responses/korrigertid.json';
import valideringsresultat from './responses/valideringsresultat.json';
import personinfo from './responses/personinfo.json';
import infomelding from './responses/infomelding.json';
import pingWeblogicJson from './responses/pingWeblogic.json';
import MockAdapter from 'axios-mock-adapter';
import Environment from '../utils/env';

export default () => {
  const apiUrl = Environment().apiUrl;

  let mock = new MockAdapter(prefferedAxios);

  console.log('### MOCK AKTIVERT ###');

  mock.onGet(apiUrl + Konstanter().hentMeldekortApiUri).reply(200, {
    ...person,
  });

  mock
    .onGet(apiUrl + Konstanter().hentHistoriskeMeldekortApiUri)
    .reply(200, historiskeMeldekort);

  mock.onGet(apiUrl + Konstanter().hentMeldekortdetaljerApiUri).reply(200, {
    ...meldekortdetaljer,
  });

  mock.onGet(apiUrl + Konstanter().hentPersonStatusApiUri).reply(200, {
    ...personstatus,
  });

  mock.onGet(apiUrl + Konstanter().hentPersonInfoApiUri).reply(200, {
    ...personinfo,
  });

  mock
    .onGet(apiUrl + Konstanter().hentKorrigertMeldekortIdApiUri)
    .reply(200, korrigertid);

  mock.onGet(apiUrl + Konstanter().hentInfomelding).reply(200, {
    ...infomelding,
  });

  mock.onGet(apiUrl + Konstanter().pingWeblogic).reply(200, {
    ...pingWeblogicJson,
  });

  mock.onPost(apiUrl + Konstanter().sendMeldekortApiUri).reply(200, {
    ...valideringsresultat,
  });
};
