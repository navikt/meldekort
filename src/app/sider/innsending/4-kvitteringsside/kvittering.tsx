import * as React from 'react';
import { Innholdstittel } from 'nav-frontend-typografi';
import Sprakvelger from '../../../components/sprakvelger/sprakvelger';
import { FormattedMessage } from 'react-intl';
import NavKnapp, { KnappTyper } from '../../../components/knapp/navKnapp';
import { RouteComponentProps } from 'react-router-dom';
import { RootState } from '../../../store/configureStore';
import { InnsendingActions } from '../../../actions/innsending';
import {
  Meldekort,
  MeldekortState,
  SendtMeldekort,
} from '../../../types/meldekort';
import { InnsendingState, Innsendingstyper } from '../../../types/innsending';
import { Dispatch } from 'redux';
import { selectRouter } from '../../../selectors/router';
import { connect } from 'react-redux';
import { Router } from '../../../types/router';
import { Person, PersonInfo } from '../../../types/person';
import Meldekortdetaljer from '../../../components/meldekortdetaljer/meldekortdetaljer';
import { downloadMessagesAndDispatch, hentIntl } from '../../../utils/intlUtil';
import Ingress from 'nav-frontend-typografi/lib/ingress';
import {
  formaterDato,
  formaterUkeOgDatoPeriode,
  hentTid,
} from '../../../utils/dates';
import Environment from '../../../utils/env';
import PrintKnapp from '../../../components/print/printKnapp';
import AlertStripe from 'nav-frontend-alertstriper';
import { scrollTilElement } from '../../../utils/scroll';
import { MeldekortActions } from '../../../actions/meldekort';
import {
  meldekortSomKanSendes,
  nesteMeldekortKanSendes,
  returnerMeldekortListaMedFlereMeldekortIgjen,
} from '../../../utils/meldekortUtils';
import { PersonInfoActions } from '../../../actions/personInfo';
import NavFrontendSpinner from 'nav-frontend-spinner';
import { loggAktivitet } from '../../../utils/amplitudeUtils';
import { finnTypeYtelsePostfix, TypeYtelse } from '../../../utils/teksterUtil';
import { Location } from 'history';

interface MapStateToProps {
  router: Router;
  person: Person;
  aktivtMeldekort: Meldekort;
  innsending: InnsendingState;
  innsendingstype: Innsendingstyper | null;
  sendteMeldekort: MeldekortState;
  personInfo: PersonInfo;
  loading: boolean;
  locale: string;
}

interface PropsVerdier {
  knappTekstid: string;
  nestePath: string;
  nesteAktivtMeldekort: Meldekort | undefined;
  nesteInnsendingstype: Innsendingstyper | undefined;
}

interface MapDispatchToProps {
  settInnsendingstype: (innsendingstype: Innsendingstyper | null) => void;
  leggTilInnsendtMeldekort: (sendteMeldekort: SendtMeldekort[]) => void;
  hentPersonInfo: () => void;
  settLocale: (locale: string, from: Date) => void;
}

interface Props {
  match: any;
  history: any;
  location: Location;
}

type KvitteringsProps = RouteComponentProps &
  MapDispatchToProps &
  MapStateToProps &
  Props;

class Kvittering extends React.Component<KvitteringsProps, {}> {
  componentDidMount() {
    const {
      hentPersonInfo,
      sendteMeldekort,
      aktivtMeldekort,
      leggTilInnsendtMeldekort,
      innsending,
      innsendingstype,
      settLocale,
      locale,
    } = this.props;
    settLocale(locale, aktivtMeldekort.meldeperiode.fra);

    hentPersonInfo();
    scrollTilElement(undefined, 'auto');
    let oppdatertSendteMeldekort = sendteMeldekort;
    let { meldekortId, kortType } = aktivtMeldekort;
    oppdatertSendteMeldekort.sendteMeldekort.push({ meldekortId, kortType });
    leggTilInnsendtMeldekort(oppdatertSendteMeldekort.sendteMeldekort);

    const arbeidsssokerSvar =
      innsending?.meldekortdetaljer?.sporsmal?.arbeidssoker;
    loggAktivitet('Viser kvittering', {
      arbeidssoker: arbeidsssokerSvar ? 'ja' : 'nei',
      meldegruppe: aktivtMeldekort.meldegruppe || 'UKJENT',
      innsendingstype: innsendingstype || 'UKJENT',
    });
    loggAktivitet('skjema fullført', {
      meldegruppe: aktivtMeldekort.meldegruppe || 'UKJENT',
    });
  }

  returnerPropsVerdier = (): PropsVerdier => {
    const { innsendingstype, person, location, sendteMeldekort } = this.props;
    const urlParams = location?.pathname.split('/');
    urlParams.pop();
    const nestePath = urlParams.join('/');
    const meldekort = meldekortSomKanSendes(
      person.meldekort,
      sendteMeldekort.sendteMeldekort
    );
    const etterregistrerteMeldekort = meldekortSomKanSendes(
      person.etterregistrerteMeldekort,
      sendteMeldekort.sendteMeldekort
    );
    const harBrukerFlereMeldekort = meldekort.length > 0;
    const harBrukerFlereEtterregistrerteMeldekort =
      etterregistrerteMeldekort.length > 0;
    const paramsForMeldekort = returnerMeldekortListaMedFlereMeldekortIgjen(
      meldekort,
      Innsendingstyper.INNSENDING,
      etterregistrerteMeldekort,
      Innsendingstyper.ETTERREGISTRERING
    );
    const paramsForEtterregistrerte = returnerMeldekortListaMedFlereMeldekortIgjen(
      etterregistrerteMeldekort,
      Innsendingstyper.ETTERREGISTRERING,
      meldekort,
      Innsendingstyper.INNSENDING
    );

    if (innsendingstype === Innsendingstyper.INNSENDING) {
      if (harBrukerFlereMeldekort) {
        return {
          knappTekstid: 'overskrift.nesteMeldekort',
          nestePath: nestePath,
          nesteAktivtMeldekort: paramsForMeldekort.nesteAktivtMeldekort,
          nesteInnsendingstype: paramsForMeldekort.nesteInnsendingstype,
        };
      } else if (harBrukerFlereEtterregistrerteMeldekort) {
        return {
          knappTekstid: 'overskrift.etterregistrertMeldekort',
          nestePath: nestePath,
          nesteAktivtMeldekort: paramsForEtterregistrerte.nesteAktivtMeldekort,
          nesteInnsendingstype: paramsForEtterregistrerte.nesteInnsendingstype,
        };
      }
    } else if (innsendingstype === Innsendingstyper.ETTERREGISTRERING) {
      if (harBrukerFlereEtterregistrerteMeldekort) {
        return {
          knappTekstid: 'overskrift.etterregistrertMeldekort',
          nestePath: nestePath,
          nesteAktivtMeldekort: paramsForEtterregistrerte.nesteAktivtMeldekort,
          nesteInnsendingstype: paramsForEtterregistrerte.nesteInnsendingstype,
        };
      } else if (harBrukerFlereMeldekort) {
        return {
          knappTekstid: 'overskrift.nesteMeldekort',
          nestePath: nestePath,
          nesteAktivtMeldekort: paramsForMeldekort.nesteAktivtMeldekort,
          nesteInnsendingstype: paramsForMeldekort.nesteInnsendingstype,
        };
      }
    }
    return {
      knappTekstid: 'tilbake.minSide',
      nestePath: Environment().minSideUrl,
      nesteAktivtMeldekort: undefined,
      nesteInnsendingstype: undefined,
    };
  };

  visOppsummeringsTekster = () => {
    const { personInfo, innsending, person, sendteMeldekort } = this.props;
    const { meldekortdetaljerInnsending, innsendingstype } = innsending;
    const ukeOgPeriode = formaterUkeOgDatoPeriode(
      meldekortdetaljerInnsending!.meldeperiode.fra,
      meldekortdetaljerInnsending!.meldeperiode.til
    );
    const meldekortErMottatt = hentIntl().formatMessage(
      { id: 'sendt.mottatt.label' },
      {
        0: formaterDato(meldekortdetaljerInnsending!.mottattDato),
        1: hentTid(meldekortdetaljerInnsending!.mottattDato),
      }
    );

    const nesteDato = nesteMeldekortKanSendes(
      person,
      sendteMeldekort.sendteMeldekort,
      innsendingstype
    );

    return (
      <div className="oppsummeringsTekster">
        <Ingress>
          <span>
            {hentIntl().formatMessage({ id: 'meldekort.for' }) +
              personInfo.fornavn +
              ' ' +
              personInfo.etternavn +
              ' (' +
              personInfo.fodselsnr +
              ')'}
          </span>
        </Ingress>
        <Ingress>
          <span>
            {hentIntl().formatMessage({ id: 'meldekort.for.perioden' }) +
              ukeOgPeriode}
          </span>
        </Ingress>
        <Ingress>
          <span>{meldekortErMottatt}</span>
        </Ingress>
        {nesteDato && (
          <Ingress className="noPrint">
            <span>
              {hentIntl().formatHTMLMessage(
                { id: 'sendt.meldekortKanSendes' },
                {
                  0: formaterDato(nesteDato),
                }
              )}
            </span>
          </Ingress>
        )}
      </div>
    );
  };

  innhold = (nesteInnsendingstype?: Innsendingstyper) => {
    const { innsendingstype, innsending, aktivtMeldekort } = this.props;
    const typeYtelse = finnTypeYtelsePostfix(aktivtMeldekort.meldegruppe);

    return (
      <>
        <AlertStripe type={'suksess'} className="alertSendt noPrint">
          <FormattedMessage id={'overskrift.meldekort.sendt'} />
        </AlertStripe>

        <section className="seksjon flex-innhold tittel-sprakvelger noPrint">
          <Innholdstittel tag="h2">
            <FormattedMessage id="overskrift.steg4" />
          </Innholdstittel>
          <Sprakvelger />
        </section>
        <section className="seksjon">{this.visOppsummeringsTekster()}</section>
        <section className="seksjon">
          <Meldekortdetaljer
            aktivtMeldekort={this.props.aktivtMeldekort}
            meldekortdetaljer={innsending.meldekortdetaljer}
            typeYtelsePostfix={typeYtelse}
          />
        </section>
        {innsendingstype === Innsendingstyper.INNSENDING &&
          nesteInnsendingstype === Innsendingstyper.ETTERREGISTRERING && (
            <section className="seksjon etterregistrering_info">
              <FormattedMessage id={'sendt.etterregistrering.info'} />
            </section>
          )}
      </>
    );
  };

  render() {
    const {
      knappTekstid,
      nestePath,
      nesteAktivtMeldekort,
      nesteInnsendingstype,
    } = this.returnerPropsVerdier();

    const { personInfo, person, loading, aktivtMeldekort } = this.props;
    const typeYtelse = finnTypeYtelsePostfix(aktivtMeldekort.meldegruppe);

    if (loading) {
      return (
        <div className="meldekort-spinner">
          <NavFrontendSpinner type={'XL'} />
        </div>
      );
    }

    if (
      typeYtelse === TypeYtelse.AAP &&
      nesteAktivtMeldekort == undefined &&
      window['hj']
    ) {
      // @ts-ignore
      window.hj('trigger', 'meldekortAAP');
    } else if (typeYtelse === TypeYtelse.TILTAKSPENGER && window['hj']) {
      // @ts-ignore
      window.hj('trigger', 'meldekortTP');
    }

    return personInfo.personId !== 0 ? (
      <main>
        {this.innhold(nesteInnsendingstype)}
        <section className="seksjon flex-innhold sentrert noPrint">
          <div className="knapper-container lang-knapper">
            {nestePath === Environment().minSideUrl ? (
              <a
                className={'knapp navigasjonsknapp knapp--hoved'}
                href={nestePath}
              >
                <FormattedMessage id={knappTekstid} />
              </a>
            ) : (
              <NavKnapp
                type={KnappTyper.HOVED}
                className={'navigasjonsknapp'}
                tekstid={knappTekstid}
                nestePath={nestePath}
                nesteAktivtMeldekort={nesteAktivtMeldekort}
                nesteInnsendingstype={nesteInnsendingstype}
              />
            )}
            <NavKnapp
              type={KnappTyper.STANDARD}
              nestePath={'/tidligere-meldekort'}
              tekstid={'sendt.linkTilTidligereMeldekort'}
              className={'navigasjonsknapp'}
            />
            <PrintKnapp
              person={person}
              personInfo={personInfo}
              erKvittering={true}
              innholdRenderer={this.innhold}
              prerenderInnhold={true}
            />
          </div>
        </section>
      </main>
    ) : (
      <div className="meldekort-spinner">
        <NavFrontendSpinner type="XL" />
      </div>
    );
  }
}

const mapStateToProps = (state: RootState): MapStateToProps => {
  return {
    aktivtMeldekort: state.aktivtMeldekort,
    router: selectRouter(state),
    innsending: state.innsending,
    innsendingstype: state.innsending.innsendingstype,
    person: state.person,
    sendteMeldekort: state.meldekort,
    personInfo: state.personInfo.personInfo,
    loading: state.ui.loading,
    locale: state.intl.locale,
  };
};

const mapDispatcherToProps = (dispatch: Dispatch): MapDispatchToProps => {
  return {
    settInnsendingstype: (innsendingstype: Innsendingstyper | null) =>
      dispatch(InnsendingActions.leggTilInnsendingstype(innsendingstype)),
    leggTilInnsendtMeldekort: (sendteMeldekort: SendtMeldekort[]) =>
      dispatch(MeldekortActions.leggTilInnsendtMeldekort(sendteMeldekort)),
    hentPersonInfo: () => dispatch(PersonInfoActions.hentPersonInfo.request()),
    settLocale: (locale: string, from: Date) => {
      downloadMessagesAndDispatch(locale, from);
    },
  };
};

export default connect(mapStateToProps, mapDispatcherToProps)(Kvittering);
