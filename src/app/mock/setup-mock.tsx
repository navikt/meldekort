import FetchMock, { Middleware, MiddlewareUtils } from 'yet-another-fetch-mock';
import Konstanter from '../utils/consts';
import person from './responses/person.json';
import historiskeMeldekort from './responses/historiskemeldekort.json';

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

    fetchMock.get(Konstanter().hentMeldekortApiUri, {
        ...person
    });

    fetchMock.get(Konstanter().hentHistoriskeMeldekortApiUri, historiskeMeldekort);
};