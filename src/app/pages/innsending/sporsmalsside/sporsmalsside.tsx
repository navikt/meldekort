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
import { hentIntl } from '../../../utils/intlUtil';
import meldekortEpics from '../../../epics/meldekortEpics';
import { scrollToTop } from '../../../utils/scroll';

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

const kategorier = ['arbeid', 'aktivitetArbeid', 'forhindret', 'ferieFravar', 'registrert'];

class Sporsmalsside extends React.Component<SporsmalssideProps, any> {
    constructor(props: SporsmalssideProps) {
        super(props);
    }

    valider = (): boolean => {

        let arbeidet = this.sjekkSporsmal(kategorier[0]);
        let kurs = this.sjekkSporsmal(kategorier[1]);
        let syk = this.sjekkSporsmal(kategorier[2]);
        let ferie = this.sjekkSporsmal(kategorier[3]);
        let registrert = this.sjekkSporsmal(kategorier[4]);

        const nySporsmalsobjekterState = this.props.innsending.sporsmalsobjekter
            .map( sporsmalsobj => {
                switch (sporsmalsobj.kategori) {
                    case kategorier[0]:
                        return { ...sporsmalsobj, feil: {erFeil: !arbeidet, feilmeldingId: sporsmalsobj.feil.feilmeldingId}};
                    case kategorier[1]:
                        return { ...sporsmalsobj, feil: {erFeil: !kurs, feilmeldingId: sporsmalsobj.feil.feilmeldingId}};
                    case kategorier[2]:
                        return { ...sporsmalsobj, feil: {erFeil: !syk, feilmeldingId: sporsmalsobj.feil.feilmeldingId}};
                    case kategorier[3]:
                        return { ...sporsmalsobj, feil: {erFeil: !ferie, feilmeldingId: sporsmalsobj.feil.feilmeldingId}};
                    case kategorier[4]:
                        return { ...sporsmalsobj, feil: {erFeil: !registrert, feilmeldingId: sporsmalsobj.feil.feilmeldingId}};
                    default:
                        return {...sporsmalsobj};
                }
            });
        this.props.oppdaterSvar(nySporsmalsobjekterState);

        let resultat = arbeidet && kurs && syk && ferie && registrert;
        if (!resultat) {
            scrollToTop();
        }

        return resultat;
    }

    hentSporsmal = (): SpmSvar[] => {
        let sporsmalListe: SpmSvar[] = [];

        this.props.innsending.sporsmalsobjekter.map(sporsmalobj => {
            sporsmalListe.push({
                kategori: sporsmalobj.kategori,
                svar: typeof sporsmalobj.checked !== 'undefined'
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

    hentFeilmeldinger = (aap: boolean) => {
        let { sporsmalsobjekter } = this.props.innsending;
        let feilIArbeid = sporsmalsobjekter[0].feil.erFeil;
        let feillIKurs = sporsmalsobjekter[1].feil.erFeil;
        let feilISyk = sporsmalsobjekter[2].feil.erFeil;
        let feilIFerie = sporsmalsobjekter[3].feil.erFeil;
        let feilIRegistrert = sporsmalsobjekter[4].feil.erFeil;

        if (feilIArbeid || feillIKurs || feilISyk || feilIFerie || feilIRegistrert) {
            return (
                <AlertStripe type={'advarsel'} solid={true}>
                    <ul>
                        {feilIArbeid ?
                            <li>{`${hentIntl().formatMessage({id: 'arbeidet.required'})}`}</li> : null
                        }
                        {feillIKurs ?
                            <li>{`${hentIntl().formatMessage({id: 'kurs.required' + (aap ? '-AAP' : '')})}`}</li> : null
                        }
                        {feilISyk ?
                            <li>{`${hentIntl().formatMessage({id: 'syk.required' + (aap ? '-AAP' : '')})}`}</li> : null
                        }
                        {feilIFerie ?
                            <li>{`${hentIntl().formatMessage({id: 'annetFravar.required' + (aap ? '-AAP' : '')})}`}</li> : null
                        }
                        {feilIRegistrert ?
                            <li>{`${hentIntl().formatMessage({id: 'fortsetteRegistrert.required'})}`}</li> : null
                        }
                    </ul>
                </AlertStripe>
            );
        }
    }

    render() {
        const meldegruppeErAAP = this.props.aktivtMeldekort.meldekort.meldegruppe === Meldegruppe.ATTF;
        return (
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
                    {this.hentFeilmeldinger(meldegruppeErAAP)}
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