import * as React from 'react';
import { Innholdstittel } from 'nav-frontend-typografi';
import Sprakvelger from '../../../components/sprakvelger/sprakvelger';
import { FormattedMessage, FormattedHTMLMessage } from 'react-intl';
import NavKnapp, { knappTyper } from '../../../components/knapp/navKnapp';
import AlertStripe from 'nav-frontend-alertstriper';
import SporsmalsGruppe from './sporsmal/sporsmalsGruppe';
import { connect } from 'react-redux';
import { RootState } from '../../../store/configureStore';
import { Dispatch } from 'redux';
import { AktivtMeldekortState } from '../../../reducers/aktivtMeldekortReducer';
import { Meldegruppe } from '../../../types/meldekort';
import { oppdaterSpm } from '../../../actions/innsending';
import { Sporsmal } from './sporsmal/sporsmalConfig';
import { InnsendingState } from '../../../types/innsending';
import { RouteComponentProps } from 'react-router';

interface MapStateToProps {
    aktivtMeldekort: AktivtMeldekortState;
    innsending: InnsendingState;
}

interface MapDispatchToProps {
    oppdaterSvar: (sporsmalsobjekt: Sporsmal[]) => void;
}

type SporsmalssideProps = MapStateToProps & MapDispatchToProps & RouteComponentProps;

class Sporsmalsside extends React.Component<SporsmalssideProps, any> {
    constructor(props: SporsmalssideProps) {
        super(props);

    }

    render() {
        const meldegruppeErAAP = this.props.aktivtMeldekort.meldekort.meldegruppe !== Meldegruppe.DAGP;
        const { match } = this.props;
        console.log('match i sporsmalsside: ', match);
        return(
            <main>
                <section className="seksjon flex-innhold tittel-sprakvelger">
                    <Innholdstittel><FormattedMessage id="overskrift.steg1" /></Innholdstittel>
                    <Sprakvelger/>
                </section>
                <section className="seksjon alert">
                    <AlertStripe solid={true} type="info">
                        <div className="item">
                            <FormattedMessage id="sporsmal.lesVeiledning" />
                        </div>
                        <div className="item">
                            <FormattedMessage id="sporsmal.ansvarForRiktigUtfylling" />
                        </div>
                    </AlertStripe>
                </section>

                <section className="seksjon">
                    <SporsmalsGruppe AAP={meldegruppeErAAP}/>
                </section>
                <section className="seksjon">
                    <AlertStripe solid={true} type="info">
                        <FormattedHTMLMessage id="sporsmal.registrertMerknad" />
                    </AlertStripe>
                </section>
                <section className="seksjon flex-innhold sentrert">
                    <NavKnapp
                        type={knappTyper.hoved}
                        nestePath={this.props.innsending+'/utfylling'}
                        tekstid={'naviger.neste'}
                        className={'navigasjonsknapp'}
                        aktivtMeldekortObjekt={this.props.aktivtMeldekort.meldekort}
                    />
                </section>

            </main>
        );

    }
}

// TODO: Bytt til å hente meldekortDetaljer fra Store
const mapStateToProps = (state : RootState): MapStateToProps => {
    const meldekort: AktivtMeldekortState = {meldekort: state.aktivtMeldekort.meldekort};
    return {
       aktivtMeldekort: meldekort,
        innsending: state.innsending
    };
};

const mapDispatcherToProps = (dispatch: Dispatch): MapDispatchToProps =>{
    return {
        oppdaterSvar: (sporsmalsobjekter: Sporsmal[]) =>
            dispatch(oppdaterSpm(sporsmalsobjekter))
    };
}

export default connect(mapStateToProps, mapDispatcherToProps)(Sporsmalsside);