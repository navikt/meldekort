import { hentIntl } from './intlUtil';

export const hentAapStreng = (erAap: boolean): string => {
  return erAap ? '-AAP' : '';
};

export const finnesIntlId = (tekstid: string): string => {
  if (hentIntl().formatMessage({ id: tekstid }) !== tekstid) {
    return tekstid;
  } else {
    return tekstid.slice(0, -4);
  }
};
