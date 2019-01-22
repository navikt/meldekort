import * as actions from './demo';
import { DemoActions } from '../types/demo';
import { Dispatch } from 'redux';

function sleep(timeout: number) {
    return new Promise((resolve) => setTimeout(() => resolve(), timeout));
}

export async function addItemAsync(dispatch: Dispatch<DemoActions>, item: string ) {
    dispatch(actions.setLoading(true));

    await sleep(1000);
    dispatch(actions.addItemToList(item));
    dispatch(actions.setLoading(false));
}