import { KortStatus } from "../types/meldekort";
import { formaterBelop } from "./numberFormat";

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

export const finnRiktigBeloepVariant = (status: KortStatus, bruttoBelop: number | undefined): string => {
  switch (status) {
    case KortStatus.KLAR:
    case KortStatus.REGIS:
    case KortStatus.NYKTR:
    case KortStatus.UBEHA:
      return "";
    case KortStatus.FERDI:
    case KortStatus.IKKE:
    case KortStatus.OVERM:
      return formaterBelop(bruttoBelop);
    default:
      return "";
  }
};
