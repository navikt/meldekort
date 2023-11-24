import * as React from 'react';
import { Ingress, Innholdstittel } from 'nav-frontend-typografi';
import NavLogo from '../../ikoner/nav-logo.svg';
import { RootState } from '../../store/configureStore';
import { connect } from 'react-redux';
import { formatHtmlMessage, formatMessage } from '../../utils/intlUtil';
import classNames from 'classnames';
import { isIE } from '../../utils/browsers';

/**
 * Innhold som legges her er skult på skjerm, men vises på utskrift
 */

export interface Props {
  active?: boolean;
  erKvittering?: boolean;
}

const mapStateToProps = (state: RootState) => {
  return {
    person: state.person,
    personInfo: state.personInfo.personInfo,
  };
};

type UtskriftProps = Props & ReturnType<typeof mapStateToProps>;

const Utskrift: React.FunctionComponent<UtskriftProps> = props => {
  if (!props.active) {
    return null;
  }

  const { fornavn, etternavn, fodselsnr } = props.personInfo;
  const printTekst = formatMessage('overskrift.meldekort.sendt');
  const stylingMedIE = classNames('utskrift', {
    browserSpecificStyling: isIE,
  });
  return (
    <div className={stylingMedIE} role="presentation">
      <div className="utskrift__hode">
        <img src={NavLogo} alt="" width="90" height="56" />
        {props.erKvittering ? (
          <Innholdstittel className="flex-innhold sentrert">
            {printTekst}
          </Innholdstittel>
        ) : (
          <>
            <Ingress className="flex-innhold sentrert">
              {formatHtmlMessage("meldekort.for")}
            </Ingress>
            <Innholdstittel className="flex-innhold sentrert">
              <span>{`${fornavn} ${etternavn} (${fodselsnr})`}</span>
            </Innholdstittel>
          </>
        )}
      </div>
      <div className="utskrift__innhold">{props.children}</div>
    </div>
  );
};

export default connect<object, object, Props>(
  mapStateToProps,
  null
)(Utskrift);
