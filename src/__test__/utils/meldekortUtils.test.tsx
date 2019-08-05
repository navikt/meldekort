import * as React from 'react';
import {
  erAktivtMeldekortGyldig,
  erBrukerRegistrertIArena,
  erMeldekortSendtInnTidligere,
} from '../../app/utils/meldekortUtils';
import { mkTEST } from '../testSetup/testData';
import { KortType } from '../../app/types/meldekort';
import { Innsendingstyper } from '../../app/types/innsending';

it('erMeldekortSendtInnTidligere', () => {
  expect(
    erMeldekortSendtInnTidligere(mkTEST, [{ meldekortId: 0, kortType: KortType.ELEKTRONISK }])
  ).toBe(false);
  expect(
    erMeldekortSendtInnTidligere(mkTEST, [
      { meldekortId: 0, kortType: KortType.ELEKTRONISK },
      { meldekortId: 1, kortType: KortType.ELEKTRONISK },
      { meldekortId: 2, kortType: KortType.KORRIGERT_ELEKTRONISK },
    ])
  ).toBe(true);
  expect(
    erMeldekortSendtInnTidligere(mkTEST, [
      { meldekortId: 0, kortType: KortType.ELEKTRONISK },
      { meldekortId: 1, kortType: KortType.MANUELL_ARENA },
      { meldekortId: 2, kortType: KortType.KORRIGERT_ELEKTRONISK },
    ])
  ).toBe(false);
});

it('erAktivtMeldekortGyldig', () => {
  expect(
    erAktivtMeldekortGyldig(
      mkTEST,
      [{ meldekortId: 0, kortType: KortType.ELEKTRONISK }],
      Innsendingstyper.innsending
    )
  ).toBe(true);
  expect(
    erAktivtMeldekortGyldig(
      mkTEST,
      [{ meldekortId: 1, kortType: KortType.ELEKTRONISK }],
      Innsendingstyper.innsending
    )
  ).toBe(false);
  expect(
    erAktivtMeldekortGyldig(
      mkTEST,
      [{ meldekortId: 1, kortType: KortType.ELEKTRONISK }],
      Innsendingstyper.korrigering
    )
  ).toBe(true);
  expect(
    erAktivtMeldekortGyldig(mkTEST, [{ meldekortId: 0, kortType: KortType.ELEKTRONISK }], null)
  ).toBe(false);
});

it('erBrukerRegistrertIArena', () => {
  expect(erBrukerRegistrertIArena('ARBS')).toBe(true);
  expect(erBrukerRegistrertIArena('')).toBe(false);
  expect(erBrukerRegistrertIArena('test')).toBe(true);
});
