import { Meldekort, SendtMeldekort } from '../types/meldekort';

export const erMeldekortSendtInnFor = (
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