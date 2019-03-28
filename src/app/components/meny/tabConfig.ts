export interface Tab {
    urlparam: string;
    tekstid: string;
    tittel: string;
    disabled: boolean;
}

export const hentTabConfig = () => {
    const tabConfig: Tab[] =
        [
            {
                tekstid: 'sekundarmeny.send',
                tittel: 'sendMeldekort',
                urlparam: '/send-meldekort',
                disabled: false,
            },
            {
                tekstid: 'sekundarmeny.tidligere',
                tittel: 'tidligereMeldekort',
                urlparam: '/tidligere-meldekort',
                disabled: false,
            },
            {
                tekstid: 'sekundarmeny.etterregistrer',
                tittel: 'etterregistrering',
                urlparam: '/etterregistrer-meldekort',
                disabled: true,
            },
            {
                tekstid: 'sekundarmeny.endreMeldeform',
                tittel: 'endreMeldeform',
                urlparam: '/endre-meldeform',
                disabled: true,
            },
            {
                tekstid: 'sekundarmeny.omMeldekort',
                tittel: 'omMeldekort',
                urlparam: '/om-meldekort',
                disabled: false,
            },
            {
                tekstid: 'sekundarmeny.faq',
                tittel: 'ofteStilteSporsmal',
                urlparam: '/ofte-stilte-sporsmal',
                disabled: false,
            }
        ];
    return tabConfig;
};