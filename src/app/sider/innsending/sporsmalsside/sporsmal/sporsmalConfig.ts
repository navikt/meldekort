export interface FeilSpm {
    erFeil: boolean;
    feilmeldingId: string;
}

export interface Sporsmal {
    kategori: string;
    sporsmal: string;
    ja: string;
    nei: string;
    forklaring: string;
    feil: FeilSpm;
    checked: string | undefined;
}

export const hentSporsmalConfig = () => {
    return [
        {
            kategori: 'arbeid',
            sporsmal: 'sporsmal.arbeid',
            ja: 'svar.arbeid.ja',
            nei: 'svar.arbeid.nei',
            forklaring: 'forklaring.sporsmal.arbeid',
            checked: undefined,
            feil: {
                erFeil: false,
                feilmeldingId: 'arbeidet.required'
            }
        },
        {
            kategori: 'aktivitetArbeid',
            sporsmal: 'sporsmal.aktivitetArbeid',
            ja: 'svar.aktivitetArbeid.ja',
            nei: 'svar.aktivitetArbeid.nei',
            forklaring: 'forklaring.sporsmal.aktivitetArbeid',
            checked: undefined,
            feil: {
                erFeil: false,
                feilmeldingId: 'kurs.required'
            },
        },
        {
            kategori: 'forhindret',
            sporsmal: 'sporsmal.forhindret',
            ja: 'svar.forhindret.ja',
            nei: 'svar.forhindret.nei',
            forklaring: 'forklaring.sporsmal.forhindret',
            checked: undefined,
            feil: {
                erFeil: false,
                feilmeldingId: 'syk.required'
            },
        },
        {
            kategori: 'ferieFravar',
            sporsmal: 'sporsmal.ferieFravar',
            ja: 'svar.ferieFravar.ja',
            nei: 'svar.ferieFravar.nei',
            forklaring: 'forklaring.sporsmal.ferieFravar',
            checked: undefined,
            feil: {
                erFeil: false,
                feilmeldingId: 'annetFravar.required'
            },
        },
        {
            kategori: 'registrert',
            sporsmal: 'sporsmal.registrert',
            ja: 'svar.registrert.ja',
            nei: 'svar.registrert.nei',
            forklaring: 'forklaring.sporsmal.registrert',
            checked: undefined,
            feil: {
                erFeil: false,
                feilmeldingId: 'fortsetteRegistrert.required'
            },
        },

    ];
};