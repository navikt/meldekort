// Defining the redux state and constants
import * as actions from '../actions/meldekort';
import { ActionType } from 'typesafe-actions';

// import { DemoActions } when you need to use our actions
export type MeldekortActions = ActionType<typeof actions>;

// state
export interface MeldekortState {
    meldekort: Meldekort[];
}

// CONSTANTS / Action?
export enum Constants {
    LEGG_TIL_MELDEKORT = 'LEGG_TIL_MELDEKORT'
}

// TYPE
export interface Meldekort {
    id: string;
    arbeidet: boolean;
}