import { hentIntl } from './intlUtil';

export const hentAapStreng = (erAap: boolean): string => {
  return erAap ? '-AAP' : '';
};

export const finnesIntlId = (id: string) => {
  if (hentIntl().formatMessage({ id: id }) !== id) {
    return id;
  } else {
    return id.slice(0, -4);
  }
};
