import { MenyPunkt } from '../utils/menyConfig';

export interface MenyState {
    valgtMenyPunkt: MenyPunkt;
    alleMenyPunkter: MenyPunkt[];
}

export enum MenyTypeKeys {
    SETT_VALGT_MENYPUNKT = 'SETT_VALGT_MENYPUNKT',
    SETT_AKTIVE_MENYPUNKTER = 'SETT_AKTIVE_MENYPUNKTER'
}