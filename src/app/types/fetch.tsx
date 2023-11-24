import axios from 'axios';

/* eslint-disable @typescript-eslint/no-explicit-any */
const dateTransformer = (data: any, headers: any): any => {
  if (data instanceof Date) {
    // YYYY-MM-DD
    return (
      data.getFullYear() +
      '-' +
      (data.getMonth() + 1).toString().padStart(2, '0') +
      '-' +
      data
        .getDate()
        .toString()
        .padStart(2, '0')
    );
  }
  if (Array.isArray(data)) {
    return data.map(val => dateTransformer(val, headers));
  }
  if (typeof data === 'object' && data !== null) {
    return Object.fromEntries(
      Object.entries(data).map(([key, val]) => [key, dateTransformer(val, headers)])
    );
  }
  return data;
};

export const prefferedAxios = axios.create({
  transformRequest: axios.defaults.transformRequest
    ? [dateTransformer].concat(axios.defaults.transformRequest)
    : dateTransformer,
  baseURL: window.location.origin
});
