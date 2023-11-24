import { KortStatus, KortType } from "../types/meldekort";
import { formatMessage } from "./intlUtil";

export const mapKortStatusTilTekst = (status: KortStatus) => {
  switch (status) {
    case KortStatus.OPPRE:
      return formatMessage("meldekort.status.oppr");
    case KortStatus.SENDT:
      return formatMessage("meldekort.status.sendt");
    case KortStatus.SLETT:
      return formatMessage("meldekort.status.slett");
    case KortStatus.REGIS:
      return formatMessage("meldekort.status.regis");
    case KortStatus.FMOPP:
      return formatMessage("meldekort.status.fmopp");
    case KortStatus.FUOPP:
      return formatMessage("meldekort.status.fuopp");
    case KortStatus.KLAR:
      return formatMessage("meldekort.status.klar");
    case KortStatus.KAND:
      return formatMessage("meldekort.status.klar");
    case KortStatus.IKKE:
      return formatMessage("meldekort.status.ikke");
    case KortStatus.OVERM:
      return formatMessage("meldekort.status.overm");
    case KortStatus.NYKTR:
      return formatMessage("meldekort.status.nyktr");
    case KortStatus.FERDI:
      return formatMessage("meldekort.status.ferdi");
    case KortStatus.FEIL:
      return formatMessage("meldekort.status.feil");
    case KortStatus.OPPF:
      return formatMessage("meldekort.status.oppf");
    case KortStatus.VENTE:
      return formatMessage("meldekort.status.vente");
    case KortStatus.UBEHA:
      return formatMessage("meldekort.status.ubeha");

    default:
      return "Feil i status";
  }
};

export const mapKortTypeTilTekst = (type: KortType) => {
  switch (type) {
    case KortType.RETUR:
      return formatMessage("meldekort.type.retur");
    case KortType.ORDINAER:
      return formatMessage("meldekort.type.ordinar");
    case KortType.ERSTATNING:
      return formatMessage("meldekort.type.erstatning");
    case KortType.ELEKTRONISK:
      return formatMessage("meldekort.type.elektronisk");
    case KortType.AAP:
      return formatMessage("meldekort.type-AAP");
    case KortType.ORDINAER_MANUELL:
      return formatMessage("meldekort.type.ordinarManuell");
    case KortType.MASKINELT_OPPDATERT:
      return formatMessage("meldekort.type.maskineltOppdatert");
    case KortType.MANUELL_ARENA:
      return formatMessage("meldekort.type.manuellArena");
    case KortType.KORRIGERT_ELEKTRONISK:
      return formatMessage("meldekort.type.korrigertElektronisk");

    default:
      return "Feil i korttype";
  }
};
