import * as React from 'react';
import { MeldekortDag } from '../../../types/meldekort';
import { guid } from 'nav-frontend-js-utils';
import { hentIntl } from '../../../utils/intlUtil';
import UtvidetInformasjon from '../../utvidetinformasjon/utvidetInformasjon';
import Hjelpetekst from './hjelpetekst';
import { hentUkedagerSomStringListe } from '../../../utils/ukedager';

const sjekkOmDetFinnesFlereElementer = (element: string, meldekortDag: MeldekortDag) => {
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

export const hentDagliste = (meldekortdager: MeldekortDag[], erAap: boolean): JSX.Element[] => {
  const dagListe = [];
  let ukedager = hentUkedagerSomStringListe();

  for (let i = 0; i < meldekortdager.length; i++) {
    let meldekortDag = meldekortdager[i];
    if (meldekortDag.arbeidetTimerSum > 0 || meldekortDag.kurs || meldekortDag.annetFravaer || meldekortDag.syk) {
      let ukedag = i <= 6 ? ukedager[i] : ukedager[i - 6];
      dagListe.push(
        <div className="dagliste" key={guid()}>
          <div className="dagliste__dager">
            <strong>{ukedag}:&nbsp;</strong>
            <span>
              {meldekortDag.arbeidetTimerSum > 0
                ? `${hentIntl().formatMessage({ id: 'utfylling.arbeid' })}
                                ${meldekortDag.arbeidetTimerSum}
                                ${hentIntl()
                                  .formatMessage({ id: 'overskrift.timer' })
                                  .trim()}${sjekkOmDetFinnesFlereElementer('arbeid', meldekortDag) ? ', ' : ''}`
                : null}
              {meldekortDag.kurs
                ? `${hentIntl()
                    .formatMessage({ id: 'utfylling.tiltak' })
                    .trim()}${sjekkOmDetFinnesFlereElementer('kurs', meldekortDag) ? ', ' : ''}`
                : null}
              {meldekortDag.syk
                ? `${hentIntl()
                    .formatMessage({ id: 'utfylling.syk' })
                    .trim()}${sjekkOmDetFinnesFlereElementer('syk', meldekortDag) ? ', ' : ''}`
                : null}
              {meldekortDag.annetFravaer
                ? `${hentIntl()
                    .formatMessage({ id: 'utfylling.ferieFravar' })
                    .trim()}`
                : null}
            </span>
          </div>
          {meldekortDag.arbeidetTimerSum > 0 || meldekortDag.kurs || meldekortDag.syk || meldekortDag.annetFravaer ? (
            <UtvidetInformasjon>
              <Hjelpetekst meldekortDag={meldekortDag} erAap={erAap} />
            </UtvidetInformasjon>
          ) : null}
        </div>
      );
    }
  }
  return dagListe;
};
