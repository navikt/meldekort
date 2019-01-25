export interface Tab {
    urlparam: string;
    tittel: string;
    disabled: boolean;
}

export const hentTabConfig = () => {
    const tabConfig: Tab[] =
        [
            {
                tittel: 'Send meldekort',
                urlparam: '/send-meldekort',
                disabled: false,
            },
            {
                tittel: 'Tidligere meldekort',
                urlparam: '/tidligere-meldekort',
                disabled: false,
            },
            {
                tittel: 'Etterregistrering av meldekort',
                urlparam: '/etterregistrering',
                disabled: true,
            },
            {
                tittel: 'Om meldekort',
                urlparam: '/om-meldekort',
                disabled: false,
            },
            {
                tittel: 'Ofte stilte spørsmål',
                urlparam: '/ofte-stilte-sporsmal',
                disabled: false,
            }
        ];
    return tabConfig;
};