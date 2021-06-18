import { hentIntl } from './intlUtil';
import { Meldegruppe } from '../types/meldekort';

export enum TypeYtelse {
  'AAP' = '-AAP',
  'DAGPENGER' = '',
  'TILTAKSPENGER' = '-TP',
}

export const finnTypeYtelse = (meldegruppe: Meldegruppe): string => {
  // Da er det mulig å sjekke alt her og returnere TypeYtelse, eller bedre å si tilsvarende postfix
  return meldegruppe === Meldegruppe.ATTF
    ? TypeYtelse.AAP
    : TypeYtelse.DAGPENGER;
};

export const finnesIntlId = (tekstid: string): string => {
  if (hentIntl().formatMessage({ id: tekstid }) !== tekstid) {
    return tekstid;
  } else {
    return tekstid.slice(0, -4);
  }
};
