import * as React from 'react';
import { connect } from 'react-redux';
import { InnsendingActions } from '../../../../actions/innsending';
import { Dispatch } from 'redux';
import Select from 'nav-frontend-skjema/lib/select';
import { hentIntl } from '../../../../utils/intlUtil';
import { Begrunnelse } from '../../../../types/innsending';
import { RootState } from '../../../../store/configureStore';
import { Undertittel } from 'nav-frontend-typografi';
import UtvidetInformasjon from '../../../../components/utvidetinformasjon/utvidetInformasjon';

interface MapStateToProps {
  begrunnelse: Begrunnelse;
  typeYtelsePostfix: string;
}

interface MapDispatchToProps {
  settBegrunnelse: (begrunnelse: Begrunnelse) => void;
}

interface BegrunnselseProps {
  erFeil: boolean;
}

type Props = MapDispatchToProps & MapStateToProps & BegrunnselseProps;

const BegrunnelseVelger: React.FunctionComponent<Props> = props => {
  const optionsString = hentIntl().messages['korriger.begrunnelse.valg'] as string;
  const options = JSON.parse(optionsString ? optionsString : '{}');

  const handleOnChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    props.settBegrunnelse({
      valgtArsak: event.target.value,
      valgtArsakTekst: options[event.target.value],
      erFeil: event.target.value === '',
    });
  };

  const begrunnelseClass = props.erFeil ? 'feilmelding' : '';

  const { valgtArsak } = props.begrunnelse;

  return (
    <div className={'seksjon begrunnelse ' + begrunnelseClass}>
      <Select
        label={
          <>
            <Undertittel>
              {hentIntl().formatMessage({
                id: 'korrigering.sporsmal.begrunnelse',
              })}
            </Undertittel>
            <UtvidetInformasjon>
              {hentIntl().formatHTMLMessage({
                id: 'forklaring.sporsmal.begrunnelse' + props.typeYtelsePostfix,
              })}
            </UtvidetInformasjon>
          </>
        }
        onChange={handleOnChange}
        value={valgtArsak}
      >
        <option value={''}>
          {' '}
          {hentIntl().formatMessage({ id: 'begrunnelse.velgArsak' })}
        </option>
        {Object.keys(options).map(key => (
          <option value={key} key={options[key]}>
            {' '}
            {options[key]}{' '}
          </option>
        ))}
      </Select>
      {props.erFeil && (
        <span className={'rodTekst'}>
          {hentIntl().formatMessage({ id: 'begrunnelse.required' })}
        </span>
      )}
    </div>
  );
};

const mapStateToProps = (state: RootState) => {
  return {
    begrunnelse: state.innsending.begrunnelse,
  };
};

const mapDispatchToProps = (dispatch: Dispatch): MapDispatchToProps => {
  return {
    settBegrunnelse: (begrunnelse: Begrunnelse) =>
      dispatch(InnsendingActions.settBegrunnelse(begrunnelse)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(BegrunnelseVelger);
