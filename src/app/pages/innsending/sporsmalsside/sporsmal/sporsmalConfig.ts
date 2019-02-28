export interface Sporsmal {
    kategori: string;
    sporsmal: string;
    ja: string;
    nei: string;
    forklaring: string;
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
            },
            {
                kategori: 'aktivitetArbeid',
                sporsmal: 'sporsmal.aktivitetArbeid',
                ja: 'svar.aktivitetArbeid.ja',
                nei: 'svar.aktivitetArbeid.nei',
                forklaring: 'forklaring.sporsmal.aktivitetArbeid',
            },
            {
                kategori: 'forhindret',
                sporsmal: 'sporsmal.forhindret',
                ja: 'svar.forhindret.ja',
                nei: 'svar.forhindret.nei',
                forklaring: 'forklaring.sporsmal.forhindret',
            },
            {
                kategori: 'ferieFravar',
                sporsmal: 'sporsmal.ferieFravar',
                ja: 'svar.ferieFravar.ja',
                nei: 'svar.ferieFravar.nei',
                forklaring: 'forklaring.sporsmal.ferieFravar',
            },
            {
                kategori: 'registrert',
                sporsmal: 'sporsmal.registrert',
                ja: 'svar.registrert.ja',
                nei: 'svar.registrert.nei',
                forklaring: 'forklaring.sporsmal.registrert',
            },

        ];
    return sporsmalConfig;
};