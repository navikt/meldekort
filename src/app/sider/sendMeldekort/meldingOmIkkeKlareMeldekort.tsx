import * as React from "react";
import { Meldekort, MeldekortRad } from "../../types/meldekort";
import { Person } from "../../types/person";
import { formaterDato, formaterUkeOgDatoPeriode } from "../../utils/dates";
import { harKortStatusOPPRellerSENDT } from "../../utils/meldekortUtils";
import { formatHtmlMessage } from "../../utils/intlUtil";
import { BodyShort, GuidePanel, Label } from "@navikt/ds-react";

interface Props {
  rows: MeldekortRad[];
  person: Person;
  innsendingsklareMeldekort: Meldekort[];
}

function MeldingOmMeldekortSomIkkeErKlare({
  rows,
  person,
  innsendingsklareMeldekort
}: Props) {
  const meldekortliste = innsendingsklareMeldekort;

  const hentIdTilNesteInnsendingsklareMeldekort = (
    meldekortListe: Meldekort[]
  ): number => {
    let meldekortId = 0;
    if (meldekortListe === undefined) {
      return meldekortId;
    }

    meldekortListe.forEach(function(meldekort: Meldekort) {
      if (
        harKortStatusOPPRellerSENDT(meldekort) &&
        !meldekort.meldeperiode.kanKortSendes
      ) {
        meldekortId = meldekort.meldekortId;
      }
    });
    return meldekortId;
  };

  const meldekortSomIkkeKanSendesInnEnda = (
    meldekort: Meldekort[]
  ): Meldekort[] => {
    if (meldekortliste.length === 0) {
      return meldekort.filter(mk => {
        return (
          !mk.meldeperiode.kanKortSendes && harKortStatusOPPRellerSENDT(mk)
        );
      });
    }
    return [];
  };

  const returnerVarselIngenMeldekortASende = formatHtmlMessage("sporsmal.ingenMeldekortASende");

  const visMeldingOmMeldekort = () => {
    if (rows.length === 0 && meldekortliste !== undefined) {
      const meldekortId = hentIdTilNesteInnsendingsklareMeldekort(
        meldekortliste
      );
      const meldekort = meldekortliste.filter(
        m => m.meldekortId === meldekortId
      );
      const meldekortSomIkkeKanSendesEnda = meldekortSomIkkeKanSendesInnEnda(
        person.meldekort
      );
      if (
        meldekort.length === 0 &&
        meldekortSomIkkeKanSendesEnda.length !== 0
      ) {
        return (
          <>
            <BodyShort>
              {formatHtmlMessage("overskrift.nesteMeldekort")}
              {formatHtmlMessage("sendMeldekort.info.innsendingStatus.kanSendes")}
              {formaterDato(
                meldekortSomIkkeKanSendesEnda[0].meldeperiode.kortKanSendesFra
              )}
            </BodyShort>
            <Label>
              {formaterUkeOgDatoPeriode(
                meldekortSomIkkeKanSendesEnda[0].meldeperiode.fra,
                meldekortSomIkkeKanSendesEnda[0].meldeperiode.til
              )}
            </Label>
            {formatHtmlMessage("sendMeldekort.info.ingenKlare")}
          </>
        );
      } else {
        return returnerVarselIngenMeldekortASende;
      }
    } else {
      return returnerVarselIngenMeldekortASende;
    }
  };

  return (
    <GuidePanel>
      <div className="send-meldekort-varsel">{visMeldingOmMeldekort()}</div>
    </GuidePanel>
  );
}

export default MeldingOmMeldekortSomIkkeErKlare;
