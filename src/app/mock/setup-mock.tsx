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
import skrivemodusJson from './responses/skrivemodus.json';
import teksterJsonNb from './responses/tekster_nb.json';
import teksterJsonEn from './responses/tekster_en.json';
import MockAdapter from 'axios-mock-adapter';
import Environment from '../utils/env';

export default () => {
  const apiUrl = Environment().apiUrl;

  let mock = new MockAdapter(prefferedAxios);

  console.log('### MOCK AKTIVERT ###');

  mock.onGet(apiUrl + Konstanter.hentMeldekortApiUri).reply(200, {
    ...person,
  });

  mock
    .onGet(apiUrl + Konstanter.hentHistoriskeMeldekortApiUri)
    .reply(200, historiskeMeldekort);

  mock.onGet(apiUrl + Konstanter.hentMeldekortdetaljerApiUri).reply(200, {
    ...meldekortdetaljer,
  });

  mock.onGet(apiUrl + Konstanter.hentPersonStatusApiUri).reply(200, {
    ...personstatus,
  });

  mock.onGet(apiUrl + Konstanter.hentPersonInfoApiUri).reply(200, {
    ...personinfo,
  });

  mock
    .onGet(apiUrl + Konstanter.hentKorrigertMeldekortIdApiUri)
    .reply(200, korrigertid);

  mock.onGet(apiUrl + Konstanter.hentInfomelding).reply(200, {
    ...infomelding,
  });

  mock.onGet(apiUrl + Konstanter.hentSkrivemodus).reply(200, {
    ...skrivemodusJson,
  });

  mock.onPost(apiUrl + Konstanter.sendMeldekortApiUri).reply(200, {
    ...valideringsresultat,
  });

  const urlNb = new RegExp(
    `${apiUrl + Konstanter.hentAlleTekster}\\?sprak=nb.*`
  );
  mock.onGet(urlNb).reply(200, {
    ...teksterJsonNb,
  });

  const urlEn = new RegExp(
    `${apiUrl + Konstanter.hentAlleTekster}\\?sprak=en.*`
  );
  mock.onGet(urlEn).reply(200, {
    ...teksterJsonEn,
  });
};
