import { Meldekort, SendtMeldekort } from '../types/meldekort';

export const erMeldekortSendtInnFor = (
    meldekort: Meldekort,
    sendteMeldekort: SendtMeldekort[]): boolean => {

    let kanSendes = true;
    for (let i = 0; i < sendteMeldekort.length; i++) {
        if (sendteMeldekort[i].meldekortId === meldekort.meldekortId && sendteMeldekort[i].kortType === meldekort.kortType) {
            kanSendes = false;
            i = sendteMeldekort.length;
        }
    }
    return kanSendes;
};