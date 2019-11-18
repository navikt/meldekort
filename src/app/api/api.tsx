import Environment from '../utils/env';
import { Konstanter } from '../utils/consts';
import { erMock } from '../mock/utils';
import {
  MeldeformDetaljerInn,
  Meldeperiode,
  Person,
  PersonInfo,
  PersonStatus,
} from '../types/person';
import { prefferedAxios } from '../types/fetch';
import {
  Infomelding,
  Meldekort,
  Meldekortdetaljer,
  MeldekortdetaljerInnsending,
  ValideringsResultat,
} from '../types/meldekort';
import { WeblogicPing } from '../types/weblogic';

const fetchGet = async (url: string) => {
  return prefferedAxios
    .get(Environment().apiUrl + url, {
      headers: {
        'Content-Type': 'application/json;charset=UTF-8',
      },
      withCredentials: true,
    })
    .then(response => {
      return response.data;
    });
};

const fetchPost = async (url: string, data: any) => {
  return prefferedAxios
    .post(Environment().apiUrl + url, data, {
      headers: {
        'Content-Type': 'application/json;charset=UTF-8',
      },
      withCredentials: true,
    })
    .then(response => {
      return response.data;
    });
};

export const fetchMeldekort = (): Promise<Person> => {
  return fetchGet(Konstanter().hentMeldekortApiUri);
};

export function fetchHistoriskeMeldekort(): Promise<Meldekort[]> {
  return fetchGet(Konstanter().hentHistoriskeMeldekortApiUri);
}

export function fetchMeldekortdetaljer(id: number): Promise<Meldekortdetaljer> {
  return fetchGet(
    addIdToUrlIfNotMock(Konstanter().hentMeldekortdetaljerApiUri, id)
  );
}

export function fetchPersonstatus(): Promise<PersonStatus> {
  return fetchGet(Konstanter().hentPersonStatusApiUri);
}

export function fetchPersoninfo(): Promise<PersonInfo> {
  return fetchGet(Konstanter().hentPersonInfoApiUri);
}

export function fetchKorrigertId(id: number): Promise<number> {
  return fetchGet(
    addIdToUrlIfNotMock(Konstanter().hentKorrigertMeldekortIdApiUri, id)
  );
}

export function fetchInfomelding(): Promise<Infomelding> {
  return fetchGet(Konstanter().hentInfomelding);
}

export function pingWeblogic(): Promise<WeblogicPing> {
  return fetchGet(Konstanter().pingWeblogic);
}

export function postMeldekort(
  meldekortdetaljer: MeldekortdetaljerInnsending
): Promise<ValideringsResultat> {
  console.log('Her kommer meldekortdetaljer');
  console.log(JSON.stringify(meldekortdetaljer));
  return fetchPost(Konstanter().sendMeldekortApiUri, meldekortdetaljer);
}

export function postEndreMeldeform(
  meldeformdetaljer: MeldeformDetaljerInn
): Promise<Meldeperiode> {
  return fetchPost(Konstanter().sendMeldeformApiUri, meldeformdetaljer);
}

function addIdToUrlIfNotMock(url: string, id: number): string {
  if (!erMock()) {
    return url.replace('{id}', id.toString());
  }
  return url;
}
