import {
  finnesIntlId,
  finnTypeYtelsePostfix,
  TypeYtelse,
} from '../../app/utils/teksterUtil';
import { Meldegruppe } from '../../app/types/meldekort';
import { setLocalesBeforeAll } from '../testSetup/providerWrapper';

setLocalesBeforeAll();

it('finnTypeYtelsePostfix', () => {
  expect(finnTypeYtelsePostfix(Meldegruppe.ATTF)).toBe(TypeYtelse.AAP);
  expect(finnTypeYtelsePostfix(Meldegruppe.INDIV)).toBe(
    TypeYtelse.TILTAKSPENGER
  );
  expect(finnTypeYtelsePostfix(Meldegruppe.DAGP)).toBe(TypeYtelse.DAGPENGER);
  expect(finnTypeYtelsePostfix(Meldegruppe.FY)).toBe(TypeYtelse.DAGPENGER);
});

it('finnesIntlId', () => {
  expect(finnesIntlId('naviger.neste')).toBe('naviger.neste');
  expect(finnesIntlId('naviger.neste-AAP')).toBe('naviger.neste');
  expect(finnesIntlId('naviger.neste-TP')).toBe('naviger.neste');
  expect(finnesIntlId('kurs.required-AAP')).toBe('kurs.required-AAP');
});
