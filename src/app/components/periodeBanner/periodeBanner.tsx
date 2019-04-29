import * as React from 'react';
import Ingress from 'nav-frontend-typografi/lib/ingress';
import Innholdstittel from 'nav-frontend-typografi/lib/innholdstittel';
import { FormattedMessage } from 'react-intl';
import Normaltekst from 'nav-frontend-typografi/lib/normaltekst';
import { hentDatoPeriode, hentUkePeriode } from '../../utils/dates';
import { AktivtMeldekortState } from '../../reducers/aktivtMeldekortReducer';
import { RootState } from '../../store/configureStore';
import { connect } from 'react-redux';

interface MapStateToProps {
    aktivtMeldekort: AktivtMeldekortState;
}

interface PeriodeBannerProps {
    className?: string;
}

type Props = PeriodeBannerProps & MapStateToProps;

const PeriodeBanner: React.FunctionComponent<Props> = (props) => {

    const meldeperiode = props.aktivtMeldekort.meldekort.meldeperiode;
    const { className = '' } = props;

    return (
        <section className={'seksjon periodeBanner ' + className}>
            <Ingress className="flex-innhold sentrert">
                <FormattedMessage id="meldekort.for.perioden"/>
            </Ingress>
            <Innholdstittel className="flex-innhold sentrert">
                {hentUkePeriode(meldeperiode.fra, meldeperiode.til )}
            </Innholdstittel>
            <Normaltekst className="flex-innhold sentrert">
                {hentDatoPeriode(meldeperiode.fra, meldeperiode.til )}
                </Normaltekst>
        </section>
    );
};

const mapStateToProps = (state: RootState): MapStateToProps => {
    return {
        aktivtMeldekort: state.aktivtMeldekort,
    };
};

export default connect(mapStateToProps)(PeriodeBanner);
