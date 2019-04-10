import { MenyPunkt } from '../utils/menyConfig';

export interface MenyState {
    valgtMenyPunkt: MenyPunkt;
    aktiveMenyPunkter: MenyPunkt[];
    menyConfig: MenyPunkt[];
}

export enum MenyTypeKeys {
    SETT_VALGT_MENYPUNKT = 'SETT_VALGT_MENYPUNKT',
    SETT_AKTIVE_MENYPUNKTER = 'SETT_AKTIVE_MENYPUNKTER'
}