export interface ModalKnapp {
    action: Function;
    label: string;
    type: 'standard' | 'hoved' | 'fare' | 'flat';
}

export interface IModal {
    content: () => React.ReactNode;
    knapper?: ModalKnapp[];
    onRequestClose?: Function;
    visModal: boolean;
}

export interface BaksystemFeilmelding {
    content: () => React.ReactNode;
    visFeilmelding: boolean;
}

export interface IngenTidligereMeldekort {
    harTidligereMeldekort: boolean;
}