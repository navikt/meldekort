import { Meldekort, SendtMeldekort } from '../types/meldekort';
import { Innsendingstyper } from '../types/innsending';

export const erMeldekortSendtInnTidligere = (
    meldekort: Meldekort,
    sendteMeldekort: SendtMeldekort[]): boolean => {

    let kanIkkeSendes = false;
    for (let i = 0; i < sendteMeldekort.length; i++) {
        if (sendteMeldekort[i].meldekortId === meldekort.meldekortId && sendteMeldekort[i].kortType === meldekort.kortType) {
            kanIkkeSendes = true;
            i = sendteMeldekort.length;
        }
    }
    return kanIkkeSendes;
};

export const erAktivtMeldekortGyldig = (
    meldekort: Meldekort,
    sendteMeldekort: SendtMeldekort[],
    innsendingsType: Innsendingstyper | null): boolean => {
    if (innsendingsType === null) {
        return false;
    } else if (innsendingsType === Innsendingstyper.korrigering) {
        return true;
    } else if (meldekort.meldekortId !== 0) {
        return !erMeldekortSendtInnTidligere(meldekort, sendteMeldekort);
    }
    return false;
};

export const erBrukerRegistrertIArena = (arbeidssokerStatus: string): boolean => {
    return !(arbeidssokerStatus === null || arbeidssokerStatus === '');
};