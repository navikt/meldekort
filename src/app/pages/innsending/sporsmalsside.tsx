import * as React from 'react';
import { Innholdstittel } from 'nav-frontend-typografi';
import Sprakvelger from '../../components/sprakvelger/sprakvelger';
import { FormattedMessage, FormattedHTMLMessage } from 'react-intl';
import NavKnapp, { knappTyper } from '../../components/knapp/navKnapp';
import AlertStripe from 'nav-frontend-alertstriper';
import SporsmalsGruppe from '../../components/sporsmal/sporsmalsGruppe';
import { connect } from 'react-redux';
import { RootState } from '../../store/configureStore';
import { bindActionCreators, Dispatch } from 'redux';
import { IntlAction } from 'react-intl-redux';
import PeriodeBanner from '../../components/periodeBanner/periodeBanner';
import StegBanner from '../../components/stegindikator/stegBanner';

interface MapStateToProps {

}

interface MapDispatchToProps {

}

type SporsmalssideProps = MapStateToProps & MapDispatchToProps;

class Sporsmalsside extends React.Component<SporsmalssideProps, any> {
    constructor(props: SporsmalssideProps) {
        super(props);
    }

    render() {
        return(
            <main>
                <section className="seksjon">
                    <PeriodeBanner meldekortForPerioden="sfdfs" ukePeriode="adsa" datoPeriode="sdffd"/>
                </section>
                <section className="seksjon">
                    <StegBanner/>
                </section>
                <section className="seksjon flex-innhold tittel-sprakvelger">
                    <Innholdstittel><FormattedMessage id="overskrift.steg1" /></Innholdstittel>
                    <Sprakvelger/>
                </section>
                <section className="seksjon">
                    <AlertStripe solid={true} type="info">
                        <FormattedMessage id="sporsmal.alertstripe.sporsmalstegn" />
                    </AlertStripe>
                </section>

                <section className="seksjon">
                    <SporsmalsGruppe AAP={true}/>
                </section>
                <section className="seksjon">
                    <AlertStripe solid={true} type="info">
                        <FormattedHTMLMessage id="sporsmal.registrertMerknad" />
                    </AlertStripe>
                </section>
                <section className="seksjon flex-innhold sentrert">
                    <NavKnapp
                        type={knappTyper.hoved}
                        nestePath={'/innsending/utfylling'}
                        tekstid={'naviger.neste'}
                        className={'navigasjonsknapp'}
                    />
                </section>

            </main>
        );

    }
}

// TODO: Bytt til å hente meldekortDetaljer fra Store
const mapStateToProps = ({}: RootState) => {
    return {};
};

const mapDispatcherToProps = (dispatch: Dispatch<IntlAction>) =>
    bindActionCreators({}, dispatch);

export default connect(mapStateToProps, mapDispatcherToProps)(Sporsmalsside);