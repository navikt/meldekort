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
import { hentIntl } from '../../../utils/intlUtil';
import Ingress from 'nav-frontend-typografi/lib/ingress';
import {
  formaterDato,
  formaterUkeOgDatoPeriode,
  hentTid,
} from '../../../utils/dates';
import { AktivtMeldekortActions } from '../../../actions/aktivtMeldekort';
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
import { finnTypeYtelsePostfix } from '../../../utils/teksterUtil';

interface MapStateToProps {
  router: Router;
  person: Person;
  aktivtMeldekort: Meldekort;
  innsending: InnsendingState;
  innsendingstype: Innsendingstyper | null;
  sendteMeldekort: MeldekortState;
  personInfo: PersonInfo;
}

interface PropsVerdier {
  knappTekstid: string;
  nestePath: string;
  nesteAktivtMeldekort: Meldekort | undefined;
  nesteInnsendingstype: Innsendingstyper | undefined;
}

interface MapDispatchToProps {
  leggTilAktivtMeldekort: (aktivtMeldekort: Meldekort) => void;
  settInnsendingstype: (innsendingstype: Innsendingstyper | null) => void;
  leggTilInnsendtMeldekort: (sendteMeldekort: SendtMeldekort[]) => void;
  hentPersonInfo: () => void;
}

type KvitteringsProps = RouteComponentProps &
  MapDispatchToProps &
  MapStateToProps;

class Kvittering extends React.Component<KvitteringsProps> {
  componentDidMount() {
    this.props.hentPersonInfo();
    scrollTilElement(undefined, 'auto');
    let oppdatertSendteMeldekort = this.props.sendteMeldekort;
    let { meldekortId, kortType } = this.props.aktivtMeldekort;
    oppdatertSendteMeldekort.sendteMeldekort.push({ meldekortId, kortType });
    this.props.leggTilInnsendtMeldekort(
      oppdatertSendteMeldekort.sendteMeldekort
    );

    const arbeidsssokerSvar = this.props.innsending?.meldekortdetaljer?.sporsmal
      ?.arbeidssoker;
    loggAktivitet('Viser kvittering', {
      arbeidssoker: arbeidsssokerSvar ? 'ja' : 'nei',
      meldegruppe: this.props.aktivtMeldekort?.meldegruppe || 'UKJENT',
      innsendingstype: this.props.innsendingstype || 'UKJENT',
    });
  }

  returnerPropsVerdier = (): PropsVerdier => {
    const { innsendingstype, person, router, sendteMeldekort } = this.props;
    const urlParams = router.location.pathname.split('/');
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
      knappTekstid: 'tilbake.dittNav',
      nestePath: Environment().dittNavUrl,
      nesteAktivtMeldekort: undefined,
      nesteInnsendingstype: undefined,
    };
  };

  visOppsummeringsTekster = (nesteAktivtMeldekort: Meldekort | undefined) => {
    const { personInfo, innsending, person } = this.props;
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
        <Ingress className="noPrint">
          <span>
            {hentIntl().formatMessage(
              { id: 'sendt.meldekortKanSendes' },
              {
                0: formaterDato(
                  nesteMeldekortKanSendes(
                    nesteAktivtMeldekort,
                    innsendingstype,
                    person
                  )
                ),
              }
            )}
          </span>
        </Ingress>
      </div>
    );
  };

  innhold = (
    nesteAktivtMeldekort?: Meldekort,
    nesteInnsendingstype?: Innsendingstyper
  ) => {
    const { innsendingstype, innsending, aktivtMeldekort } = this.props;
    return (
      <>
        <AlertStripe type={'suksess'} className="alertSendt noPrint">
          <FormattedMessage id={'overskrift.meldekort.sendt'} />
        </AlertStripe>
        <section className="seksjon flex-innhold tittel-sprakvelger noPrint">
          <Innholdstittel>
            <FormattedMessage id="overskrift.steg4" />
          </Innholdstittel>
          <Sprakvelger />
        </section>
        <section className="seksjon">
          {this.visOppsummeringsTekster(nesteAktivtMeldekort)}
        </section>
        <section className="seksjon">
          <Meldekortdetaljer
            aktivtMeldekort={this.props.aktivtMeldekort}
            meldekortdetaljer={innsending.meldekortdetaljer}
            typeYtelsePostfix={finnTypeYtelsePostfix(
              aktivtMeldekort.meldegruppe
            )}
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

    return this.props.personInfo.personId !== 0 ? (
      <main>
        {this.innhold(nesteAktivtMeldekort, nesteInnsendingstype)}
        <section className="seksjon flex-innhold sentrert noPrint">
          <div className="knapper-container lang-knapper">
            {nestePath === Environment().dittNavUrl ? (
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
              person={this.props.person}
              personInfo={this.props.personInfo}
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
  };
};

const mapDispatcherToProps = (dispatch: Dispatch): MapDispatchToProps => {
  return {
    leggTilAktivtMeldekort: (aktivtMeldekort: Meldekort) =>
      dispatch(AktivtMeldekortActions.oppdaterAktivtMeldekort(aktivtMeldekort)),
    settInnsendingstype: (innsendingstype: Innsendingstyper | null) =>
      dispatch(InnsendingActions.leggTilInnsendingstype(innsendingstype)),
    leggTilInnsendtMeldekort: (sendteMeldekort: SendtMeldekort[]) =>
      dispatch(MeldekortActions.leggTilInnsendtMeldekort(sendteMeldekort)),
    hentPersonInfo: () => dispatch(PersonInfoActions.hentPersonInfo.request()),
  };
};

export default connect(mapStateToProps, mapDispatcherToProps)(Kvittering);
