import prom from 'promjs';
// const prom=require('promjs');

const registry = prom();
export const counterPagereqSporsmal = registry.create(
  'counter',
  'page_requests',
  'txt'
);
