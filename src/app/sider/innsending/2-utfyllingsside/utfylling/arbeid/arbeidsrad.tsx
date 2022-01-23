import * as React from 'react';
import { Input } from 'nav-frontend-skjema';
import {
  hentUkedager,
  hentUkedagerSomStringListe,
  konverterUkedag,
} from '../../../../../utils/ukedager';
import { FormattedHTMLMessage } from 'react-intl';
import { FeilIDager, InnsendingState } from '../../../../../types/innsending';
import { UtfyltDag } from '../utfyltDagConfig';
import { RootState } from '../../../../../store/configureStore';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import { hentIntl } from '../../../../../utils/intlUtil';
import { Undertittel } from 'nav-frontend-typografi';
import { InnsendingActions } from '../../../../../actions/innsending';
import UtvidetInformasjon from '../../../../../components/utvidetinformasjon/utvidetInformasjon';

interface MapStateToProps {
  innsending: InnsendingState;
}

interface MapDispatchToProps {
  oppdaterDager: (utfylteDager: UtfyltDag[]) => void;
}

interface UkeProps {
  ukeNummer: number;
  typeYtelsePostfix: string;
  tekstId: string;
  forklaringId: string;
  bareArbeid: boolean;
}

type ArbeidsradProps = UkeProps &
  FeilIDager &
  MapStateToProps &
  MapDispatchToProps;

class Arbeidsrad extends React.Component<ArbeidsradProps> {
  setTimer = (event: React.ChangeEvent<HTMLInputElement>, ukedag: number) => {
    const match = event.target.value.match(/^[0-9]?\d{0,2}?([,.]?[0-9]?)?$/);
    if (match !== null) {
      let nyVerdi = event.target.value;
      if (match[0] === ',' || match[0] === '.') {
        nyVerdi = '0.';
      } else if (nyVerdi.includes(',')) {
        nyVerdi = nyVerdi.replace(',', '.');
      }
      const oppdaterteDager = this.props.innsending.utfylteDager.map(dag => {
        if (dag.uke === this.props.ukeNummer && dag.dag === ukedag) {
          return {
            ...dag,
            arbeidetTimer: event.target.value === '' ? undefined : nyVerdi,
          };
        }
        return { ...dag };
      });
      this.props.oppdaterDager(oppdaterteDager);
    }
  };

  finnIndex = (ukedag: number): number => {
    let dagObj = null;
    this.props.innsending.utfylteDager.forEach(dag => {
      if (dag.uke === this.props.ukeNummer && dag.dag === ukedag) {
        dagObj = dag;
      }
    });

    if (dagObj !== null) {
      return this.props.innsending.utfylteDager.indexOf(dagObj, 0);
    }
    return -1;
  };

  settFelter = () => {
    return hentUkedagerSomStringListe().map((dag, index) => {
      let feilLokal: boolean = false;
      let ukedag = konverterUkedag(index);
      let { utfylteDager } = this.props.innsending;
      let utfyltDagIndex = this.finnIndex(ukedag);

      if (typeof this.props.feilIDager !== 'undefined') {
        this.props.feilIDager.forEach(e =>
          e.uke === this.props.ukeNummer && e.dag === ukedag
            ? (feilLokal = true)
            : null
        );
      }

      return (
        <Input
          className="arbeid__inputfelt"
          key={ukedag}
          label={
            <span className="vekk">
              {dag} {hentIntl().formatMessage({ id: this.props.tekstId })}
            </span>
          }
          bredde="XS"
          step={0.5}
          type={'text'}
          value={
            typeof utfylteDager[utfyltDagIndex].arbeidetTimer !== 'undefined'
              ? utfylteDager[utfyltDagIndex].arbeidetTimer
              : ''
          }
          onChange={event => {
            this.setTimer(event, ukedag);
          }}
          feil={
            typeof this.props.feilIDager !== 'undefined'
              ? feilLokal
                ? { feilmelding: '' }
                : undefined
              : undefined
          }
        />
      );
    });
  };

  innhold = () => {
    let {
      tekstId,
      typeYtelsePostfix,
      forklaringId,
      feil,
      bareArbeid,
    } = this.props;
    return (
      <div
        className="arbeidsrad"
        style={{
          backgroundColor: feil ? '#e79999' : '',
          borderBottom: bareArbeid ? 'solid 1px #c6c2bf' : 'none',
        }}
      >
        <Undertittel className={'arbeidsrad__tittel'}>
          <FormattedHTMLMessage id={tekstId} />
        </Undertittel>
        <UtvidetInformasjon>
          <FormattedHTMLMessage id={forklaringId + typeYtelsePostfix} />
        </UtvidetInformasjon>
        <div className="ukedager--mobil">{hentUkedager()}</div>
        <div className="arbeidsrad__inputfelter">{this.settFelter()}</div>
      </div>
    );
  };

  render() {
    return <>{this.innhold()}</>;
  }
}

const mapStateToProps = (state: RootState): MapStateToProps => {
  return {
    innsending: state.innsending,
  };
};

const mapDispatcherToProps = (dispatch: Dispatch): MapDispatchToProps => {
  return {
    oppdaterDager: (utfylteDager: UtfyltDag[]) =>
      dispatch(InnsendingActions.oppdaterUtfylteDager(utfylteDager)),
  };
};

export default connect(mapStateToProps, mapDispatcherToProps)(Arbeidsrad);
