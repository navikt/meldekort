import * as React from 'react';
import EtikettBase from 'nav-frontend-etiketter';
import Meldekortdetaljer from '../../../components/meldekortdetaljer/meldekortdetaljer';
import PeriodeBanner from '../../../components/periodeBanner/periodeBanner';
import Tabell from '../../../components/tabell/desktop/tabell';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { finnRiktigEtikettKlasse } from '../../../utils/statusEtikettUtil';
import { formaterDato } from '../../../utils/dates';
import { FormattedMessage } from 'react-intl';
import { history, RootState } from '../../../store/configureStore';
import {
  mapKortStatusTilTekst,
  mapKortTypeTilTekst,
} from '../../../utils/kortMapper';
import { MeldekortdetaljerActions } from '../../../actions/meldekortdetaljer';
import { MeldekortdetaljerState } from '../../../reducers/meldekortdetaljerReducer';
import { Router } from '../../../types/router';
import { selectRouter } from '../../../selectors/router';
import utklippstavle from '../../../ikoner/utklippstavle.svg';
import NavFrontendSpinner from 'nav-frontend-spinner';
import NavKnapp, { knappTyper } from '../../../components/knapp/navKnapp';
import { DetaljRad, Meldegruppe, Meldekort } from '../../../types/meldekort';
import { formaterBelop } from '../../../utils/numberFormat';
import { Innsendingstyper } from '../../../types/innsending';
import PrintKnapp from '../../../components/print/printKnapp';
import MobilTabell from '../../../components/tabell/mobil/mobilTabell';
import { PersonInfoActions } from '../../../actions/personInfo';
import { PersonInfo } from '../../../types/person';
import classNames from 'classnames';

interface MapStateToProps {
  meldekortdetaljer: MeldekortdetaljerState;
  aktivtMeldekort: Meldekort;
  router: Router;
  personInfo: PersonInfo;
}

interface MapDispatchToProps {
  hentMeldekortdetaljer: () => void;
  resettMeldekortdetaljer: () => void;
  hentPersonInfo: () => void;
}

type Props = MapDispatchToProps & MapStateToProps;

class Detaljer extends React.Component<Props, { windowSize: number }> {
  constructor(props: any) {
    super(props);
    this.state = {
      windowSize: window.innerWidth,
    };
  }

  settTabellrader = (meldekort: Meldekort): DetaljRad => {
    return {
      meldekortid: meldekort.meldekortId,
      mottattDato: formaterDato(meldekort.mottattDato),
      kortStatus: mapKortStatusTilTekst(meldekort.kortStatus),
      bruttoBelop: formaterBelop(meldekort.bruttoBelop),
      kortType: mapKortTypeTilTekst(meldekort.kortType),
    };
  };

  sjekkAktivtMeldekortOgRedirect = () => {
    if (this.props.aktivtMeldekort.meldekortId === 0) {
      console.log('aktivt medlekortid er null. Redirecter');
      // console.log('aktivt meldekortid: ', this.props.aktivtMeldekort.meldekortId);
      const pathname = this.props.router.location.pathname;
      const tidligereMeldekort = '/tidligere-meldekort';
      pathname !== tidligereMeldekort && history.push(tidligereMeldekort);
    } else {
      console.log('Aktivt meldekortid er ikke null. Henter medlekortdetaljer');
      console.log(
        'aktivt meldekortid: ',
        this.props.aktivtMeldekort.meldekortId
      );
      this.props.hentMeldekortdetaljer();
    }
  };

  componentDidMount() {
    console.log('Resetter meldekortdetaljer');
    this.props.resettMeldekortdetaljer();
    this.sjekkAktivtMeldekortOgRedirect();
    window.addEventListener('resize', this.handleWindowSize);
    if (this.props.personInfo.personId === 0) {
      this.props.hentPersonInfo();
    }
  }

  handleWindowSize = () =>
    this.setState({
      windowSize: window.innerWidth,
    });

  samstemmMeldekortId = () => {
    console.log('Samstemmer');
    const { meldekortdetaljer, aktivtMeldekort } = this.props;
    if (meldekortdetaljer.meldekortdetaljer.id !== '') {
      console.log('Meldekortdetaljer.id er ikke tom!');
      if (
        aktivtMeldekort.meldekortId !==
        meldekortdetaljer.meldekortdetaljer.meldekortId
      ) {
        console.log(
          'Aktivt meldekortid er ikke lik som meldekortdetaljer.meldekortid. Redirecter.'
        );
        console.log('aktivt meldekortid: ', aktivtMeldekort.meldekortId);
        console.log(
          'meldekortdetaljer meldekortid: ',
          meldekortdetaljer.meldekortdetaljer.meldekortId
        );
        history.push('/tidligere-meldekort');
      }
    }
  };

  innhold = () => {
    const { meldekortdetaljer, aktivtMeldekort } = this.props;
    this.samstemmMeldekortId();
    const rows = this.settTabellrader(aktivtMeldekort);
    const columns = [
      {
        key: 'mottattDato',
        label: <FormattedMessage id="overskrift.mottatt" />,
      },
      {
        key: 'kortStatus',
        label: <FormattedMessage id="overskrift.status" />,
        cell: function(row: any, columnKey: any) {
          return (
            <EtikettBase
              type={'info'}
              className={finnRiktigEtikettKlasse(row.kortStatus)}
            >
              {row.kortStatus}
            </EtikettBase>
          );
        },
      },
      {
        key: 'bruttoBelop',
        label: <FormattedMessage id="overskrift.bruttoBelop" />,
      },
      {
        key: 'kortType',
        label: <FormattedMessage id="overskrift.meldekorttype" />,
      },
    ];
    const { meldegruppe } = aktivtMeldekort;

    const erDesktop = this.state.windowSize > 768;

    const mobilTabellStyle = classNames('noPrint', { ikkeVis: erDesktop });
    const vanligTabellStyle = classNames({ ikkeVisMenPrint: !erDesktop });

    return (
      <>
        <img alt="" className="noPrint" src={utklippstavle} />
        <PeriodeBanner />
        <section className="seksjon">
          <div className="tabell-detaljer">
            <div className={vanligTabellStyle}>
              <Tabell rows={[rows]} columns={columns} />
            </div>
            <div className={mobilTabellStyle}>
              <MobilTabell row={rows} columns={columns} />
            </div>
          </div>
        </section>
        <section className="seksjon">
          {meldekortdetaljer.meldekortdetaljer.id !== '' ? (
            <Meldekortdetaljer
              meldekortdetaljer={meldekortdetaljer.meldekortdetaljer}
              erAap={meldegruppe === Meldegruppe.ATTF}
            />
          ) : (
            <div className="meldekort-spinner">
              <NavFrontendSpinner type={'XL'} />
            </div>
          )}
        </section>
      </>
    );
  };

  render() {
    const { aktivtMeldekort, router } = this.props;
    const knappeKlasser = classNames('knapper-container', {
      'lang-knapper': aktivtMeldekort.korrigerbart,
    });
    return (
      <div className="sideinnhold innhold-detaljer">
        {this.innhold()}
        <section className="seksjon flex-innhold sentrert noPrint">
          <div className={knappeKlasser}>
            <NavKnapp
              type={knappTyper.hoved}
              nestePath={'/tidligere-meldekort'}
              tekstid={'naviger.forrige'}
              className={'navigasjonsknapp'}
            />
            {aktivtMeldekort.korrigerbart ? (
              <NavKnapp
                type={knappTyper.standard}
                nestePath={router.location.pathname + '/korriger'}
                tekstid={'korriger.meldekort'}
                className={'navigasjonsknapp'}
                nesteAktivtMeldekort={aktivtMeldekort}
                nesteInnsendingstype={Innsendingstyper.korrigering}
              />
            ) : null}
            <PrintKnapp
              innholdRenderer={this.innhold}
              prerenderInnhold={true}
            />
          </div>
        </section>
      </div>
    );
  }
}

const mapStateToProps = (state: RootState): MapStateToProps => {
  return {
    meldekortdetaljer: state.meldekortdetaljer,
    aktivtMeldekort: state.aktivtMeldekort,
    router: selectRouter(state),
    personInfo: state.personInfo.personInfo,
  };
};

const mapDispatchToProps = (dispatch: Dispatch): MapDispatchToProps => {
  return {
    hentMeldekortdetaljer: () =>
      dispatch(MeldekortdetaljerActions.hentMeldekortdetaljer.request()),
    resettMeldekortdetaljer: () =>
      dispatch(MeldekortdetaljerActions.resetMeldekortdetaljer()),
    hentPersonInfo: () => dispatch(PersonInfoActions.hentPersonInfo.request()),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Detaljer);
