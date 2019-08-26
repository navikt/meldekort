import {
  KortStatus,
  Meldekort,
  MeldekortRad,
  SendtMeldekort,
} from '../types/meldekort';
import { Innsendingstyper } from '../types/innsending';
import { hentDatoPeriode, hentUkePeriode } from './dates';

export const erMeldekortSendtInnTidligere = (
  meldekort: Meldekort,
  sendteMeldekort: SendtMeldekort[]
): boolean => {
  let kanIkkeSendes = false;
  for (let i = 0; i < sendteMeldekort.length; i++) {
    if (
      sendteMeldekort[i].meldekortId === meldekort.meldekortId &&
      sendteMeldekort[i].kortType === meldekort.kortType
    ) {
      kanIkkeSendes = true;
      i = sendteMeldekort.length;
    }
  }
  return kanIkkeSendes;
};

export const erAktivtMeldekortGyldig = (
  meldekort: Meldekort,
  sendteMeldekort: SendtMeldekort[],
  innsendingsType: Innsendingstyper | null
): boolean => {
  if (innsendingsType === null) {
    return false;
  } else if (innsendingsType === Innsendingstyper.korrigering) {
    return true;
  } else if (meldekort.meldekortId !== 0) {
    return !erMeldekortSendtInnTidligere(meldekort, sendteMeldekort);
  }
  return false;
};

export const erBrukerRegistrertIArena = (
  arbeidssokerStatus: string
): boolean => {
  return !(arbeidssokerStatus === null || arbeidssokerStatus === '');
};

export const harKortStatusOPPRellerSENDT = (meldekort: Meldekort) =>
  meldekort.kortStatus === KortStatus.OPPRE ||
  meldekort.kortStatus === KortStatus.SENDT;

export const hentInnsendingsklareMeldekort = (
  meldekort: Meldekort[],
  sendteMeldekort: SendtMeldekort[]
): Meldekort[] => {
  if (typeof meldekort === 'undefined') {
    return [];
  }
  return meldekort.filter(meldekortObj => {
    if (harKortStatusOPPRellerSENDT(meldekortObj)) {
      if (meldekortObj.meldeperiode.kanKortSendes) {
        return !erMeldekortSendtInnTidligere(meldekortObj, sendteMeldekort);
      }
    }
    return false;
  });
};

export const hentMeldekortRaderFraPerson = (
  innsendingsklareMeldekort: Meldekort[]
): MeldekortRad[] => {
  let radliste: MeldekortRad[] = [];

  if (innsendingsklareMeldekort !== null) {
    const liste = innsendingsklareMeldekort.map(meldekortObj => {
      if (harKortStatusOPPRellerSENDT(meldekortObj)) {
        if (meldekortObj.meldeperiode.kanKortSendes) {
          radliste.push({
            periode: hentUkePeriode(
              meldekortObj.meldeperiode.fra,
              meldekortObj.meldeperiode.til
            ),
            dato: hentDatoPeriode(
              meldekortObj.meldeperiode.fra,
              meldekortObj.meldeperiode.til
            ),
          });
        }
      }
      console.log('liste:', liste);
      // TODO: liste blir undefined. Bytte til for-løkke i stedet for map?
    });
  }
  return radliste;
};
