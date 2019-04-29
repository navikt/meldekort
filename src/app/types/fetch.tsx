import axios from 'axios';
import Environment from '../utils/env';

axios.defaults.baseURL = window.location.origin;
export const prefferedAxios = axios;

export const backendApi: string = Environment().apiUrl;

export enum FetchStatus {
    'UNFETCHED',
    'IN_PROGRESS',
    'SUCCESS',
    'FAILURE',
}

export function hentDataFraKilde<T>(fetchState: FetchState<T>, emptyVerdi: any): T {
    return fetchState && fetchState.status === FetchStatus.SUCCESS ? fetchState.data : emptyVerdi;
}

export type FetchState<T> =
    | {
    status: FetchStatus.UNFETCHED;
}
    | {
    status: FetchStatus.IN_PROGRESS;
}
    | {
    status: FetchStatus.SUCCESS;
    data: T;
}
    | {
    status: FetchStatus.FAILURE;
    error: unknown;
};