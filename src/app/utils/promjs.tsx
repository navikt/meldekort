import prom from 'promjs';
// const prom=require('promjs');

const registry = prom();
console.log('Registry initiert');
console.log(registry);
export const counterPagereqSporsmal = registry.create(
  'counter',
  'MeldekortFrontend.counterPagereqSporsmal',
  'counterPagereqSporsmal'
);
