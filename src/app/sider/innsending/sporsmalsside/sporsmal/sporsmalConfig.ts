export interface Sporsmal {
    kategori: string;
    sporsmal: string;
    ja: string;
    nei: string;
    forklaring: string;
    checked: string | undefined;
}

export const hentSporsmalConfig = () => {
    const sporsmalConfig: Sporsmal[] =
        [
            {
                kategori: 'arbeid',
                sporsmal: 'sporsmal.arbeid',
                ja: 'svar.arbeid.ja',
                nei: 'svar.arbeid.nei',
                forklaring: 'forklaring.sporsmal.arbeid',
                checked: undefined
            },
            {
                kategori: 'aktivitetArbeid',
                sporsmal: 'sporsmal.aktivitetArbeid',
                ja: 'svar.aktivitetArbeid.ja',
                nei: 'svar.aktivitetArbeid.nei',
                forklaring: 'forklaring.sporsmal.aktivitetArbeid',
                checked: undefined
            },
            {
                kategori: 'forhindret',
                sporsmal: 'sporsmal.forhindret',
                ja: 'svar.forhindret.ja',
                nei: 'svar.forhindret.nei',
                forklaring: 'forklaring.sporsmal.forhindret',
                checked: undefined
            },
            {
                kategori: 'ferieFravar',
                sporsmal: 'sporsmal.ferieFravar',
                ja: 'svar.ferieFravar.ja',
                nei: 'svar.ferieFravar.nei',
                forklaring: 'forklaring.sporsmal.ferieFravar',
                checked: undefined
            },
            {
                kategori: 'registrert',
                sporsmal: 'sporsmal.registrert',
                ja: 'svar.registrert.ja',
                nei: 'svar.registrert.nei',
                forklaring: 'forklaring.sporsmal.registrert',
                checked: undefined
            },

        ];
    return sporsmalConfig;
};