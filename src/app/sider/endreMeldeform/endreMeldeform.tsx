import * as React from 'react';
import { Innholdstittel } from 'nav-frontend-typografi';
import { hentIntl } from '../../utils/intlUtil';
import NavKnapp, { knappTyper } from '../../components/knapp/navKnapp';
import Sprakvelger from '../../components/sprakvelger/sprakvelger';
import Systemtittel from 'nav-frontend-typografi/lib/systemtittel';
import Normaltekst from 'nav-frontend-typografi/lib/normaltekst';
import { MeldeForm, MeldeformDetaljerInn, Person } from '../../types/person';
import { RootState } from '../../store/configureStore';
import { Dispatch } from 'redux';
import { MeldeformActions } from '../../actions/meldeform';
import { connect } from 'react-redux';
import { MeldeformState } from '../../reducers/meldeformReducer';
import { Redirect } from 'react-router';

interface MapStateToProps {
  person: Person;
  meldeform: MeldeformState;
}

interface MapDispatchToProps {
  endreMeldeform: (meldeformDetaljerInn: MeldeformDetaljerInn) => void;
}

type EndreMeldeformProps = MapStateToProps & MapDispatchToProps;

class EndreMeldeform extends React.Component<EndreMeldeformProps, any> {
  sendEndringAvMeldeform = (): boolean => {
    this.props.endreMeldeform({
      meldeformNavn: MeldeForm.ELEKTRONISK.valueOf(),
    });
    return true;
  };

  render() {
    return this.props.person.meldeform === MeldeForm.PAPIR ? (
      <main className="sideinnhold">
        <section className="seksjon flex-innhold tittel-sprakvelger">
          <Innholdstittel>
            {' '}
            {hentIntl().formatMessage({ id: 'overskrift.endreMeldeform' })}{' '}
          </Innholdstittel>
          <Sprakvelger />
        </section>
        <section className="seksjon">
          <Normaltekst className="item">
            {hentIntl().formatMessage({ id: 'endreMeldeform.info' })}
          </Normaltekst>
          <div className="item">
            <Normaltekst>
              {hentIntl().formatMessage({ id: 'endreMeldeform.benytter' })}
              {hentIntl().formatMessage({ id: 'endreMeldeform.papir' })}.
            </Normaltekst>
            <Normaltekst>
              {hentIntl().formatMessage({ id: 'endreMeldeform.bytte' })}
              {hentIntl().formatMessage({ id: 'endreMeldeform.elektronisk' })}?
            </Normaltekst>
          </div>
        </section>
        <section className="seksjon">
          <Systemtittel className="item">
            {hentIntl().formatMessage({
              id: 'overskrift.elektroniskMeldekort',
            })}
          </Systemtittel>
          <Normaltekst className="item">
            {hentIntl().formatMessage({
              id: 'endreMeldeform.info.elektronisk',
            })}
          </Normaltekst>
          <Normaltekst className="item">
            {hentIntl().formatMessage({ id: 'endreMeldeform.endre' })}
          </Normaltekst>
        </section>
        <section className="seksjon flex-innhold sentrert">
          <NavKnapp
            type={knappTyper.hoved}
            nestePath={'/om-meldekort'}
            tekstid={'overskrift.endreMeldeform'}
            validering={this.sendEndringAvMeldeform}
          />
        </section>
      </main>
    ) : (
      <Redirect to="/om-meldekort" />
    );
  }
}

const mapStateToProps = (state: RootState): MapStateToProps => {
  return {
    person: state.person,
    meldeform: state.meldeform,
  };
};

const mapDispatchToProps = (dispatch: Dispatch): MapDispatchToProps => {
  return {
    endreMeldeform: (meldeformDetaljer: MeldeformDetaljerInn) =>
      dispatch(MeldeformActions.endreMeldeform.request(meldeformDetaljer)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(EndreMeldeform);
