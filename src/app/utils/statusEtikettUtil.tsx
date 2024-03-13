import { KortStatus, KortType } from "../types/meldekort";

export const finnRiktigTagVariant = (status: KortStatus, kortType: KortType): "success" | "info" | "warning" | "error" | "alt3" => {
  if (kortType === KortType.KORRIGERT_ELEKTRONISK && status === KortStatus.IKKE) return "alt3";

  switch (status) {
    case KortStatus.KLAR:
      return "warning";
    case KortStatus.REGIS:
    case KortStatus.NYKTR:
    case KortStatus.UBEHA:
      return "info";
    case KortStatus.FERDI:
    case KortStatus.IKKE:
    case KortStatus.OVERM:
      return "success";
    default:
      return "error";
  }
};
