import {
  InnsendingState,
  SpmSvar,
  UtfyllingFeil,
} from '../../types/innsending';
import * as React from 'react';
import { EkspanderbartpanelBase } from 'nav-frontend-ekspanderbartpanel';
import { Ingress, Innholdstittel } from 'nav-frontend-typografi';
import { ukeTekst } from '../../utils/dates';
import { hentUkedager } from '../../utils/ukedager';
import Aktivitetsrad from '../../sider/innsending/2-utfyllingsside/utfylling/aktivitet/aktivitetsrad';
import Arbeidsrad from '../../sider/innsending/2-utfyllingsside/utfylling/arbeid/arbeidsrad';
import { RootState } from '../../store/configureStore';
import { connect } from 'react-redux';
import { FravaerTypeEnum } from '../../types/meldekort';
import { useState } from 'react';

interface Props {
  ukenummer: number;
  faktiskUkeNummer: string;
  datoTittel: string;
  utfyllingFeil: UtfyllingFeil;
  typeYtelsePostfix: string;
}

interface MapStateToProps {
  innsending: InnsendingState;
}

type UkePanelProps = Props & MapStateToProps;

const UkePanel: React.FunctionComponent<UkePanelProps> = props => {
  const [apen, setApen] = useState(true);
  const toggle = (previous: boolean) => !previous;

  const hentSporsmal = (): SpmSvar[] => {
    return props.innsending.sporsmalsobjekter.map(sporsmalobj => {
      return {
        kategori: sporsmalobj.kategori,
        svar:
          sporsmalobj.checked === undefined
            ? false
            : sporsmalobj.checked.endsWith('ja'),
      };
    });
  };

  const sjekkSporsmal = (kategori: string): boolean => {
    let sporsmalListe = hentSporsmal();
    let sporsmal = sporsmalListe.filter(spm => spm.kategori === kategori);
    if (sporsmal.length !== 0) {
      return sporsmal[0].svar;
    }
    return false;
  };

  return (
    <EkspanderbartpanelBase
      tittel={
        <div className="uke__tittel">
          <Innholdstittel>{`${ukeTekst()} ${
            props.faktiskUkeNummer
          }`}</Innholdstittel>
          <Ingress>{props.datoTittel}</Ingress>
        </div>
      }
      border={true}
      apen={apen}
      onClick={() => setApen(toggle)}
    >
      <div className="uke__panel">
        <div className="ukedager--desktop">{hentUkedager()}</div>
        {sjekkSporsmal('arbeid') ? (
          <Arbeidsrad
            ukeNummer={props.ukenummer}
            feil={props.utfyllingFeil.feilIArbeid.feil}
            feilIDager={props.utfyllingFeil.feilIDagerHorisontal
              .concat(props.utfyllingFeil.feilIDagerVertikal)
              .filter(r => r.rad.includes(FravaerTypeEnum.ARBEIDS_FRAVAER))}
            typeYtelsePostfix={props.typeYtelsePostfix}
            tekstId={'utfylling.arbeid'}
            forklaringId={'forklaring.utfylling.arbeid'}
            bareArbeid={
              !sjekkSporsmal('aktivitetArbeid') &&
              !sjekkSporsmal('forhindret') &&
              !sjekkSporsmal('ferieFravar')
            }
          />
        ) : null}
        {sjekkSporsmal('aktivitetArbeid') ? (
          <Aktivitetsrad
            ukeNummer={props.ukenummer}
            tekstId="utfylling.tiltak"
            forklaringId={'forklaring.utfylling.tiltak'}
            typeYtelsePostfix={props.typeYtelsePostfix}
            feil={props.utfyllingFeil.feilIKurs.feil}
            feilIDager={props.utfyllingFeil.feilIDagerHorisontal
              .concat(props.utfyllingFeil.feilIDagerVertikal)
              .filter(r => r.rad.includes(FravaerTypeEnum.KURS_UTDANNING))}
          />
        ) : null}
        {sjekkSporsmal('forhindret') ? (
          <Aktivitetsrad
            ukeNummer={props.ukenummer}
            tekstId="utfylling.syk"
            forklaringId={'forklaring.utfylling.syk'}
            typeYtelsePostfix={props.typeYtelsePostfix}
            feil={props.utfyllingFeil.feilISyk.feil}
            feilIDager={props.utfyllingFeil.feilIDagerHorisontal
              .concat(props.utfyllingFeil.feilIDagerVertikal)
              .filter(r => r.rad.includes(FravaerTypeEnum.SYKDOM))}
          />
        ) : null}
        {sjekkSporsmal('ferieFravar') ? (
          <Aktivitetsrad
            ukeNummer={props.ukenummer}
            tekstId="utfylling.ferieFravar"
            forklaringId={'forklaring.utfylling.ferieFravar'}
            typeYtelsePostfix={props.typeYtelsePostfix}
            feil={props.utfyllingFeil.feilIFerie.feil}
            feilIDager={props.utfyllingFeil.feilIDagerHorisontal
              .concat(props.utfyllingFeil.feilIDagerVertikal)
              .filter(r => r.rad.includes(FravaerTypeEnum.ANNET_FRAVAER))}
          />
        ) : null}
      </div>
    </EkspanderbartpanelBase>
  );
};

const mapStateToProps = (state: RootState): MapStateToProps => {
  return {
    innsending: state.innsending,
  };
};

export default connect(mapStateToProps, null)(UkePanel);
