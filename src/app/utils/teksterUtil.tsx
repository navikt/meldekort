import { hentIntl } from "./intlUtil";
import { Meldegruppe } from "../types/meldekort";

export enum TypeYtelse {
  AAP = "-AAP",
  DAGPENGER = "",
  TILTAKSPENGER = "-TP"
}

export const finnTypeYtelsePostfix = (meldegruppe: Meldegruppe): string => {
  if (meldegruppe === Meldegruppe.ATTF) return TypeYtelse.AAP;
  if (meldegruppe === Meldegruppe.INDIV) return TypeYtelse.TILTAKSPENGER;
  return TypeYtelse.DAGPENGER;
};

export const finnesIntlId = (tekstid: string): string => {
  if (hentIntl().messages[tekstid]) {
    return tekstid;
  } else {
    // Returnerer tekstid uten postfix
    return tekstid.split("-")[0];
  }
};
