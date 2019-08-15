import * as actions from '../actions/locales';
import { ActionType } from 'typesafe-actions';

export type LocalesActions = ActionType<typeof actions>;

export enum Constants {
  UPDATE_LOCALES = 'UPDATE_LOCALES',
}

export enum LocaleEnum {
  en = 'en',
  nb = 'nb',
}
