export interface Tab {
    urlparam: string;
    tittel: string;
    disabled: boolean;
}

export const hentTabConfig = () => {
    const tabConfig: Tab[] =
        [
            {
                tittel: 'sekundarmeny.send',
                urlparam: '/send-meldekort',
                disabled: false,
            },
            {
                tittel: 'sekundarmeny.tidligere',
                urlparam: '/tidligere-meldekort',
                disabled: false,
            },
            {
                tittel: 'sekundarmeny.etterregistrer',
                urlparam: '/etterregistrering',
                disabled: true,
            },
            {
                tittel: 'sekundarmeny.endreMeldeform',
                urlparam: '/endre-meldeform',
                disabled: true,
            },
            {
                tittel: 'sekundarmeny.omMeldekort',
                urlparam: '/om-meldekort',
                disabled: false,
            },
            {
                tittel: 'sekundarmeny.faq',
                urlparam: '/ofte-stilte-sporsmal',
                disabled: false,
            }
        ];
    return tabConfig;
};