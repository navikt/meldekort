
// TODO: Endres når vi vet mer om fargekodene.
export const finnRiktigEtikettType = (statustekst: string) => {
    if (statustekst == null) {
        return 'info';
    }
    let status = statustekst.trim();
    if (status === 'Klar til beregning' || status === 'Til manuell saksbehandling') {
        return 'fokus';
    } else if (status === 'Kortet er beregnet') {
        return 'suksess';
    } else {
        return 'info';
    }
};

export const HvisIngenBeregningSettBlaEtikett = (statustekst: string) => {
    if (statustekst == null) {
        return '';
    }
    if (statustekst.trim() === 'Ingen beregning')  {
        return 'blaEtikett';
    } else {
        return '';
    }
};