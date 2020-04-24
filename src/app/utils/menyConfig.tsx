import SendMeldekort from '../sider/sendMeldekort/sendMeldekort';
import TidligereMeldekort from '../sider/tidligereMeldekort/tidligereMeldekort';
import EtterregistrerMeldekort from '../sider/etterregistrerMeldekort/etterregistrerMeldekort';
import OmMeldekort from '../sider/omMeldekort/omMeldekort';
import OfteStilteSporsmal from '../sider/ofteStilteSporsmal/ofteStilteSporsmal';
import { ComponentClass } from 'react';

export interface MenyPunkt {
  exact?: boolean;
  component: ComponentClass;
  urlparam: string;
  tekstid: string;
  tittel: string;
  disabled: boolean;
}

const menyConfig: MenyPunkt[] = [
  {
    exact: true,
    component: SendMeldekort,
    tittel: 'sendMeldekort',
    tekstid: 'naviger.send',
    urlparam: '/send-meldekort',
    disabled: false,
  },
  {
    component: TidligereMeldekort,
    tekstid: 'sekundarmeny.tidligere',
    tittel: 'tidligereMeldekort',
    urlparam: '/tidligere-meldekort',
    disabled: false,
  },
  {
    component: EtterregistrerMeldekort,
    tekstid: 'sekundarmeny.etterregistrer',
    tittel: 'etterregistrering',
    urlparam: '/etterregistrer-meldekort',
    disabled: true,
  },
  {
    component: OmMeldekort,
    tekstid: 'sekundarmeny.omMeldekort',
    tittel: 'omMeldekort',
    urlparam: '/om-meldekort',
    disabled: false,
  },
  {
    component: OfteStilteSporsmal,
    tekstid: 'sekundarmeny.faq',
    tittel: 'ofteStilteSporsmal',
    urlparam: '/ofte-stilte-sporsmal',
    disabled: false,
  },
];

export default menyConfig;
