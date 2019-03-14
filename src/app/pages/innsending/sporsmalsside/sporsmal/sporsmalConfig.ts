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
            feil: {
                erFeil: false,
                feilmeldingId: 'arbeidet.required'
            },
            checked: undefined
        },
        {
            kategori: 'aktivitetArbeid',
            sporsmal: 'sporsmal.aktivitetArbeid',
            ja: 'svar.aktivitetArbeid.ja',
            nei: 'svar.aktivitetArbeid.nei',
            forklaring: 'forklaring.sporsmal.aktivitetArbeid',
            feil: {
                erFeil: false,
                feilmeldingId: 'kurs.required'
            },
            checked: undefined
        },
        {
            kategori: 'forhindret',
            sporsmal: 'sporsmal.forhindret',
            ja: 'svar.forhindret.ja',
            nei: 'svar.forhindret.nei',
            forklaring: 'forklaring.sporsmal.forhindret',
            feil: {
                erFeil: false,
                feilmeldingId: 'syk.required'
            },
            checked: undefined
        },
        {
            kategori: 'ferieFravar',
            sporsmal: 'sporsmal.ferieFravar',
            ja: 'svar.ferieFravar.ja',
            nei: 'svar.ferieFravar.nei',
            forklaring: 'forklaring.sporsmal.ferieFravar',
            feil: {
                erFeil: false,
                feilmeldingId: 'annetFravar.required'
            },
            checked: undefined
        },
        {
            kategori: 'registrert',
            sporsmal: 'sporsmal.registrert',
            ja: 'svar.registrert.ja',
            nei: 'svar.registrert.nei',
            forklaring: 'forklaring.sporsmal.registrert',
            feil: {
                erFeil: false,
                feilmeldingId: 'fortsetteRegistrert.required'
            },
            checked: undefined
        },

    ];
};