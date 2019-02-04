
const fetchJson = (url) => {
    const p = new Promise((res, rej) => {
        fetch(url)
            .then((r) => {
                if(r.status !== 200) {
                    rej(new Error("Noe gikk galt med fetch. Status: " + r.status))
                }
                if(!r.ok) {
                    rej(new Error('Error happened on requesting a resource'));
                }
                res(r.json())
            })
            .catch((e) => {
                rej(e)
            })
    });
    return p;
};

const fetchMeldekort = fetchJson('https://meldekort2-q4.nais.oera-q.local/meldekort2/api/person/12345678910/historiskemeldekort');

export default {
    fetchMeldekort,
};
