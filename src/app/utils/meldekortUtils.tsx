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
    for (let i = 0; i < innsendingsklareMeldekort.length; i++) {
      if (harKortStatusOPPRellerSENDT(innsendingsklareMeldekort[i])) {
        if (innsendingsklareMeldekort[i].meldeperiode.kanKortSendes) {
          let rad: MeldekortRad = {
            periode: hentUkePeriode(
              innsendingsklareMeldekort[i].meldeperiode.fra,
              innsendingsklareMeldekort[i].meldeperiode.til
            ),
            dato: hentDatoPeriode(
              innsendingsklareMeldekort[i].meldeperiode.fra,
              innsendingsklareMeldekort[i].meldeperiode.til
            ),
          };
          radliste.push(rad);
        }
      }
    }
  }
  return radliste;
};

export const hentPeriodeDatoKolonner = [
  { key: 'periode', label: 'Periode' },
  { key: 'dato', label: 'Dato' },
];
