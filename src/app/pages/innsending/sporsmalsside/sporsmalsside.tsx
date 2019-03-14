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
import { getStoredState } from 'redux-persist/es/getStoredState';

interface MapStateToProps {
    aktivtMeldekort: AktivtMeldekortState;
    innsending: InnsendingState;
}

interface MapDispatchToProps {
    oppdaterSvar: (sporsmalsobjekt: Sporsmal[]) => void;
}

interface SpmSvar {
    kategori: string;
    svar: boolean;
}

type SporsmalssideProps = MapStateToProps & MapDispatchToProps;

class Sporsmalsside extends React.Component<SporsmalssideProps, any> {
    constructor(props: SporsmalssideProps) {
        super(props);
    }

    valider = (): boolean => {

        let arbeidet = this.sjekkSporsmal('arbeid');
        let kurs = this.sjekkSporsmal('aktivitetArbeid');
        let syk = this.sjekkSporsmal('forhindret');
        let ferie = this.sjekkSporsmal('ferieFravar');
        let registrert = this.sjekkSporsmal('registrert');

        return arbeidet && kurs && syk && ferie && registrert;
    }

    hentSporsmal = (): SpmSvar[] => {
        let sporsmalListe: SpmSvar[] = [];
        this.props.innsending.sporsmalsobjekter.map(sporsmalobj => {
            console.log(sporsmalobj.kategori + ' ' + typeof sporsmalobj.checked);
            sporsmalListe.push({
                kategori: sporsmalobj.kategori,
                svar: sporsmalobj.checked !== 'undefined'
            });
        });
        return sporsmalListe;
    }

    sjekkSporsmal = (kategori: string): boolean => {
        let sporsmalListe = this.hentSporsmal();
        let sporsmal = sporsmalListe.filter( spm => spm.kategori === kategori);
        if (sporsmal.length !== 0) {
            return sporsmal[0].svar;
        }
        return false;
    }

    render() {
        const meldegruppeErAAP = this.props.aktivtMeldekort.meldekort.meldegruppe !== Meldegruppe.DAGP;

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
                        nestePath={'/innsending/utfylling'}
                        tekstid={'naviger.neste'}
                        className={'navigasjonsknapp'}
                        aktivtMeldekortObjekt={this.props.aktivtMeldekort.meldekort}
                        validering={this.valider}
                    />
                </section>

            </main>
        );

    }
}

// TODO: Bytt til å hente meldekortDetaljer fra Store
const mapStateToProps = (state: RootState): MapStateToProps => {
    const meldekort: AktivtMeldekortState = {meldekort: state.aktivtMeldekort.meldekort};
    return {
       aktivtMeldekort: meldekort,
        innsending: state.innsending
    };
};

const mapDispatcherToProps = (dispatch: Dispatch): MapDispatchToProps => {
    return {
        oppdaterSvar: (sporsmalsobjekter: Sporsmal[]) =>
            dispatch(oppdaterSpm(sporsmalsobjekter))
    };
};

export default connect(mapStateToProps, mapDispatcherToProps)(Sporsmalsside);