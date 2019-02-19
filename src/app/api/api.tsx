import Environment from '../utils/env';
import Konstanter from '../utils/consts';

function sjekkAuthOgRedirect(res: any) {
    if (res.status === 401 || res.status === 403 || (res.status === 0 && !res.ok)) {
        window.location.assign(`${Environment().loginUrl}&redirect=${window.location.origin}` + '/meldekort');
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

export function fetchMeldekort() {
    return getFetchJSONAndCheckForErrors( `${Konstanter().hentMeldekortApiUri}`);
}

export function fetchHistoriskeMeldekort() {
    return getFetchJSONAndCheckForErrors(`${Konstanter().hentHistoriskeMeldekortApiUri}`);
}

export function fetchMeldekortdetaljer(id: number) {
    return getFetchJSONAndCheckForErrors(`${Konstanter().hentMeldekortdetaljerApiUri.replace('{id}', id.toString())}`);
}

export function fetchPersonstatus() {
    return getFetchJSONAndCheckForErrors(`${Konstanter().hentPersonStatusApiUri}`);
}

export function fetchKorrigertId(id: number) {
    return getFetchJSONAndCheckForErrors(`${Konstanter().hentKorrigertMeldekortIdApiUri.replace('{id}', id.toString())}`);
}