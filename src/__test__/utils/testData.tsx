import { MenyPunkt } from '../../app/utils/menyConfig';
import SendMeldekort from '../../app/sider/sendMeldekort/sendMeldekort';
import TidligereMeldekort from '../../app/sider/tidligereMeldekort/tidligereMeldekort';

export const menyPunkterTEST: MenyPunkt[] = [
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
];
