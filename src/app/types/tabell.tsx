
export enum status_UnderBehandling {
    tilManuell = 'til manuell',
    tilBeregning = 'til beregning',
}
export enum status_Ferdig {
    tilManuell = 'behandlet',
    tilBeregning = 'ferdig',
}
export enum status_Ubehandlet {
    tilManuell = 'ubehandlet',
    tilBeregning = 'ferdig',
}

export interface TidligereMeldekortTabell {
    // TODO:endre siste string til Date type senere

}
export interface SendMeldekortTabell {

}