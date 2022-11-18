import React from 'react';
import AlertStripe from 'nav-frontend-alertstriper';
import { FormattedMessage } from 'react-intl';
import { WeblogicPing } from '../../types/weblogic';
import { RootState } from '../../store/configureStore';
import { connect } from 'react-redux';
import { hentLocale } from '../../utils/intlUtil';

interface MapStateToProps {
  weblogic: WeblogicPing;
}

const WeblogicErNedeInfomelding: React.FunctionComponent<MapStateToProps> = props => {
  let weblogic = props.weblogic;

  const hentNedetidsmelding = () => {
    if (weblogic.melding === null) {
      return <FormattedMessage id={'skrivemodusInfomelding'} />;
    } else {
      return hentLocale() === 'nb'
        ? weblogic.melding.norsk
        : weblogic.melding.engelsk;
    }
  };

  return <AlertStripe type={'info'}>{hentNedetidsmelding()}</AlertStripe>;
};

const mapStateToProps = (state: RootState): MapStateToProps => {
  return {
    weblogic: state.weblogic,
  };
};

export default connect(mapStateToProps, null)(WeblogicErNedeInfomelding);
