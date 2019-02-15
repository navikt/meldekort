const moment = require('moment');

export const hentUkenummerForDato = (dato: Date) => {
    return moment(dato).isoWeek();
};

export const formaterDato = (dato: Date) => {
    return moment(dato).format('DD.MM.YYYY');
};

export const hentUkePeriode = (fraDato: Date, tilDato: Date): string => {
    return `Uke ${hentUkenummerForDato(fraDato)} - ${hentUkenummerForDato(tilDato)}`;
};

export const hentDatoPeriode = (fraDato: Date, tilDato: Date): string => {
    return `${formaterDato(fraDato)} - ${formaterDato(tilDato)}`;
};