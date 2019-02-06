import Environment from '../utils/env';
import Konstanter from '../utils/consts'

function sjekkAuthOgRedirect(res) {
    if (res.status === 401 || res.status === 403 || (res.status === 0 && !res.ok)) {
        window.location.assign(`${Environment().loginUrl}?redirect=${window.location.href}`);
        return false;
    }
    return true;
}

const fetchJSONAndCheckForErrors = (url) => {
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

export const hentMeldekort = () => fetchJSONAndCheckForErrors( `${Konstanter().hentMeldekortApiUri}`);
export const hentHistoriskeMeldekort = () => fetchJSONAndCheckForErrors(`${Konstanter().hentHistoriskeMeldekortApiUri}`);
export const hentMeldekortdetaljer = (id) => fetchJSONAndCheckForErrors(`${Konstanter().hentMeldekortdetaljerApiUri.replace('{id}', id)}`);
export const hentPersonstatus = () => fetchJSONAndCheckForErrors(`${Konstanter().hentPersonStatusApiUri}`);
export const hentKorrigertId = (id) => fetchJSONAndCheckForErrors(`${Konstanter().hentKorrigertMeldekortIdApiUri.replace('{id}', id)}`);