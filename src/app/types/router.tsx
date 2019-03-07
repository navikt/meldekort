export interface Router {
    location: {
        pathname: string;
    };
}

export enum innsendingsTyper {
    innsending = 'innsending',
    korrigering = 'korrigering',
    etterregistrering = 'etterregistrering',
}
