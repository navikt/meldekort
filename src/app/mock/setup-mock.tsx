import FetchMock, { Middleware, MiddlewareUtils } from 'yet-another-fetch-mock';
import Konstanter from '../utils/consts';
import person from './responses/person.json';
import historiskeMeldekort from './responses/historiskemeldekort.json';
import meldekortdetaljer from './responses/meldekortdetaljer.json';
import personstatus from './responses/personstatus.json';
import korrigertid from './responses/korrigertid.json';
import valideringsresultat from './responses/valideringsresultat.json';
import meldeperiode from './responses/meldeperiode.json';

export default () => {

    const loggingMiddleware: Middleware = (request, response) => {
        console.log(request.url, response);
        return response;
    };

    const fetchMock = FetchMock.configure({
        enableFallback: true,
        middleware: MiddlewareUtils.combine(
            MiddlewareUtils.delayMiddleware(200),
            MiddlewareUtils.failurerateMiddleware(0.01),
            loggingMiddleware
        )
    });

    console.log('### MOCK AKTIVERT ###');

    fetchMock.get(Konstanter().hentMeldekortApiUri,  {
        ...person
    });

    fetchMock.get(Konstanter().hentHistoriskeMeldekortApiUri, historiskeMeldekort);

    fetchMock.get(Konstanter().hentMeldekortdetaljerApiUri, {
        ...meldekortdetaljer
    });

    fetchMock.get(Konstanter().hentPersonStatusApiUri, {
        ...personstatus
    });

    fetchMock.get(Konstanter().hentKorrigertMeldekortIdApiUri, korrigertid);

    fetchMock.post(Konstanter().sendMeldekortApiUri, {
        ...valideringsresultat
    });

    fetchMock.post(Konstanter().sendMeldeformApiUri, {
        ...meldeperiode
    });

};