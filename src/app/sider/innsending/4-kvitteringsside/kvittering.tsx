import * as React from 'react';
import { Innholdstittel } from 'nav-frontend-typografi';
import Sprakvelger from '../../../components/sprakvelger/sprakvelger';
import { FormattedMessage } from 'react-intl';
import NavKnapp, { knappTyper } from '../../../components/knapp/navKnapp';
import { RouteComponentProps } from 'react-router-dom';
import { RootState } from '../../../store/configureStore';
import { InnsendingActions } from '../../../actions/innsending';
import {
  KortStatus,
  Meldegruppe,
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
import { isEmpty } from 'ramda';
import Meldekortdetaljer from '../../../components/meldekortdetaljer/meldekortdetaljer';
import { hentIntl } from '../../../utils/intlUtil';
import Ingress from 'nav-frontend-typografi/lib/ingress';
import { formaterDato, formaterUkeOgDatoPeriode, hentTid } from '../../../utils/dates';
import { AktivtMeldekortActions } from '../../../actions/aktivtMeldekort';
import Environment from '../../../utils/env';
import PrintKnapp from '../../../components/print/printKnapp';
import AlertStripe from 'nav-frontend-alertstriper';
import { scrollTilElement } from '../../../utils/scroll';
import { MeldekortActions } from '../../../actions/meldekort';
import { erMeldekortSendtInnTidligere } from '../../../utils/meldekortUtils';
import { PersonInfoActions } from '../../../actions/personInfo';
import NavFrontendSpinner from 'nav-frontend-spinner';

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

type KvitteringsProps = RouteComponentProps & MapDispatchToProps & MapStateToProps;

class Kvittering extends React.Component<KvitteringsProps> {
  componentDidMount() {
    this.props.hentPersonInfo();
    scrollTilElement(undefined, 'auto');
    let oppdatertSendteMeldekort = this.props.sendteMeldekort;
    let { meldekortId, kortType } = this.props.aktivtMeldekort;
    oppdatertSendteMeldekort.sendteMeldekort.push({ meldekortId, kortType });
    this.props.leggTilInnsendtMeldekort(oppdatertSendteMeldekort.sendteMeldekort);
  }

  returnerMeldekortListaMedFlereMeldekortIgjen = (
    meldekort1: Meldekort[],
    innsendingstype1: Innsendingstyper,
    meldekort2: Meldekort[],
    innsendingstype2: Innsendingstyper
  ) => {
    let nesteAktivtMeldekort, nesteInnsendingstype;

    if (!isEmpty(meldekort1)) {
      nesteAktivtMeldekort = meldekort1[0];
      nesteInnsendingstype = innsendingstype1;
    } else {
      nesteAktivtMeldekort = meldekort2[0];
      nesteInnsendingstype = innsendingstype2;
    }
    return {
      nesteAktivtMeldekort: nesteAktivtMeldekort,
      nesteInnsendingstype: nesteInnsendingstype,
    };
  };

  returnerPropsVerdier = (): PropsVerdier => {
    const { innsendingstype, person, router } = this.props;
    const urlParams = router.location.pathname.split('/');
    urlParams.pop();
    const nestePath = urlParams.join('/');
    const meldekort = this.meldekortSomKanSendes(person.meldekort);
    const etterregistrerteMeldekort = this.meldekortSomKanSendes(person.etterregistrerteMeldekort);
    const harBrukerFlereMeldekort = meldekort.length > 0;
    const harBrukerFlereEtterregistrerteMeldekort = etterregistrerteMeldekort.length > 0;
    const paramsForMeldekort = this.returnerMeldekortListaMedFlereMeldekortIgjen(
      meldekort,
      Innsendingstyper.innsending,
      etterregistrerteMeldekort,
      Innsendingstyper.etterregistrering
    );
    const paramsForEtterregistrerte = this.returnerMeldekortListaMedFlereMeldekortIgjen(
      etterregistrerteMeldekort,
      Innsendingstyper.etterregistrering,
      meldekort,
      Innsendingstyper.innsending
    );

    if (innsendingstype === Innsendingstyper.innsending) {
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
    } else if (innsendingstype === Innsendingstyper.etterregistrering) {
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

  meldekortSomKanSendes = (meldekortListe: Meldekort[]): Meldekort[] => {
    return meldekortListe.filter(meldekort => {
      let kanSendes = meldekort.meldeperiode.kanKortSendes;
      if (kanSendes) {
        kanSendes = !erMeldekortSendtInnTidligere(
          meldekort,
          this.props.sendteMeldekort.sendteMeldekort
        );
      }
      return kanSendes;
    });
  };

  nesteMeldekortKanSendes = (nesteAktivtMeldekort: Meldekort) => {
    if (nesteAktivtMeldekort !== undefined) {
      return hentIntl().formatMessage(
        { id: 'sendt.meldekortKanSendes' },
        { [0]: formaterDato(nesteAktivtMeldekort.meldeperiode.kortKanSendesFra) }
      );
    } else if (
      this.props.innsendingstype === Innsendingstyper.innsending &&
      this.props.person.meldekort.length > 0
    ) {
      let mkListe = this.hentMeldekortSomIkkeKanSendesEnda(this.props.person.meldekort);
      if (mkListe.length > 0) {
        return hentIntl().formatMessage(
          { id: 'sendt.meldekortKanSendes' },
          { [0]: formaterDato(mkListe[0].meldeperiode.kortKanSendesFra) }
        );
      }
    } else if (
      this.props.innsendingstype === Innsendingstyper.etterregistrering &&
      this.props.person.etterregistrerteMeldekort.length > 0
    ) {
      let mkListe = this.hentMeldekortSomIkkeKanSendesEnda(
        this.props.person.etterregistrerteMeldekort
      );
      if (mkListe.length > 0) {
        return hentIntl().formatMessage(
          { id: 'sendt.meldekortKanSendes' },
          { [0]: formaterDato(mkListe[0].meldeperiode.kortKanSendesFra) }
        );
      }
    }
  };

  hentMeldekortSomIkkeKanSendesEnda = (meldekortListe: Meldekort[]): Meldekort[] => {
    return meldekortListe.filter(
      meldekort =>
        (meldekort.kortStatus === KortStatus.SENDT || meldekort.kortStatus === KortStatus.OPPRE) &&
        !meldekort.meldeperiode.kanKortSendes
    );
  };

  visOppsummeringsTekster = (nesteAktivtMeldekort: Meldekort) => {
    const { personInfo } = this.props;
    const { meldekortdetaljerInnsending } = this.props.innsending;
    const ukeOgPeriode = formaterUkeOgDatoPeriode(
      meldekortdetaljerInnsending!.meldeperiode.fra,
      meldekortdetaljerInnsending!.meldeperiode.til
    );
    const meldekortErMottatt = hentIntl().formatMessage(
      { id: 'sendt.mottatt.label' },
      {
        [0]: formaterDato(meldekortdetaljerInnsending!.mottattDato),
        [1]: hentTid(meldekortdetaljerInnsending!.mottattDato),
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
          <span>{hentIntl().formatMessage({ id: 'meldekort.for.perioden' }) + ukeOgPeriode}</span>
        </Ingress>
        <Ingress>
          <span>{meldekortErMottatt}</span>
        </Ingress>
        {typeof nesteAktivtMeldekort !== undefined && (
          <Ingress className="noPrint">
            <span>{this.nesteMeldekortKanSendes(nesteAktivtMeldekort)}</span>
          </Ingress>
        )}
      </div>
    );
  };

  innhold = (nesteAktivtMeldekort?: Meldekort, nesteInnsendingstype?: Innsendingstyper) => {
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
        <section className="seksjon">{this.visOppsummeringsTekster(nesteAktivtMeldekort!)}</section>
        <section className="seksjon">
          <Meldekortdetaljer
            meldekortdetaljer={innsending.meldekortdetaljer}
            erAap={aktivtMeldekort.meldegruppe === Meldegruppe.ATTF}
          />
        </section>
        {innsendingstype === Innsendingstyper.innsending &&
          nesteInnsendingstype === Innsendingstyper.etterregistrering && (
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
            <NavKnapp
              type={knappTyper.hoved}
              className={'navigasjonsknapp'}
              tekstid={knappTekstid}
              nestePath={nestePath}
              nesteAktivtMeldekort={nesteAktivtMeldekort}
              nesteInnsendingstype={nesteInnsendingstype}
            />
            <NavKnapp
              type={knappTyper.standard}
              nestePath={'/tidligere-meldekort'}
              tekstid={'sendt.linkTilTidligereMeldekort'}
              className={'navigasjonsknapp'}
            />
            <PrintKnapp
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

export default connect(
  mapStateToProps,
  mapDispatcherToProps
)(Kvittering);
