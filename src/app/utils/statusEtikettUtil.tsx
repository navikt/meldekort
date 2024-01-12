import { KortStatus } from "../types/meldekort";

export const finnRiktigTagVariant = (status: KortStatus): "success" | "info" | "warning" | "error" => {
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
