import * as React from "react";
import { Innholdstittel } from "nav-frontend-typografi";
import Sprakvelger from "../../../components/sprakvelger/sprakvelger";
import NavKnapp, { KnappTyper } from "../../../components/knapp/navKnapp";
import { Location, RouteProps } from "react-router-dom";
import { RootState } from "../../../store/configureStore";
import { InnsendingActions } from "../../../actions/innsending";
import { Meldekort, MeldekortState, SendtMeldekort } from "../../../types/meldekort";
import { InnsendingState, Innsendingstyper } from "../../../types/innsending";
import { Dispatch } from "redux";
import { connect } from "react-redux";
import { Person, PersonInfo } from "../../../types/person";
import Meldekortdetaljer from "../../../components/meldekortdetaljer/meldekortdetaljer";
import { downloadMessagesAndDispatch, formatHtmlMessage, formatMessage } from "../../../utils/intlUtil";
import Ingress from "nav-frontend-typografi/lib/ingress";
import { formaterDato, formaterUkeOgDatoPeriode, hentTid } from "../../../utils/dates";
import Environment from "../../../utils/env";
import PrintKnapp from "../../../components/print/printKnapp";
import { scrollTilElement } from "../../../utils/scroll";
import { MeldekortActions } from "../../../actions/meldekort";
import {
  meldekortSomKanSendes,
  nesteMeldekortKanSendes,
  returnerMeldekortListaMedFlereMeldekortIgjen
} from "../../../utils/meldekortUtils";
import { PersonInfoActions } from "../../../actions/personInfo";
import { loggAktivitet } from "../../../utils/amplitudeUtils";
import { finnTypeYtelsePostfix, TypeYtelse } from "../../../utils/teksterUtil";
import Panel from "nav-frontend-paneler";
import { Konstanter } from "../../../utils/consts";
import { Alert, Loader } from "@navikt/ds-react";

interface MapStateToProps {
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
  location: Location;
}

type KvitteringsProps = RouteProps &
  MapDispatchToProps &
  MapStateToProps &
  Props;

class Kvittering extends React.Component<KvitteringsProps, object> {
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
    scrollTilElement(undefined, "auto");
    const oppdatertSendteMeldekort = sendteMeldekort;
    const { meldekortId, kortType } = aktivtMeldekort;
    oppdatertSendteMeldekort.sendteMeldekort.push({ meldekortId, kortType });
    leggTilInnsendtMeldekort(oppdatertSendteMeldekort.sendteMeldekort);

    const arbeidsssokerSvar =
      innsending?.meldekortdetaljer?.sporsmal?.arbeidssoker;
    loggAktivitet("Viser kvittering", {
      arbeidssoker: arbeidsssokerSvar ? "ja" : "nei",
      meldegruppe: aktivtMeldekort.meldegruppe || "UKJENT",
      innsendingstype: innsendingstype || "UKJENT",
    });
    loggAktivitet("skjema fullført", {
      meldegruppe: aktivtMeldekort.meldegruppe || "UKJENT",
    });
  }

  returnerPropsVerdier = (): PropsVerdier => {
    const { innsendingstype, person, location, sendteMeldekort } = this.props;
    const urlParams = location?.pathname.split("/");
    urlParams.pop();
    const nestePath = urlParams.join("/");
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
          knappTekstid: "overskrift.nesteMeldekort",
          nestePath: nestePath,
          nesteAktivtMeldekort: paramsForMeldekort.nesteAktivtMeldekort,
          nesteInnsendingstype: paramsForMeldekort.nesteInnsendingstype,
        };
      } else if (harBrukerFlereEtterregistrerteMeldekort) {
        return {
          knappTekstid: "overskrift.etterregistrertMeldekort",
          nestePath: nestePath,
          nesteAktivtMeldekort: paramsForEtterregistrerte.nesteAktivtMeldekort,
          nesteInnsendingstype: paramsForEtterregistrerte.nesteInnsendingstype,
        };
      }
    } else if (innsendingstype === Innsendingstyper.ETTERREGISTRERING) {
      if (harBrukerFlereEtterregistrerteMeldekort) {
        return {
          knappTekstid: "overskrift.etterregistrertMeldekort",
          nestePath: nestePath,
          nesteAktivtMeldekort: paramsForEtterregistrerte.nesteAktivtMeldekort,
          nesteInnsendingstype: paramsForEtterregistrerte.nesteInnsendingstype,
        };
      } else if (harBrukerFlereMeldekort) {
        return {
          knappTekstid: "overskrift.nesteMeldekort",
          nestePath: nestePath,
          nesteAktivtMeldekort: paramsForMeldekort.nesteAktivtMeldekort,
          nesteInnsendingstype: paramsForMeldekort.nesteInnsendingstype,
        };
      }
    }
    return {
      knappTekstid: "tilbake.minSide",
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
    const meldekortErMottatt = formatMessage(
      "sendt.mottatt.label",
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
            {formatMessage("meldekort.for") +
              personInfo.fornavn +
              " " +
              personInfo.etternavn +
              " (" +
              personInfo.fodselsnr +
              ")"}
          </span>
        </Ingress>
        <Ingress>
          <span>
            {formatMessage("meldekort.for.perioden") + ukeOgPeriode}
          </span>
        </Ingress>
        <Ingress>
          <span>{meldekortErMottatt}</span>
        </Ingress>
        {nesteDato && (
          <Ingress className="noPrint">
            <span>
              {formatMessage(
                "sendt.meldekortKanSendes",
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
    const typeYtelsePostfix = finnTypeYtelsePostfix(aktivtMeldekort.meldegruppe);

    return (
      <>
        <Alert variant="success" className="alertSendt noPrint">
          {formatHtmlMessage("overskrift.meldekort.sendt")}
        </Alert>

        {typeYtelsePostfix === TypeYtelse.DAGPENGER &&
          <Panel border={true} className={"alertSendt"}>
            {formatHtmlMessage("sendt.klagerettigheterInfo" + typeYtelsePostfix)}
          </Panel>
        }

        <section className="seksjon flex-innhold tittel-sprakvelger noPrint">
          <Innholdstittel tag="h2">
            {formatHtmlMessage("overskrift.steg4")}
          </Innholdstittel>
          <Sprakvelger />
        </section>
        <section className="seksjon">{this.visOppsummeringsTekster()}</section>
        <section className="seksjon">
          <Meldekortdetaljer
            aktivtMeldekort={this.props.aktivtMeldekort}
            meldekortdetaljer={innsending.meldekortdetaljer}
            typeYtelsePostfix={typeYtelsePostfix}
          />
        </section>
        {innsendingstype === Innsendingstyper.INNSENDING &&
          nesteInnsendingstype === Innsendingstyper.ETTERREGISTRERING && (
            <section className="seksjon etterregistrering_info">
              {formatHtmlMessage("sendt.etterregistrering.info")}
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
    const typeYtelsePostfix = finnTypeYtelsePostfix(aktivtMeldekort.meldegruppe);

    if (loading) {
      return (
        <div className="meldekort-spinner">
          <Loader size="xlarge" />
        </div>
      );
    }

    if (
      typeYtelsePostfix === TypeYtelse.AAP &&
      nesteAktivtMeldekort == undefined &&
      window["hj"]
    ) {
      /* eslint-disable @typescript-eslint/ban-ts-comment */
      // @ts-ignore
      window.hj("trigger", "meldekortAAP");
    } else if (typeYtelsePostfix === TypeYtelse.TILTAKSPENGER && window["hj"]) {
      /* eslint-disable @typescript-eslint/ban-ts-comment */
      // @ts-ignore
      window.hj("trigger", "meldekortTP");
    }

    return personInfo.personId !== 0 ? (
      <main>
        {this.innhold(nesteInnsendingstype)}
        <section className="seksjon flex-innhold sentrert noPrint">
          <div className="knapper-container lang-knapper">
            {nestePath === Environment().minSideUrl ? (
              <a
                className={"knapp navigasjonsknapp knapp--hoved"}
                href={nestePath}
              >
                {formatHtmlMessage(knappTekstid)}
              </a>
            ) : (
              <NavKnapp
                type={KnappTyper.HOVED}
                className={"navigasjonsknapp"}
                tekstid={knappTekstid}
                nestePath={nestePath}
                nesteAktivtMeldekort={nesteAktivtMeldekort}
                nesteInnsendingstype={nesteInnsendingstype}
              />
            )}
            <NavKnapp
              type={KnappTyper.STANDARD}
              nestePath={Konstanter.basePath + "/tidligere-meldekort"}
              tekstid={"sendt.linkTilTidligereMeldekort"}
              className={"navigasjonsknapp"}
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
        <Loader size="xlarge" />
      </div>
    );
  }
}

const mapStateToProps = (state: RootState): MapStateToProps => {
  return {
    aktivtMeldekort: state.aktivtMeldekort,
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
