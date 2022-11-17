import React from 'react';
import AlertStripe from 'nav-frontend-alertstriper';
import { FormattedMessage } from 'react-intl';
import { Lesemodus } from '../../types/lesemodus';
import { RootState } from '../../store/configureStore';
import { connect } from 'react-redux';
import { hentLocale } from '../../utils/intlUtil';

interface MapStateToProps {
  lesemodus: Lesemodus;
}

const NedeInfomelding: React.FunctionComponent<MapStateToProps> = props => {
  let lesemodus = props.lesemodus;

  const hentNedetidsmelding = () => {
    if (lesemodus.melding === null) {
      return <FormattedMessage id={'nedeInfomelding'} />;
    } else {
      return hentLocale() === 'nb'
        ? lesemodus.melding.norsk
        : lesemodus.melding.engelsk;
    }
  };

  return <AlertStripe type={'info'}>{hentNedetidsmelding()}</AlertStripe>;
};

const mapStateToProps = (state: RootState): MapStateToProps => {
  return {
    lesemodus: state.lesemodus,
  };
};

export default connect(mapStateToProps, null)(NedeInfomelding);
