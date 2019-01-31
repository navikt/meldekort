// Defining the redux state and constants
import * as actions from '../actions/demo';
import { ActionType } from 'typesafe-actions';

// import { DemoActions } when you need to use our actions
export type DemoActions = ActionType<typeof actions>;

// CONSTANTS / Action?
export enum Constants {
    ADD_ITEM = 'ADD_ITEM',
    SET_LOADING = 'SET_LOADING'
}