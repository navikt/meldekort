import { action } from 'typesafe-actions';
import { Constants } from '../types/locales';

export function updateLocale( locale: string ) {
    return action(Constants.UPDATE_LOCALES, {
        locale
    });
}
