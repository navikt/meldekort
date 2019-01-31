import { action } from 'typesafe-actions';
import { Constants, LocaleEnum } from '../types/locales';

export function updateLocale( locale: LocaleEnum ) {
    return action(Constants.UPDATE_LOCALES, {
        locale
    });
}
