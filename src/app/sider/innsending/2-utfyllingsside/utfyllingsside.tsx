import * as React from "react";
import Sprakvelger from "../../../components/sprakvelger/sprakvelger";
import NavKnapp, { KnappTyper } from "../../../components/knapp/navKnapp";
import { hentDatoForAndreUke, hentDatoForForsteUke, hentUkenummerForDato } from "../../../utils/dates";
import { FeilKolonne, InnsendingState, SpmSvar, UtfyllingFeil } from "../../../types/innsending";
import { RootState } from "../../../store/configureStore";
import { connect } from "react-redux";
import { Konstanter } from "../../../utils/consts";
import { UtfyltDag } from "./utfylling/utfyltDagConfig";
import { downloadMessagesAndDispatch, formatHtmlMessage, formatMessage } from "../../../utils/intlUtil";
import { FravaerTypeEnum, Meldegruppe, Meldekort, SendtMeldekort } from "../../../types/meldekort";
import { scrollTilElement } from "../../../utils/scroll";
import UkePanel from "../../../components/ukepanel/ukepanel";
import { Dispatch } from "redux";
import { InnsendingActions } from "../../../actions/innsending";
import { erAktivtMeldekortGyldig } from "../../../utils/meldekortUtils";
import { Navigate } from "react-router-dom";
import { loggAktivitet } from "../../../utils/amplitudeUtils";
import { finnTypeYtelsePostfix } from "../../../utils/teksterUtil";
import { Alert, Heading, Loader } from "@navikt/ds-react";

interface MapStateToProps {
  innsending: InnsendingState;
  aktivtMeldekort: Meldekort;
  sendteMeldekort: SendtMeldekort[];
  loading: boolean;
  locale: string;
}

interface MapDispatchToProps {
  resetValideringsresultat: () => void;
  settLocale: (locale: string, from: Date) => void;
}

type UtfyllingssideProps = MapStateToProps & MapDispatchToProps;

class Utfyllingsside extends React.Component<
  UtfyllingssideProps,
  UtfyllingFeil
> {
  constructor(props: UtfyllingssideProps) {
    super(props);
    this.state = {
      feilIArbeid: { feil: false },
      feilIKurs: { feil: false },
      feilISyk: { feil: false },
      feilIFerie: { feil: false },
      feilIArbeidetTimerHeleHalve: false,
      feilIArbeidetTimer: false,
      feilKombinasjonSykArbeid: false,
      feilKombinasjonFravaerArbeid: false,
      feilKombinasjonFravaerSyk: false,
      feilIDagerHorisontal: [],
      feilIDagerVertikal: [],
    };
  }

  componentDidMount() {
    const { settLocale, locale, aktivtMeldekort } = this.props;
    settLocale(locale, aktivtMeldekort.meldeperiode.fra);

    scrollTilElement(undefined, "auto");
    loggAktivitet("Viser utfylling");
  }

  hentSporsmal = (): SpmSvar[] => {
    const sporsmalListe: SpmSvar[] = [];
    this.props.innsending.sporsmalsobjekter.forEach(sporsmalobj => {
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

  sjekkSporsmal = (kategori: string): boolean => {
    const sporsmalListe = this.hentSporsmal();
    const sporsmal = sporsmalListe.filter(spm => spm.kategori === kategori);
    if (sporsmal.length !== 0) {
      return sporsmal[0].svar;
    }
    return false;
  };

  validerVertikal = (dager: UtfyltDag[]): boolean => {
    const feil: FeilKolonne[] = [];
    let feilKombinasjonSykArbeid = false;
    let feilKombinasjonFravaerSyk = false;
    let feilKombinasjonFravaerArbeid = false;
    const { meldegruppe } = this.props.aktivtMeldekort;

    if (meldegruppe === Meldegruppe.DAGP) {
      dager.forEach(dag => {
        if (typeof dag.arbeidetTimer !== "undefined") {
          if (Number(dag.arbeidetTimer) > 0 && dag.syk) {
            feil.push({
              uke: dag.uke,
              dag: dag.dag,
              rad: FravaerTypeEnum.ARBEIDS_FRAVAER + FravaerTypeEnum.SYKDOM,
            });
            feilKombinasjonSykArbeid = true;
          }
          if (Number(dag.arbeidetTimer) > 0 && dag.annetFravaer) {
            feil.push({
              uke: dag.uke,
              dag: dag.dag,
              rad:
                FravaerTypeEnum.ARBEIDS_FRAVAER + FravaerTypeEnum.ANNET_FRAVAER,
            });
            feilKombinasjonFravaerArbeid = true;
          }
        }
      });
    }
    if (meldegruppe === Meldegruppe.ATTF) {
      dager.forEach(dag => {
        if (typeof dag.arbeidetTimer !== "undefined") {
          if (Number(dag.arbeidetTimer) > 0 && dag.annetFravaer) {
            feil.push({
              uke: dag.uke,
              dag: dag.dag,
              rad:
                FravaerTypeEnum.ARBEIDS_FRAVAER + FravaerTypeEnum.ANNET_FRAVAER,
            });
            feilKombinasjonFravaerArbeid = true;
          }
        }
        if (dag.syk && dag.annetFravaer) {
          feil.push({
            uke: dag.uke,
            dag: dag.dag,
            rad: FravaerTypeEnum.SYKDOM + FravaerTypeEnum.ANNET_FRAVAER,
          });
          feilKombinasjonFravaerSyk = true;
        }
      });
    }
    if (meldegruppe === Meldegruppe.INDIV) {
      dager.forEach(dag => {
        if (dag.syk && dag.annetFravaer) {
          feil.push({
            uke: dag.uke,
            dag: dag.dag,
            rad: FravaerTypeEnum.SYKDOM + FravaerTypeEnum.ANNET_FRAVAER,
          });
          feilKombinasjonFravaerSyk = true;
        }
      });
    }

    this.setState(prevState => ({
      ...prevState,
      feilIDagerVertikal: feil,
      feilKombinasjonSykArbeid: feilKombinasjonSykArbeid,
      feilKombinasjonFravaerArbeid: feilKombinasjonFravaerArbeid,
      feilKombinasjonFravaerSyk: feilKombinasjonFravaerSyk,
    }));

    return feil.length === 0;
  };

  validerAntallTimerForDag = (dager: UtfyltDag[]): boolean => {
    const feil: FeilKolonne[] = [];
    let feilIArbeidetTimer = false;
    let feilIArbeidetTimerHeleHalve = false;

    dager.forEach(dag => {
      if (typeof dag.arbeidetTimer !== "undefined") {
        if ((Number(dag.arbeidetTimer) * 2) % 1 !== 0) {
          feil.push({
            uke: dag.uke,
            dag: dag.dag,
            rad: FravaerTypeEnum.ARBEIDS_FRAVAER,
          });
          feilIArbeidetTimerHeleHalve = true;
        } else if (
          Number(dag.arbeidetTimer) > 24 ||
          Number(dag.arbeidetTimer) < 0
        ) {
          feil.push({
            uke: dag.uke,
            dag: dag.dag,
            rad: FravaerTypeEnum.ARBEIDS_FRAVAER,
          });
          feilIArbeidetTimer = true;
        }
      }
    });

    this.setState(prevState => ({
      ...prevState,
      feilIDagerHorisontal: feil,
      feilIArbeidetTimerHeleHalve: feilIArbeidetTimerHeleHalve,
      feilIArbeidetTimer: feilIArbeidetTimer,
    }));

    return feil.length === 0;
  };

  valider = (): boolean => {
    this.props.resetValideringsresultat();
    let arbeidet = !this.sjekkSporsmal("arbeid");
    let kurs = !this.sjekkSporsmal("aktivitetArbeid");
    let syk = !this.sjekkSporsmal("forhindret");
    let ferie = !this.sjekkSporsmal("ferieFravar");
    const feilITimer = this.validerAntallTimerForDag(
      this.props.innsending.utfylteDager
    );
    const feilIVertikal = this.validerVertikal(
      this.props.innsending.utfylteDager
    );

    this.props.innsending.utfylteDager.forEach(dag => {
      if (
        !arbeidet &&
        typeof dag.arbeidetTimer !== "undefined" &&
        Number(dag.arbeidetTimer) > 0
      ) {
        arbeidet = true;
      }
      if (!kurs && dag.kurs) {
        kurs = true;
      }
      if (!syk && dag.syk) {
        syk = true;
      }
      if (!ferie && dag.annetFravaer) {
        ferie = true;
      }
    });

    this.setState(prevState => ({
      ...prevState,
      feilIArbeid: { feil: !arbeidet },
      feilIKurs: { feil: !kurs },
      feilISyk: { feil: !syk },
      feilIFerie: { feil: !ferie },
    }));

    const resultat =
      arbeidet && kurs && syk && ferie && feilITimer && feilIVertikal;
    if (!resultat) {
      scrollTilElement("periodebanner");
    }
    return resultat;
  };

  hentFeilmeldinger = () => {
    const {
      feilIArbeid,
      feilIKurs,
      feilISyk,
      feilIFerie,
      feilKombinasjonSykArbeid,
      feilKombinasjonFravaerArbeid,
      feilKombinasjonFravaerSyk,
      feilIArbeidetTimer,
      feilIArbeidetTimerHeleHalve,
    } = this.state;
    const { valideringsResultat } = this.props.innsending;
    if (
      feilIArbeid.feil ||
      feilIKurs.feil ||
      feilISyk.feil ||
      feilIFerie.feil ||
      feilKombinasjonSykArbeid ||
      feilKombinasjonFravaerArbeid ||
      feilKombinasjonFravaerSyk ||
      feilIArbeidetTimer ||
      feilIArbeidetTimerHeleHalve
    ) {
      return (
        <Alert variant="error" className={"utfylling__feilmelding"}>
          <ul>
            {feilIArbeid.feil ? (
              <li>{`${formatMessage("utfylling.mangler.arbeid").trim()}`}</li>
            ) : null}
            {feilIKurs.feil ? (
              <li>{`${formatMessage("utfylling.mangler.tiltak").trim()}`}</li>
            ) : null}
            {feilISyk.feil ? (
              <li>{`${formatMessage("utfylling.mangler.syk").trim()}`}</li>
            ) : null}
            {feilIFerie.feil ? (
              <li>{`${formatMessage("utfylling.mangler.ferieFravar").trim()}`}</li>
            ) : null}
            {feilIArbeidetTimerHeleHalve ? (
              <li>{`${formatMessage("arbeidTimer.heleEllerHalveTallValidator")}`}</li>
            ) : null}
            {feilIArbeidetTimer ? (
              <li>{`${formatMessage("arbeidTimer.rangeValidator.range")}`}</li>
            ) : null}
            {feilKombinasjonSykArbeid ? (
              <li>{`${formatMessage("arbeidTimer.kombinasjonSykArbeidValidator")}`}</li>
            ) : null}
            {feilKombinasjonFravaerArbeid ? (
              <li>{`${formatMessage("arbeidTimer.kombinasjonFravaerArbeidValidator")}`}</li>
            ) : null}
            {feilKombinasjonFravaerSyk ? (
              <li>{`${formatMessage("arbeidTimer.kombinasjonFravaerSykValidator")}`}</li>
            ) : null}
          </ul>
        </Alert>
      );
    } else if (typeof valideringsResultat !== "undefined") {
      if (valideringsResultat.status === "FEIL") {
        return (
          <Alert variant="error" className={"utfylling__feilmelding"}>
            <ul>
              {valideringsResultat.arsakskoder.map(arsakskode => {
                return (
                  <li key={arsakskode.kode}>
                    {formatMessage(
                      "meldekortkontroll.feilkode." + arsakskode.kode.toLowerCase(),
                      {
                        0:
                          arsakskode.params && arsakskode.params.length > 0
                            ? arsakskode.params[0]
                            : "",
                      }
                    )}
                  </li>
                );
              })}
            </ul>
          </Alert>
        );
      }
    }
    return null;
  };

  render() {
    const { aktivtMeldekort, sendteMeldekort, innsending, loading } = this.props;
    const { meldeperiode } = aktivtMeldekort;
    const typeYtelsePostfix = finnTypeYtelsePostfix(
      aktivtMeldekort.meldegruppe
    );

    if (loading) {
      return (
        <div className="meldekort-spinner">
          <Loader size="xlarge" />
        </div>
      );
    }

    return erAktivtMeldekortGyldig(
      aktivtMeldekort,
      sendteMeldekort,
      innsending.innsendingstype
    ) ? (
      <main>
        <section
          id="tittel"
          className="seksjon flex-innhold tittel-sprakvelger"
        >
          <Heading size="large" level="2">
            {formatHtmlMessage("overskrift.steg2")}
          </Heading>
          <Sprakvelger />
        </section>
        <section className="seksjon">
          <div id="feilmelding">{this.hentFeilmeldinger()}</div>
          <div className={"utfylling-container"}>
            <UkePanel
              innsending={innsending}
              ukenummer={Konstanter.forsteUke}
              faktiskUkeNummer={hentUkenummerForDato(
                meldeperiode.fra
              ).toString()}
              datoTittel={hentDatoForForsteUke(meldeperiode.fra)}
              utfyllingFeil={this.state}
              typeYtelsePostfix={typeYtelsePostfix}
            />
            <UkePanel
              innsending={innsending}
              ukenummer={Konstanter.andreUke}
              faktiskUkeNummer={hentUkenummerForDato(
                meldeperiode.til
              ).toString()}
              datoTittel={hentDatoForAndreUke(meldeperiode.til)}
              utfyllingFeil={this.state}
              typeYtelsePostfix={typeYtelsePostfix}
            />
          </div>
        </section>
        <section className="seksjon flex-innhold sentrert">
          <div className={"knapper-container"}>
            <NavKnapp
              type={KnappTyper.HOVED}
              nestePath={"../bekreftelse"}
              tekstid={"naviger.neste"}
              className={"navigasjonsknapp"}
              validering={this.valider}
            />
            <NavKnapp
              type={KnappTyper.STANDARD}
              nestePath={"../sporsmal"}
              tekstid={"naviger.forrige"}
              className={"navigasjonsknapp"}
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
}

const mapStateToProps = (state: RootState): MapStateToProps => {
  return {
    innsending: state.innsending,
    aktivtMeldekort: state.aktivtMeldekort,
    sendteMeldekort: state.meldekort.sendteMeldekort,
    loading: state.ui.loading,
    locale: state.intl.locale,
  };
};

const mapDispatchToProps = (dispatch: Dispatch): MapDispatchToProps => {
  return {
    resetValideringsresultat: () =>
      dispatch(InnsendingActions.resetValideringsresultat()),
    settLocale: (locale: string, from: Date) => {
      downloadMessagesAndDispatch(locale, from);
    },
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(Utfyllingsside);
