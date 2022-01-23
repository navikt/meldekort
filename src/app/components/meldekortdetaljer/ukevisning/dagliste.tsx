import * as React from 'react';
import { MeldekortDag } from '../../../types/meldekort';
import { guid } from 'nav-frontend-js-utils';
import { hentIntl } from '../../../utils/intlUtil';
import UtvidetInformasjon from '../../utvidetinformasjon/utvidetInformasjon';
import Hjelpetekst from './hjelpetekst';
import { hentUkedagerSomStringListe } from '../../../utils/ukedager';

const sjekkOmDetFinnesFlereElementer = (
  element: string,
  meldekortDag: MeldekortDag
) => {
  switch (element) {
    case 'arbeid':
      return meldekortDag.kurs || meldekortDag.syk || meldekortDag.annetFravaer;
    case 'kurs':
      return meldekortDag.syk || meldekortDag.annetFravaer;
    case 'syk':
      return meldekortDag.annetFravaer;
    default:
      return false;
  }
};

const returnerAktivitetTekst = (
  meldekortDag: MeldekortDag,
  aktivitet: string,
  tekstid: string
) => {
  return `${hentIntl()
    .formatMessage({ id: tekstid })
    .trim()}${
    sjekkOmDetFinnesFlereElementer(aktivitet, meldekortDag) ? ', ' : ''
  }`;
};

export const hentDagliste = (
  meldekortdager: MeldekortDag[],
  typeYtelsePostfix: string,
  medUtvidetInformasjon: boolean = true
): JSX.Element[] => {
  const dagListe = [];
  let ukedager = hentUkedagerSomStringListe();

  console.log(meldekortdager);

  for (let i = 0; i < meldekortdager.length; i++) {
    let meldekortDag = meldekortdager[i];
    const harAktivitet =
      meldekortDag.arbeidetTimerSum > 0 ||
      meldekortDag.kurs ||
      meldekortDag.annetFravaer ||
      meldekortDag.syk;
    if (harAktivitet) {
      let ukedag = i <= 6 ? ukedager[i] : ukedager[i - 6];
      dagListe.push(
        <div className="dagliste" key={guid()}>
          <div className="dagliste__dager">
            <strong className={'ukedag'}>{ukedag}:&nbsp;</strong>
            <span className={'aktiviteter'}>
              {meldekortDag.arbeidetTimerSum > 0
                ? `${hentIntl().formatMessage({ id: 'utfylling.arbeid' })}
                                ${meldekortDag.arbeidetTimerSum}
                                ${hentIntl()
                                  .formatMessage({ id: 'overskrift.timer' })
                                  .trim()}${
                    sjekkOmDetFinnesFlereElementer('arbeid', meldekortDag)
                      ? ', '
                      : ''
                  }`
                : null}
              {meldekortDag.kurs
                ? returnerAktivitetTekst(
                    meldekortDag,
                    'kurs',
                    'utfylling.tiltak'
                  )
                : null}
              {meldekortDag.syk
                ? returnerAktivitetTekst(meldekortDag, 'syk', 'utfylling.syk')
                : null}
              {meldekortDag.annetFravaer
                ? returnerAktivitetTekst(
                    meldekortDag,
                    '',
                    'utfylling.ferieFravar'
                  )
                : null}
            </span>
          </div>
          {harAktivitet && medUtvidetInformasjon ? (
            <UtvidetInformasjon>
              <Hjelpetekst
                meldekortDag={meldekortDag}
                typeYtelsePostfix={typeYtelsePostfix}
              />
            </UtvidetInformasjon>
          ) : null}
        </div>
      );
    }
  }
  return dagListe;
};
