import { hentIntl } from './intlUtil';

export function hentTekster(tekstId: string, erAap: boolean) {
    if (erAap) {
        return hentIntl().formatMessage({id: tekstId + '-AAP'});
    } else {
        return hentIntl().formatMessage({id: tekstId});
    }
}