import * as React from 'react';
import Ingress from 'nav-frontend-typografi/lib/ingress';
import Innholdstittel from 'nav-frontend-typografi/lib/innholdstittel';
import { FormattedMessage } from 'react-intl';
import Normaltekst from 'nav-frontend-typografi/lib/normaltekst';
import { RootState } from '../../store/configureStore';
import { selectRouter } from '../../selectors/router';

interface MapStateToProps {

}

interface PeriodeBannerProps {
    meldekortForPerioden: string;
    ukePeriode: string;
    datoPeriode: string;
}

const PeriodeBanner: React.StatelessComponent<PeriodeBannerProps> = (props) => {

    return (
        <>
            <Ingress className="flex-innhold sentrert">
                <FormattedMessage id={props.meldekortForPerioden}/>
            </Ingress>
            <Innholdstittel className="flex-innhold sentrert">
                {props.ukePeriode}
            </Innholdstittel>
            <Normaltekst className="flex-innhold sentrert">
                {props.datoPeriode}
                </Normaltekst>
        </>
    );
};

const mapStateToProps = (state: RootState): MapStateToProps => {
    return {
        router: selectRouter(state),
    };
};
export default PeriodeBanner;
