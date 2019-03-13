import { hentIntl } from './intlUtil';

const moment = require('moment');

const datoFormat = 'DD.MM.YYYY';

// Henter ukenummer
export const hentUkenummerForDato = (dato: Date) => {
    return moment(dato).isoWeek();
};

// Formaterer dato til DD.MM.YYYY
export const formaterDato = (dato: Date) => {
    return moment(dato).format(datoFormat);
};
// Format: Uke 1-2
export const hentUkePeriode = (fraDato: Date, tilDato: Date): string => {
    return `${ukeTekst()} ${hentUkenummerForDato(fraDato)} - ${hentUkenummerForDato(tilDato)}`;
};

// Format: DD.MM.YYYY - DD.MM.YYYY
export const hentDatoPeriode = (fraDato: Date, tilDato: Date): string => {
    return `${formaterDato(fraDato)} - ${formaterDato(tilDato)}`;
};

// Format: Uke 1-2 (DD.MM.YYYY - DD.MM.YYYY)
export const formaterUkeOgDatoPeriode = (fra: Date, til: Date): string => {
    return `${hentUkePeriode(fra, til)} (${hentDatoPeriode(fra, til)})`;
};

// Gir dato for søndag (ukeslutt) i den første uken i perioden
export const hentDatoForUkesluttIForsteUke = (periodeStart: Date) => {
    return moment(periodeStart).add(6, 'days').format(datoFormat);
};

// Gir dato for ukestart (mandag) i den andre uken i perioden
export const hentDatoForUkestartIAndreUke = (periodeSlutt: Date) => {
    return moment(periodeSlutt).subtract(6, 'days').format(datoFormat);
};

export const hentNummerOgDatoForForsteUke = (fraDato: Date): string => {
    let ukenr = hentUkenummerForDato(fraDato);
    let periode = `${formaterDato(fraDato)} - ${hentDatoForUkesluttIForsteUke(fraDato)}`;
    return `${ukeTekst()} ${ukenr} (${periode})`;
};

export const hentNummerOgDatoForAndreUke = (tilDato: Date): string => {
    let ukenr = hentUkenummerForDato(tilDato);
    let periode = `${hentDatoForUkestartIAndreUke(tilDato)} - ${formaterDato(tilDato)}`;

    return `${ukeTekst()} ${ukenr} (${periode})`;
};

export const hentNestePeriodeMedUkerOgDato = (fraDato: Date, tilDato: Date): string => {
    let momentNesteFra = moment(fraDato).add(14, 'days');
    let momentNesteTil = moment(tilDato).add(14, 'days');

    return `${momentNesteFra.isoWeek()}-${momentNesteTil.isoWeek()} (${momentNesteFra.format(datoFormat)} - ${momentNesteTil.format(datoFormat)})`;

};

export const kanMeldekortSendesInn = (kortKanSendesFra: Date): boolean => {
    let sendesFra = moment(kortKanSendesFra).hour(0).minute(0).second(0).format();
    let dagensDato = moment(new Date()).hour(0).minute(0).second(0).format();
    return moment(sendesFra).isSameOrBefore(dagensDato);
};

const ukeTekst = () => {
    return hentIntl().formatMessage({id: 'overskrift.uke'});
};