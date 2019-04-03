import Environment from '../utils/env';
import Konstanter from '../utils/consts';
import { erMock } from '../mock/utils';
import { MeldeformDetaljerInn, Meldeperiode, Person, PersonStatus } from '../types/person';
import { prefferedAxios } from '../types/fetch';
import { Meldekort, Meldekortdetaljer, MeldekortdetaljerInnsending, ValideringsResultat } from '../types/meldekort';
import { AxiosResponse } from 'axios';

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

const fetchPost = async (url: string, data: any) => {
    if (erMock()) {
        return fetch(url, {method: 'POST', body: data}).then(response => {return response.json(); });
    } else {
        return prefferedAxios.post(Environment().apiUrl + url, data, {
            headers: {
                'Content-Type': 'application/json;charset=UTF-8',
            },
            withCredentials: true
        }).then((response: AxiosResponse<ValideringsResultat>) => {
            return response.data;
        });
    }
}

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

export function postMeldekort(meldekortdetaljer: MeldekortdetaljerInnsending): Promise<ValideringsResultat> {
    return fetchPost(Konstanter().sendMeldekortApiUri, meldekortdetaljer);
}

export function postEndreMeldeform(meldeformdetaljer: MeldeformDetaljerInn): Promise<Meldeperiode> {
    return fetchPost(Konstanter().sendMeldeformApiUri, meldeformdetaljer);
}

function addIdToUrlIfNotMock(url: string, id: number): string {
    if (!erMock()) {
        return url.replace('{id}', id.toString());
    }
    return url;
}