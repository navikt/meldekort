import Environment from '../utils/env';
import Konstanter from '../utils/consts';
import { erMock } from '../mock/utils';
import { Person, PersonStatus } from '../types/person';
import { prefferedAxios } from '../types/fetch';
import { Meldekort, Meldekortdetaljer } from '../types/meldekort';

function sjekkAuthOgRedirect(res: any) {
    if (res.status === 401 || res.status === 403 || (res.status === 0 && !res.ok)) {
        window.location.assign(`${Environment().loginUrl}&redirect=${window.location.origin}` + '/meldekort');
        return false;
    } else if (res.status === 500) {
        // Her må det settes en feilmelding
        return false;
    }
    return true;
}

const getFetchJSONAndCheckForErrors = (url: string) => {
    const p = new Promise((res, rej) => {
         fetch(`${Environment().apiUrl}` + url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json;charset=UTF-8',
            },
            credentials: 'include',
        }).then((response) => {
            sjekkAuthOgRedirect(response);
            if (response.status === 200) {
                res(response.json());
            } else {
                res({ status: response.status });
            }
        })
            .catch((e) => {
                rej(e);
            });
    });
    return p;
};

const fetchGet = async (url: string) => {
    if (erMock()) {
        return fetch(Environment().apiUrl + url).then(response => {return response.json(); });
    } else {
        return prefferedAxios.get(Environment().apiUrl + url, {
            headers: {
                'Content-Type': 'application/json;charset=UTF-8',
            },
            withCredentials: true
        }).then(response => {
            return response.data;
        });
    }
};

export const fetchMeldekort = (): Promise<Person> => {
    return fetchGet(Konstanter().hentMeldekortApiUri);
};

export function fetchHistoriskeMeldekort(): Promise<Meldekort[]> {
    return fetchGet(Konstanter().hentHistoriskeMeldekortApiUri);
}

export function fetchMeldekortdetaljer(id: number): Promise<Meldekortdetaljer> {
    return fetchGet(addIdToUrlIfNotMock(Konstanter().hentMeldekortdetaljerApiUri, id));
}

export const fetchPersonstatus = (): Promise<PersonStatus> => {
    return fetchGet(Konstanter().hentPersonStatusApiUri);
};

export function fetchKorrigertId(id: number): Promise<number> {
    return fetchGet(addIdToUrlIfNotMock(Konstanter().hentKorrigertMeldekortIdApiUri, id));
}

function addIdToUrlIfNotMock(url: string, id: number): string {
    if (!erMock()) {
        return url.replace('{id}', id.toString());
    }
    return url;
}