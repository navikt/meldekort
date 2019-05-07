import * as React from 'react';
import { ClassAttributes } from 'react';
import { Ingress, Innholdstittel, Sidetittel } from 'nav-frontend-typografi';
import NavLogo from '../../ikoner/nav-logo.svg';
import { RootState } from '../../store/configureStore';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import { hentIntl } from '../../utils/intlUtil';

/**
 * Innhold som legges her er skult på skjerm, men vises på utskrift
 */

export interface Props extends ClassAttributes<any> {
    active?: boolean;
    erKvittering?: boolean;
}

export interface SideProps extends ClassAttributes<any> {
    tittel?: string;
}

export const Side: React.FunctionComponent<SideProps> = ({
    children,
    tittel
}) => (
    <div className="utskrift__side">
        { tittel && (
            <Sidetittel className="utskrift__sidetittel">{tittel}</Sidetittel>
        )}
        {children}
    </div>
);

const mapStateToProps = (state: RootState) => {
    return {
        person: state.person,
        personInfo: state.personInfo.personInfo
    };
};

type UtskriftProps = Props & ReturnType<typeof mapStateToProps>;

const Utskrift: React.FunctionComponent<UtskriftProps> = props => {
    if (!props.active) {
        return null;
    }

    const { fornavn, etternavn, fodselsnr } = props.personInfo;
    const printTekst = hentIntl().formatMessage({id: 'overskrift.meldekort.sendt'});

    return (
        <div className="utskrift" role="presentation">
            <div className="utskrift__hode">
                <img
                    src={NavLogo}
                    alt=""
                    width="90"
                    height="56"
                />
                {props.erKvittering ?
                    <Innholdstittel className="flex-innhold sentrert">
                        {printTekst}
                    </Innholdstittel> :
                    <>
                        <Ingress className="flex-innhold sentrert">
                            <FormattedMessage id={'meldekort.for'}/>
                        </Ingress>
                        <Innholdstittel className="flex-innhold sentrert">
                            <span>{`${fornavn} ${etternavn} (${fodselsnr})`}</span>
                        </Innholdstittel>
                    </>
                }
            </div>
            <div className="utskrift__innhold">{props.children}</div>
        </div>

    );
};

export default connect(mapStateToProps, null)(Utskrift);
