// Defining the redux state and constants
import * as actions from '../actions/locales';
import { ActionType } from 'typesafe-actions';

export type LocalesActions = ActionType<typeof actions>;

// CONSTANTS / Action?
export enum Constants {
    UPDATE_LOCALES = 'UPDATE_LOCALES'

}