import * as React from "react";
import NorskFlaggSVG from "../components/sprakvelger/NorskFlaggSVG";
import EngelskFlaggSVG from "../components/sprakvelger/EngelskFlaggSVG";

export interface Locale {
  label: string;
  tittel: string;
  ikon: React.ReactElement;
}

const locales = [
  {
    label: "nb",
    tittel: "Norsk",
    ikon: <NorskFlaggSVG />,
  },
  /*
  {
    label: "nn",
    tittel: "Nynorsk",
    ikon: <NorskFlaggSVG />,
  },
  */
  {
    label: "en",
    tittel: "English",
    ikon: <EngelskFlaggSVG />,
  },
];

const localesReducer = (state: Locale[] = locales): Locale[] => { // (state: Locale[] = locales, action: any)
  return state;
};

export default localesReducer;
