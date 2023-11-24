import SendMeldekort from "../sider/sendMeldekort/sendMeldekort";
import TidligereMeldekort from "../sider/tidligereMeldekort/tidligereMeldekort";
import EtterregistrerMeldekort from "../sider/etterregistrerMeldekort/etterregistrerMeldekort";
import OmMeldekort from "../sider/omMeldekort/omMeldekort";
import OfteStilteSporsmal from "../sider/ofteStilteSporsmal/ofteStilteSporsmal";
import { ComponentClass, FunctionComponent } from "react";
import { Konstanter } from "./consts";

export interface MenyPunkt {
  exact?: boolean;
  component: ComponentClass | FunctionComponent;
  urlparam: string;
  tekstid: string;
  tittel: string;
  disabled: boolean;
}

const menyConfig: MenyPunkt[] = [
  {
    exact: true,
    component: SendMeldekort,
    tittel: "sendMeldekort",
    tekstid: "naviger.send",
    urlparam: Konstanter.basePath + "/send-meldekort",
    disabled: false,
  },
  {
    component: TidligereMeldekort,
    tekstid: "sekundarmeny.tidligere",
    tittel: "tidligereMeldekort",
    urlparam: Konstanter.basePath + "/tidligere-meldekort",
    disabled: false,
  },
  {
    component: EtterregistrerMeldekort,
    tekstid: "sekundarmeny.etterregistrer",
    tittel: "etterregistrering",
    urlparam: Konstanter.basePath + "/etterregistrer-meldekort",
    disabled: true,
  },
  {
    component: OmMeldekort,
    tekstid: "sekundarmeny.omMeldekort",
    tittel: "omMeldekort",
    urlparam: Konstanter.basePath + "/om-meldekort",
    disabled: false,
  },
  {
    component: OfteStilteSporsmal,
    tekstid: "sekundarmeny.faq",
    tittel: "ofteStilteSporsmal",
    urlparam: Konstanter.basePath + "/ofte-stilte-sporsmal",
    disabled: false,
  },
];

export default menyConfig;
