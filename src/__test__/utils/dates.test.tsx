import {
  formaterDato,
  formaterUkeOgDatoPeriode,
  hentDatoForAndreUke,
  hentDatoForForsteUke,
  hentDatoForUkesluttIForsteUke,
  hentDatoForUkestartIAndreUke,
  hentDatoPeriode,
  hentNestePeriodeMedUkerOgDato,
  hentNummerOgDatoForAndreUke,
  hentNummerOgDatoForForsteUke,
  hentUkenummerForDato,
  hentUkePeriode,
  kalkulerDato,
  ukeTekst
} from "../../app/utils/dates";
import { setLocalesBeforeAll } from "../testSetup/providerWrapper";

const fraDatoString = "2019-01-01T00:00:00Z";
const tilDatoString = "2019-01-13T10:10:00Z";

const fraDato = new Date(fraDatoString);
const tilDato = new Date(tilDatoString);

setLocalesBeforeAll();

it("hentUkenummerForDato", () => {
  expect(hentUkenummerForDato(fraDato)).toBe(1);
});

it("formaterDato", () => {
  expect(formaterDato(fraDato)).toBe("01.01.2019");
});

it("hentUkePeriode", () => {
  expect(hentUkePeriode(fraDato, tilDato)).toBe("Uke 1 - 2");
});

it("hentDatoPeriode", () => {
  expect(hentDatoPeriode(fraDato, tilDato)).toBe("01.01.2019 - 13.01.2019");
});

it("formaterUkeOgDatoPeriode", () => {
  expect(formaterUkeOgDatoPeriode(fraDato, tilDato)).toBe(
    "Uke 1 - 2 (01.01.2019 - 13.01.2019)"
  );
});

it("hentDatoForUkesluttIForsteUke", () => {
  expect(hentDatoForUkesluttIForsteUke(fraDato)).toBe("07.01.2019");
});

it("hentDatoForUkestartIAndreUke", () => {
  expect(hentDatoForUkestartIAndreUke(tilDato)).toBe("07.01.2019");
});

it("hentDatoForForsteUke", () => {
  expect(hentDatoForForsteUke(fraDato)).toBe("01.01.2019 - 07.01.2019");
});

it("hentDatoForAndreUke", () => {
  expect(hentDatoForAndreUke(tilDato)).toBe("07.01.2019 - 13.01.2019");
});

it("hentNummerOgDatoForForsteUke", () => {
  expect(hentNummerOgDatoForForsteUke(fraDato)).toBe(
    "Uke 1 (01.01.2019 - 07.01.2019)"
  );
});

it("hentNummerOgDatoForAndreUke", () => {
  expect(hentNummerOgDatoForAndreUke(tilDato)).toBe(
    "Uke 2 (07.01.2019 - 13.01.2019)"
  );
});

it("hentNestePeriodeMedUkerOgDato", () => {
  expect(hentNestePeriodeMedUkerOgDato(fraDato, tilDato)).toBe(
    "3-4 (15.01.2019 - 27.01.2019)"
  );
});

it("ukeTekst", () => {
  expect(ukeTekst()).toBe("Uke");
});

it("kalkulerDato", () => {
  expect(kalkulerDato(fraDato, 6)).toStrictEqual(
    new Date("2019-01-07T00:00:00.000Z")
  );
});
