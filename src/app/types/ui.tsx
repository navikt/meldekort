export interface ModalKnapp {
  action: () => void;
  label: string;
  type: "standard" | "hoved" | "fare" | "flat";
}

export interface IModal {
  content: () => React.ReactNode;
  knapper?: ModalKnapp[];
  onRequestClose?: () => void;
  visModal: boolean;
}

export interface BaksystemFeilmelding {
  content: () => React.ReactNode;
  visFeilmelding: boolean;
}

export interface IngenTidligereMeldekort {
  harTidligereMeldekort: boolean;
}
