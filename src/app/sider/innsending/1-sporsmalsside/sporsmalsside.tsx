import * as React from "react";
import { useEffect } from "react";
import BegrunnelseVelger from "./begrunnelse/begrunnelseVelger";
import NavKnapp, { KnappTyper } from "../../../components/knapp/navKnapp";
import SporsmalsGruppe from "./sporsmal/sporsmalsGruppe";
import Sprakvelger from "../../../components/sprakvelger/sprakvelger";
import { UtfyltDag } from "../2-utfyllingsside/utfylling/utfyltDagConfig";
import { Begrunnelse, InnsendingState, Innsendingstyper, SpmSvar } from "../../../types/innsending";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import { downloadMessagesAndDispatch, formatHtmlMessage, formatMessage, hentLocale } from "../../../utils/intlUtil";
import { RootState } from "../../../store/configureStore";
import { ikkeFortsetteRegistrertContent } from "../../../components/modal/ikkeFortsetteRegistrertContent";
import { IModal, ModalKnapp } from "../../../types/ui";
import { Innholdstittel } from "nav-frontend-typografi";
import { InnsendingActions } from "../../../actions/innsending";
import { Infomelding, Meldekort, SendtMeldekort } from "../../../types/meldekort";
import { Navigate } from "react-router-dom";
import { scrollTilElement } from "../../../utils/scroll";
import { Sporsmal } from "./sporsmal/sporsmalConfig";
import { UiActions } from "../../../actions/ui";
import { erAktivtMeldekortGyldig } from "../../../utils/meldekortUtils";
import { MeldekortActions } from "../../../actions/meldekort";
import { loggAktivitet } from "../../../utils/amplitudeUtils";
import { finnTypeYtelsePostfix } from "../../../utils/teksterUtil";
import { Konstanter } from "../../../utils/consts";
import { useNavigate } from "react-router";
import { Alert, GuidePanel, Loader } from "@navikt/ds-react";

interface MapStateToProps {
  aktivtMeldekort: Meldekort;
  innsending: InnsendingState;
  sendteMeldekort: SendtMeldekort[];
  infomelding: Infomelding;
  loading: boolean;
  locale: string;
}

interface MapDispatchToProps {
  oppdaterSvar: (sporsmalsobjekt: Sporsmal[]) => void;
  skjulModal: () => void;
  resetSporsmalOgUtfylling: () => void;
  visModal: (modal: IModal) => void;
  settBegrunnelse: (begrunnelse: Begrunnelse) => void;
  oppdaterDager: (utfylteDager: UtfyltDag[]) => void;
  hentInfomelding: () => void;
  settLocale: (locale: string, from: Date) => void;
}

type SporsmalssideProps = MapStateToProps & MapDispatchToProps;

const kategorier = [
  "arbeid",
  "aktivitetArbeid",
  "forhindret",
  "ferieFravar",
  "registrert",
];

const Sporsmalsside: React.FunctionComponent<SporsmalssideProps> = (props) => {
  const valider = (): boolean => {
    const {
      sporsmalsobjekter,
      begrunnelse,
      innsendingstype,
    } = props.innsending;

    const arbeidet = sjekkOmSporsmalErUtfylt(kategorier[0]);
    const kurs = sjekkOmSporsmalErUtfylt(kategorier[1]);
    const syk = sjekkOmSporsmalErUtfylt(kategorier[2]);
    const ferie = sjekkOmSporsmalErUtfylt(kategorier[3]);
    const registrert = sjekkOmSporsmalErUtfylt(kategorier[4]);
    const begrunnelseIkkeValgt =
      begrunnelse.valgtArsak === "" &&
      innsendingstype === Innsendingstyper.KORRIGERING;
    const nySporsmalsobjekterState = sporsmalsobjekter.map(sporsmalsobj => {
      switch (sporsmalsobj.kategori) {
        case kategorier[0]:
          return {
            ...sporsmalsobj,
            feil: {
              erFeil: !arbeidet,
              feilmeldingId: sporsmalsobj.feil.feilmeldingId,
            },
          };
        case kategorier[1]:
          return {
            ...sporsmalsobj,
            feil: {
              erFeil: !kurs,
              feilmeldingId: sporsmalsobj.feil.feilmeldingId,
            },
          };
        case kategorier[2]:
          return {
            ...sporsmalsobj,
            feil: {
              erFeil: !syk,
              feilmeldingId: sporsmalsobj.feil.feilmeldingId,
            },
          };
        case kategorier[3]:
          return {
            ...sporsmalsobj,
            feil: {
              erFeil: !ferie,
              feilmeldingId: sporsmalsobj.feil.feilmeldingId,
            },
          };
        case kategorier[4]:
          return {
            ...sporsmalsobj,
            feil: {
              erFeil: !registrert,
              feilmeldingId: sporsmalsobj.feil.feilmeldingId,
            },
          };
        default:
          return { ...sporsmalsobj };
      }
    });
    props.oppdaterSvar(nySporsmalsobjekterState);
    props.settBegrunnelse({
      valgtArsak: begrunnelse.valgtArsak,
      valgtArsakTekst: begrunnelse.valgtArsakTekst,
      erFeil: begrunnelseIkkeValgt,
    });

    const resultat =
      arbeidet && kurs && syk && ferie && registrert && !begrunnelseIkkeValgt;
    if (!resultat) {
      scrollTilElement("feilmelding", "auto", -120);
      return resultat;
    }

    if (
      innsendingstype === Innsendingstyper.INNSENDING &&
      !fortsetteRegistrert()
    ) {
      props.visModal({
        content: () => ikkeFortsetteRegistrertContent(),
        knapper: ikkeFortsetteRegistrertKnapper(),
        visModal: true,
      });
      resetEndredeKategorier();
      return false;
    }

    resetEndredeKategorier();

    return resultat;
  };

  const resetEndredeKategorier = () => {
    let arbeidet: boolean,
      kurs: boolean,
      syk: boolean,
      ferie: boolean = true;
    hentSvarPaaSporsmal().forEach(spm => {
      switch (spm.kategori) {
        case kategorier[0]:
          arbeidet = spm.svar;
          break;
        case kategorier[1]:
          kurs = spm.svar;
          break;
        case kategorier[2]:
          syk = spm.svar;
          break;
        case kategorier[3]:
          ferie = spm.svar;
          break;
        default:
          break;
      }
    });
    const oppdatertUtfylteDager = props.innsending.utfylteDager.map(
      utfyltDag => {
        return {
          ...utfyltDag,
          arbeidetTimer: arbeidet ? utfyltDag.arbeidetTimer : undefined,
          kurs: kurs ? utfyltDag.kurs : false,
          syk: syk ? utfyltDag.syk : false,
          annetFravaer: ferie ? utfyltDag.annetFravaer : false,
        };
      }
    );
    props.oppdaterDager(oppdatertUtfylteDager);
  }

  const hentSvarPaaSporsmal = (): SpmSvar[] => {
    const sporsmalListe: SpmSvar[] = [];
    props.innsending.sporsmalsobjekter.forEach(sporsmalobj => {
      sporsmalListe.push({
        kategori: sporsmalobj.kategori,
        svar:
          sporsmalobj.checked === undefined
            ? false
            : sporsmalobj.checked.endsWith("ja"),
      });
    });
    return sporsmalListe;
  };

  const fortsetteRegistrert = (): boolean => {
    const sporsmal = hentSvarPaaSporsmal().filter(
      spm => spm.kategori === kategorier[4]
    );
    if (sporsmal.length !== 0) {
      return sporsmal[0].svar;
    }
    return false;
  };

  const hentSporsmal = (): SpmSvar[] => {
    const sporsmalListe: SpmSvar[] = [];

    props.innsending.sporsmalsobjekter.forEach(sporsmalobj => {
      sporsmalListe.push({
        kategori: sporsmalobj.kategori,
        svar: typeof sporsmalobj.checked !== "undefined",
      });
    });
    return sporsmalListe;
  };

  const sjekkOmSporsmalErUtfylt = (kategori: string): boolean => {
    const sporsmalListe = hentSporsmal();
    const sporsmal = sporsmalListe.filter(spm => spm.kategori === kategori);
    if (sporsmal.length !== 0) {
      return sporsmal[0].svar;
    }
    return false;
  };

  const hentFeilmeldinger = (typeYtelsePostfix: string) => {
    const {
      sporsmalsobjekter,
      begrunnelse,
      innsendingstype,
    } = props.innsending;
    const feilIArbeid = sporsmalsobjekter[0].feil.erFeil;
    const feillIKurs = sporsmalsobjekter[1].feil.erFeil;
    const feilISyk = sporsmalsobjekter[2].feil.erFeil;
    const feilIFerie = sporsmalsobjekter[3].feil.erFeil;
    const feilIRegistrert = sporsmalsobjekter[4].feil.erFeil;
    const feilIBegrunnelse =
      begrunnelse.erFeil && innsendingstype === Innsendingstyper.KORRIGERING;

    if (
      feilIArbeid ||
      feillIKurs ||
      feilISyk ||
      feilIFerie ||
      feilIRegistrert ||
      feilIBegrunnelse
    ) {
      return (
        <Alert variant="error">
          <ul>
            {feilIBegrunnelse ? (
              <li>{`${formatMessage("begrunnelse.required")}`}</li>
            ) : null}
            {feilIArbeid ? (
              <li>{`${formatMessage("arbeidet.required")}`}</li>
            ) : null}
            {feillIKurs ? (
              <li>{`${formatMessage("kurs.required" + typeYtelsePostfix)}`}</li>
            ) : null}
            {feilISyk ? (
              <li>{`${formatMessage("syk.required" + typeYtelsePostfix)}`}</li>
            ) : null}
            {feilIFerie ? (
              <li>{`${formatMessage("annetFravar.required" + typeYtelsePostfix)}`}</li>
            ) : null}
            {feilIRegistrert ? (
              <li>{`${formatMessage("fortsetteRegistrert.required")}`}</li>
            ) : null}
          </ul>
        </Alert>
      );
    }
  };

  const hoppeOverUtfylling = (): boolean => {
    let jaSvar = false;
    hentSvarPaaSporsmal().forEach(spm => {
      if (spm.kategori !== kategorier[4] && spm.svar && !jaSvar) {
        jaSvar = true;
      }
    });
    return !jaSvar;
  };

  const resetSporsmalOgUtfyllingHvisAktivtMeldekortIdIkkeErLikInnsendingMeldekortId = () => {
    const {
      aktivtMeldekort,
      innsending,
      resetSporsmalOgUtfylling,
    } = props;
    if (aktivtMeldekort.meldekortId !== innsending.meldekortId) {
      resetSporsmalOgUtfylling();
    }
  };

  const navigate = useNavigate();
  const ikkeFortsetteRegistrertKnapper = (): ModalKnapp[] => {
    return [
      {
        action: () => {
          props.skjulModal();
          navigate(hoppeOverUtfylling() ? "../bekreftelse" : "../utfylling", { replace: true })
        },
        label: formatMessage("overskrift.bekreftOgFortsett"),
        type: KnappTyper.HOVED,
      },
      {
        action: () => {
          props.skjulModal();
        },
        label: formatMessage("sporsmal.tilbakeEndre"),
        type: KnappTyper.STANDARD,
      },
    ];
  };

  useEffect(()=> {
    const {
      aktivtMeldekort,
      hentInfomelding,
      settLocale,
      locale,
      innsending,
      oppdaterSvar,
    } = props;
    settLocale(locale, aktivtMeldekort.meldeperiode.fra);

    scrollTilElement(undefined, "auto");
    hentInfomelding();
    resetSporsmalOgUtfyllingHvisAktivtMeldekortIdIkkeErLikInnsendingMeldekortId();
    if (innsending.innsendingstype === Innsendingstyper.ETTERREGISTRERING) {
      const nySporsmalsobjektState = innsending.sporsmalsobjekter.map(
        spmObj => {
          if (spmObj.kategori === kategorier[4]) {
            return { ...spmObj, checked: kategorier[4] + ".ja" };
          } else {
            return { ...spmObj };
          }
        }
      );
      oppdaterSvar(nySporsmalsobjektState);
    }
    loggAktivitet("Viser spørsmål");
    loggAktivitet("skjema startet", {
      meldegruppe: aktivtMeldekort.meldegruppe || "UKJENT",
    });
  },[])

    const {
      innsending,
      aktivtMeldekort,
      sendteMeldekort,
      infomelding,
      loading,
    } = props;

    if (loading) {
      return (
        <div className="meldekort-spinner">
          <Loader size="xlarge" />
        </div>
      );
    }

    const typeYtelsePostfix = finnTypeYtelsePostfix(
      aktivtMeldekort.meldegruppe
    );
    const brukermelding =
      hentLocale() === "nb" ? infomelding.norsk : infomelding.engelsk;

    return erAktivtMeldekortGyldig(
      aktivtMeldekort,
      sendteMeldekort,
      innsending.innsendingstype
    ) ? (
      <main>
        <section className="seksjon">
          {brukermelding.length > 1 ? (
            <Alert variant="info">{brukermelding}</Alert>
          ) : null}
        </section>
        <section className="seksjon flex-innhold tittel-sprakvelger">
          <Innholdstittel tag="h2">
            {formatHtmlMessage("overskrift.steg1")}
          </Innholdstittel>
          <Sprakvelger />
        </section>
        <section className="seksjon">
          <GuidePanel>
            <div className="item">
              {formatHtmlMessage("sporsmal.lesVeiledning")}
            </div>
            <div className="item">
              {formatHtmlMessage("sporsmal.ansvarForRiktigUtfylling")}
            </div>
          </GuidePanel>
        </section>
        <section id="feilmelding" className="seksjon">
          {hentFeilmeldinger(typeYtelsePostfix)}
        </section>
        {innsending.innsendingstype === Innsendingstyper.KORRIGERING && (
          <section className="seksjon">
            <BegrunnelseVelger
              typeYtelsePostfix={typeYtelsePostfix}
              erFeil={innsending.begrunnelse.erFeil}
            />
          </section>
        )}
        <section className="seksjon">
          <SporsmalsGruppe
            typeYtelsePostfix={typeYtelsePostfix}
            innsending={innsending}
          />
          {innsending.innsendingstype === Innsendingstyper.INNSENDING ? (
            <div className="alertstripe_registrert">
              <Alert variant="warning">
                {formatHtmlMessage("sporsmal.registrertMerknad")}
              </Alert>
            </div>
          ) : null}
        </section>
        <section className="seksjon flex-innhold sentrert">
          <div className={"knapper-container"}>
            <NavKnapp
              type={KnappTyper.HOVED}
              nestePath={
                hoppeOverUtfylling() ? "../bekreftelse" : "../utfylling"
              }
              tekstid={"naviger.neste"}
              className={"navigasjonsknapp"}
              validering={valider}
            />
            <NavKnapp
              type={KnappTyper.FLAT}
              nestePath={ Konstanter.basePath + "/om-meldekort" }
              tekstid={"naviger.avbryt"}
              className={"navigasjonsknapp"}
            />
          </div>
        </section>
      </main>
    ) : (
      <Navigate to={ Konstanter.basePath + "/om-meldekort" } replace />
    );
}

const mapStateToProps = (state: RootState): MapStateToProps => {
  return {
    aktivtMeldekort: state.aktivtMeldekort,
    innsending: state.innsending,
    sendteMeldekort: state.meldekort.sendteMeldekort,
    infomelding: state.meldekort.infomelding,
    loading: state.ui.loading,
    locale: state.intl.locale,
  };
};

const mapDispatcherToProps = (dispatch: Dispatch): MapDispatchToProps => {
  return {
    oppdaterSvar: (sporsmalsobjekter: Sporsmal[]) =>
      dispatch(InnsendingActions.oppdaterSpm(sporsmalsobjekter)),
    skjulModal: () => dispatch(UiActions.skjulModal()),
    visModal: (modal: IModal) => dispatch(UiActions.visModal(modal)),
    resetSporsmalOgUtfylling: () =>
      dispatch(InnsendingActions.resetSporsmalOgUtfylling()),
    settBegrunnelse: (begrunnelsesobj: Begrunnelse) =>
      dispatch(InnsendingActions.settBegrunnelse(begrunnelsesobj)),
    oppdaterDager: (utfylteDager: UtfyltDag[]) =>
      dispatch(InnsendingActions.oppdaterUtfylteDager(utfylteDager)),
    hentInfomelding: () => dispatch(MeldekortActions.hentInfomelding.request()),
    settLocale: (locale: string, from: Date) => {
      downloadMessagesAndDispatch(locale, from);
    },
  };
};

export default connect(mapStateToProps, mapDispatcherToProps)(Sporsmalsside);
