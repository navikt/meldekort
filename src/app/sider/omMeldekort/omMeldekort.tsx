import * as React from 'react';
import { Innholdstittel, Normaltekst } from 'nav-frontend-typografi';
import Sprakvelger from '../../components/sprakvelger/sprakvelger';
import Veilederpanel from 'nav-frontend-veilederpanel';
import veileder from '../../ikoner/veileder.svg';
import { InnsendingActions } from '../../actions/innsending';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { formatMessage, hentIntl } from '../../utils/intlUtil';
import { MenyActions } from '../../actions/meny';
import { MenyPunkt } from '../../utils/menyConfig';
import { MenyState } from '../../types/meny';
import { Router } from '../../types/router';
import { RootState } from '../../store/configureStore';
import { selectRouter } from '../../selectors/router';
import { scrollTilElement } from '../../utils/scroll';
import { loggAktivitet } from '../../utils/amplitudeUtils';

interface MapStateToProps {
  router: Router;
  meny: MenyState;
}

interface MapDispatchToProps {
  resetInnsending: () => void;
  settValgtMenyPunkt: (menypunkt: MenyPunkt) => void;
}

class OmMeldekort extends React.Component<MapDispatchToProps & MapStateToProps, object> {
  componentDidMount() {
    scrollTilElement(undefined, 'auto');
    const { resetInnsending, meny, settValgtMenyPunkt } = this.props;
    resetInnsending();
    const valgtMenyPunkt = meny.alleMenyPunkter.find(
      mp => mp.urlparam === window.location.pathname.slice(10)
    );
    if (typeof valgtMenyPunkt !== 'undefined') {
      settValgtMenyPunkt(valgtMenyPunkt);
    }
    loggAktivitet('Viser om meldekort');
  }

  render() {
    return (
      <main className="sideinnhold">
        <section className="seksjon flex-innhold tittel-sprakvelger">
          <Innholdstittel>
            {formatMessage("overskrift.genereltOmMeldekort")}
          </Innholdstittel>
          <Sprakvelger />
        </section>
        <Veilederpanel
          type={'plakat'}
          kompakt={true}
          svg={<img alt="" src={veileder} />}
        >
          <section className="seksjon">
            <Normaltekst>
              {formatMessage("genereltOmMeldekort.velkommen")}
            </Normaltekst>
            <Normaltekst>
              {formatMessage("genereltOmMeldekort.velge")}
            </Normaltekst>
            <ul>
              <li>
                {formatMessage("genereltOmMeldekort.valg.sende")}
              </li>
              <li>
                {formatMessage("genereltOmMeldekort.valg.tidligere")}
              </li>
            </ul>
            <Normaltekst>
              {formatMessage(
                "genereltOmMeldekort.om.meldekort",
                {
                  0: 'https://www.nav.no',
                  1: hentIntl()
                    .formatMessage({
                      id: 'genereltOmMeldekort.informasjonOmMeldekortLink',
                    })
                    .trim(),
                }
              )}
            </Normaltekst>
            <Normaltekst>
              {formatMessage("genereltOmMeldekort.oss")}
            </Normaltekst>
          </section>
        </Veilederpanel>
      </main>
    );
  }
}

const mapStateToProps = (state: RootState): MapStateToProps => {
  return {
    router: selectRouter(state),
    meny: state.meny,
  };
};

const mapDispatchToProps = (dispatch: Dispatch): MapDispatchToProps => {
  return {
    resetInnsending: () => dispatch(InnsendingActions.resetInnsending()),
    settValgtMenyPunkt: (menypunkt: MenyPunkt) =>
      dispatch(MenyActions.settValgtMenyPunkt(menypunkt)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(OmMeldekort);
