import axios, { AxiosRequestTransformer } from 'axios';

const dateTransformer: AxiosRequestTransformer = data => {
  if (data instanceof Date) {
    // YYYY-MM-DD
    return (
      data.getFullYear() +
      '-' +
      (data.getMonth() + 1).toString().padStart(2, '0') +
      '-' +
      data.getDate()
    );
  }
  if (Array.isArray(data)) {
    return data.map(val => dateTransformer(val));
  }
  if (typeof data === 'object' && data !== null) {
    return Object.fromEntries(
      Object.entries(data).map(([key, val]) => [key, dateTransformer(val)])
    );
  }
  return data;
};

export const prefferedAxios = axios.create({
  transformRequest: axios.defaults.transformRequest
    ? [dateTransformer].concat(axios.defaults.transformRequest)
    : dateTransformer,
  baseURL: window.location.origin,
});

export enum FetchStatus {
  UNFETCHED,
  IN_PROGRESS,
  SUCCESS,
  FAILURE,
}

export function hentDataFraKilde<T>(
  fetchState: FetchState<T>,
  emptyVerdi: any
): T {
  return fetchState && fetchState.status === FetchStatus.SUCCESS
    ? fetchState.data
    : emptyVerdi;
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
