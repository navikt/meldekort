import {
  KortStatus,
  Meldekort,
  MeldekortRad,
  SendtMeldekort,
} from '../types/meldekort';
import { Innsendingstyper } from '../types/innsending';
import { hentDatoPeriode, hentUkePeriode } from './dates';
import { isEmpty } from 'ramda';
import { Person } from '../types/person';

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
  } else if (innsendingsType === Innsendingstyper.KORRIGERING) {
    return true;
  } else if (meldekort.meldekortId !== 0) {
    return !erMeldekortSendtInnTidligere(meldekort, sendteMeldekort);
  }
  return false;
};

export const erBrukerRegistrertIArena = (
  arbeidssokerStatus: string
): boolean => {
  return !(arbeidssokerStatus == null || arbeidssokerStatus === '');
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

  return radliste;
};

export const meldekortSomKanSendes = (
  meldekortListe: Meldekort[],
  sendteMeldekort: SendtMeldekort[]
): Meldekort[] => {
  return meldekortListe.filter(meldekort => {
    let kanSendes = meldekort.meldeperiode.kanKortSendes;
    if (kanSendes) {
      kanSendes = !erMeldekortSendtInnTidligere(meldekort, sendteMeldekort);
    }
    return kanSendes;
  });
};

const hentMeldekortSomIkkeKanSendesEnda = (
  meldekortListe: Meldekort[]
): Meldekort[] => {
  return meldekortListe.filter(
    meldekort =>
      (meldekort.kortStatus === KortStatus.SENDT ||
        meldekort.kortStatus === KortStatus.OPPRE) &&
      !meldekort.meldeperiode.kanKortSendes
  );
};

export const nesteMeldekortKanSendes = (
  nesteAktivtMeldekort: Meldekort | undefined,
  innsendingstype: Innsendingstyper | null,
  person: Person
): Date | null => {
  if (nesteAktivtMeldekort !== undefined) {
    return nesteAktivtMeldekort.meldeperiode.kortKanSendesFra;
  } else if (
    innsendingstype === Innsendingstyper.INNSENDING &&
    person.meldekort.length > 0
  ) {
    let mkListe = hentMeldekortSomIkkeKanSendesEnda(person.meldekort);
    if (mkListe.length > 0) {
      return mkListe[0].meldeperiode.kortKanSendesFra;
    }
  }

  return null;
};

export const returnerMeldekortListaMedFlereMeldekortIgjen = (
  meldekort1: Meldekort[],
  innsendingstype1: Innsendingstyper,
  meldekort2: Meldekort[],
  innsendingstype2: Innsendingstyper
) => {
  let nesteAktivtMeldekort, nesteInnsendingstype;

  if (!isEmpty(meldekort1)) {
    nesteAktivtMeldekort = meldekort1[0];
    nesteInnsendingstype = innsendingstype1;
  } else {
    nesteAktivtMeldekort = meldekort2[0];
    nesteInnsendingstype = innsendingstype2;
  }
  return {
    nesteAktivtMeldekort: nesteAktivtMeldekort,
    nesteInnsendingstype: nesteInnsendingstype,
  };
};

export const hentPeriodeDatoKolonner = [
  { key: 'periode', label: 'Periode' },
  { key: 'dato', label: 'Dato' },
];
