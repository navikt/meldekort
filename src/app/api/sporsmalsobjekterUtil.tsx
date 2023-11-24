import { RootState } from "../store/configureStore";
import { MeldekortDag, MeldekortdetaljerInnsending, Sporsmalsobjekt } from "../types/meldekort";
import { finnTypeYtelsePostfix } from "../utils/teksterUtil";
import { Begrunnelse, InnsendingState, Innsendingstyper } from "../types/innsending";
import { nesteMeldekortKanSendes } from "../utils/meldekortUtils";
import {
  formaterDato,
  formaterUkeOgDatoPeriode,
  hentDatoForAndreUke,
  hentDatoForForsteUke,
  hentNestePeriodeMedUkerOgDato,
  hentTid,
  hentUkenummerForDato,
  ukeTekst
} from "../utils/dates";
import { formatMessage } from "../utils/intlUtil";
import { hentDagliste } from "../components/meldekortdetaljer/ukevisning/dagliste";
import { renderToStaticMarkup } from "react-dom/server";

export function opprettSporsmalsobjekter(state: RootState): Sporsmalsobjekt[] {
  const { aktivtMeldekort, innsending, person } = state;
  const {
    innsendingstype,
    meldekortdetaljerInnsending,
    begrunnelse,
  } = innsending;
  const typeYtelsePostfix = finnTypeYtelsePostfix(aktivtMeldekort.meldegruppe);

  const { til, fra } = aktivtMeldekort.meldeperiode;
  const korrigering = innsendingstype === Innsendingstyper.KORRIGERING;

  const sendteMeldekort = Array.of(...state.meldekort.sendteMeldekort);
  sendteMeldekort.push(aktivtMeldekort);

  const nesteDato = nesteMeldekortKanSendes(
    person,
    sendteMeldekort,
    innsendingstype
  );

  const meldekortdager = innsending.meldekortdetaljer.sporsmal.meldekortDager;

  // Oppretter et object for å samle alt vi trenger
  const sporsmalsobjekter: Sporsmalsobjekt[] = new Array<Sporsmalsobjekt>();

  sporsmalsobjekter.push(
    header(korrigering, meldekortdetaljerInnsending, nesteDato)
  );
  sporsmalsobjekter.push(veiledning());
  sporsmalsobjekter.push(ansvar());

  if (korrigering) {
    sporsmalsobjekter.push(
      korrigeringsBegrunnelse(begrunnelse, typeYtelsePostfix)
    );
  }

  sporsmalsobjekter.push(...sporsmal(innsending, fra, til));

  sporsmalsobjekter.push(uke1(fra, meldekortdager, typeYtelsePostfix));
  sporsmalsobjekter.push(uke2(til, meldekortdager, typeYtelsePostfix));

  sporsmalsobjekter.push(
    utfylling("utfylling.arbeid", typeYtelsePostfix, true)
  );
  sporsmalsobjekter.push(utfylling("utfylling.tiltak", typeYtelsePostfix));
  sporsmalsobjekter.push(utfylling("utfylling.syk", typeYtelsePostfix));
  sporsmalsobjekter.push(utfylling("utfylling.ferieFravar", typeYtelsePostfix));

  sporsmalsobjekter.push(bekreftelse(typeYtelsePostfix));

  return sporsmalsobjekter;
}

function header(
  korrigering: boolean,
  meldekortdetaljerInnsending: MeldekortdetaljerInnsending | undefined,
  nesteDato: Date | null
): Sporsmalsobjekt {
  const meldekortMottatt =
    formaterDato(meldekortdetaljerInnsending!.mottattDato) +
    " " +
    hentTid(meldekortdetaljerInnsending!.mottattDato);

  // Vi vet ikke meldekort ID før vi sender det, vi kan ikke stole på klokkeslett fra JS, vi må mappe tema
  // Men vi må ha denne teksten på riktig språk
  // Derfor setter vi alt vi kan og sender teksten videre med placeholders (f.eks %TEMA%)
  // Disse senere erstattes i meldekort-api
  return {
    sporsmal: "",
    svar: formatMessage(
      "sendt.mottatt.pdfheader",
      {
        type: korrigering
          ? formatMessage("meldekort.type.korrigert").trim()
          : formatMessage("overskrift.meldekort").trim(),
        period: formaterUkeOgDatoPeriode(
          meldekortdetaljerInnsending!.meldeperiode.fra,
          meldekortdetaljerInnsending!.meldeperiode.til
        ),
        mottatt: meldekortMottatt,
        kortKanSendesFra: nesteDato
          ? formatMessage(
              "sendt.mottatt.meldekortKanSendes",
              {
                0: formaterDato(nesteDato),
              }
            ) + "<br/>"
          : "",
      }
    )
  };
}

function veiledning(): Sporsmalsobjekt {
  return {
    sporsmal: formatMessage("sporsmal.lesVeiledning"),
  };
}

function ansvar(): Sporsmalsobjekt {
  return {
    sporsmal: formatMessage("sporsmal.ansvarForRiktigUtfylling"),
  };
}

function korrigeringsBegrunnelse(
  begrunnelse: Begrunnelse,
  typeYtelsePostfix: string
): Sporsmalsobjekt {
  return {
    sporsmal: formatMessage("korrigering.sporsmal.begrunnelse"),
    forklaring: formatMessage("forklaring.sporsmal.begrunnelse" + typeYtelsePostfix),
    svar: begrunnelse.valgtArsakTekst,
  };
}

function sporsmal(
  innsending: InnsendingState,
  fra: Date,
  til: Date
): Sporsmalsobjekt[] {
  return innsending.sporsmalsobjekter.map(spm => {
    const formatertDato =
      spm.kategori === "registrert"
        ? hentNestePeriodeMedUkerOgDato(fra, til)
        : "";

    return {
      sporsmal: formatMessage(spm.sporsmal) + formatertDato,
      forklaring: formatMessage(spm.forklaring),
      svar:
        (spm.checked?.endsWith("ja") ? "X " : "_ ") +
        formatMessage(spm.ja) +
        "<br>" +
        (spm.checked?.endsWith("nei") ? "X " : "_ ") +
        formatMessage(spm.nei),
    };
  });
}

function uke1(
  fra: Date,
  meldekortdager: MeldekortDag[],
  typeYtelsePostfix: string
): Sporsmalsobjekt {
  return {
    sporsmal:
      ukeTekst() +
      hentUkenummerForDato(fra) +
      " (" +
      hentDatoForForsteUke(fra) +
      ")",
    svar: hentDagliste(meldekortdager.slice(0, 7), typeYtelsePostfix, false)
      .map(element => renderToStaticMarkup(element))
      .join(""),
  };
}

function uke2(
  til: Date,
  meldekortdager: MeldekortDag[],
  typeYtelsePostfix: string
): Sporsmalsobjekt {
  return {
    sporsmal:
      ukeTekst() +
      hentUkenummerForDato(til) +
      " (" +
      hentDatoForAndreUke(til) +
      ")",
    svar: hentDagliste(meldekortdager.slice(7, 14), typeYtelsePostfix, false)
      .map(element => renderToStaticMarkup(element))
      .join(""),
  };
}

function utfylling(
  id: string,
  typeYtelsePostfix: string,
  medAdvarsel: boolean = false
): Sporsmalsobjekt {
  return {
    advarsel: medAdvarsel
      ? formatMessage("sendt.advarsel")
      : "",
    sporsmal: "",
    forklaring:
      "<b>" +
      formatMessage(id) +
      "</b><br/>" +
      formatMessage("forklaring." + id + typeYtelsePostfix),
  };
}

function bekreftelse(typeYtelsePostfix: string): Sporsmalsobjekt {
  return {
    sporsmal:
      formatMessage("utfylling.bekreft" + typeYtelsePostfix) +
      "<br><br>X " +
      formatMessage("utfylling.bekreftAnsvar"),
  };
}
