import React from 'react';
import AlertStripe from 'nav-frontend-alertstriper';
import { FormattedMessage } from 'react-intl';
import { Skrivemodus } from '../../types/skrivemodus';
import { RootState } from '../../store/configureStore';
import { connect } from 'react-redux';
import { hentLocale } from '../../utils/intlUtil';

interface MapStateToProps {
  skrivemodus: Skrivemodus;
}

const SkrivemodusInfomelding: React.FunctionComponent<MapStateToProps> = props => {
  let skrivemodus = props.skrivemodus;

  const hentSkrivemodusInfomelding = () => {
    if (skrivemodus.melding === null) {
      return <FormattedMessage id={'skrivemodusInfomelding'} />;
    } else {
      return hentLocale() === 'nb'
        ? skrivemodus.melding.norsk
        : skrivemodus.melding.engelsk;
    }
  };

  return (
    <AlertStripe type={'info'}>{hentSkrivemodusInfomelding()}</AlertStripe>
  );
};

const mapStateToProps = (state: RootState): MapStateToProps => {
  return {
    skrivemodus: state.skrivemodus,
  };
};

export default connect<{}, {}, MapStateToProps>(mapStateToProps, null)(SkrivemodusInfomelding);
