import * as React from 'react';
import { Innholdstittel, Normaltekst } from 'nav-frontend-typografi';
import Sprakvelger from '../../../components/sprakvelger/sprakvelger';
import { FormattedHTMLMessage, FormattedMessage } from 'react-intl';
import NavKnapp, { knappTyper } from '../../../components/knapp/navKnapp';
import { InnsendingState } from '../../../types/innsending';
import { AktivtMeldekortState } from '../../../reducers/aktivtMeldekortReducer';
import { RootState } from '../../../store/configureStore';
import { connect } from 'react-redux';
import { MeldekortdetaljerState } from '../../../reducers/meldekortdetaljerReducer';
import { PersonState } from '../../../reducers/personReducer';
import { Meldegruppe, MeldekortDag } from '../../../types/meldekort';
import Meldekortdetaljer from '../../../components/meldekortdetaljer/meldekortdetaljer';
import AlertStripe from 'nav-frontend-alertstriper';
import { hentIntl } from '../../../utils/intlUtil';
import { Checkbox } from 'nav-frontend-skjema';

interface MapStateToProps {
    innsending: InnsendingState;
    aktivtMeldekort: AktivtMeldekortState;
    person: PersonState;
}

type BekreftelseProps = MapStateToProps;

interface Detaljer {
    meldekortdetaljer: MeldekortdetaljerState;
}

class Bekreftelse extends React.Component<BekreftelseProps, Detaljer> {

    constructor(props: BekreftelseProps) {
        super(props);
        this.state = {meldekortdetaljer: this.konverterInnsendingTilMeldekortdetaljer()};
        console.log(this.konverterInnsendingTilMeldekortdetaljer());
    }

    konverterInnsendingTilMeldekortdetaljer = (): MeldekortdetaljerState => {
        let { aktivtMeldekort, innsending, person } = this.props;
        return {
            meldekortdetaljer: {
                id: '',
                personId: person.person.personId,
                fodselsnr: person.person.fodselsnr,
                meldekortId: aktivtMeldekort.meldekort.meldekortId,
                meldeperiode: aktivtMeldekort.meldekort.meldeperiode.periodeKode,
                arkivnokkel: '1-ELEKTRONISK',
                kortType: aktivtMeldekort.meldekort.kortType,
                meldeDato: new Date(),
                lestDato: new Date(),
                begrunnelse: '',
                sporsmal: {
                    arbeidet: innsending.sporsmalsobjekter[0].checked === undefined ? false : innsending.sporsmalsobjekter[0].checked.endsWith('ja'),
                    kurs: innsending.sporsmalsobjekter[1].checked === undefined ? false : innsending.sporsmalsobjekter[1].checked.endsWith('ja'),
                    syk: innsending.sporsmalsobjekter[2].checked === undefined ? false : innsending.sporsmalsobjekter[2].checked.endsWith('ja'),
                    annetFravaer: innsending.sporsmalsobjekter[3].checked === undefined ? false : innsending.sporsmalsobjekter[3].checked.endsWith('ja'),
                    arbeidssoker: innsending.sporsmalsobjekter[4].checked === undefined ? false : innsending.sporsmalsobjekter[4].checked.endsWith('ja'),
                    signatur: true, // Denne kan antakelig brukes til å sette om bruker har bekreftet betinngelesene.
                    meldekortDager: this.hentMeldekortDager()
                }
            }
        };
    }

    hentMeldekortDager = (): MeldekortDag[] => {
        let meldekortdager: MeldekortDag[] = [];
        let dagTeller = 0;
        this.props.innsending.utfylteDager.map( utfyltDag => {
            meldekortdager.push({
                dag: dagTeller,
                arbeidetTimerSum: typeof utfyltDag.arbeidetTimer === 'undefined' ? 0 : utfyltDag.arbeidetTimer,
                syk: utfyltDag.syk,
                kurs: utfyltDag.kurs,
                annetFravaer: utfyltDag.annetFravaer
            });
            dagTeller++;
        });
        return meldekortdager;
    }

    render() {
        let { meldegruppe } = this.props.aktivtMeldekort.meldekort;
        return(
            <main>
                <div className="ikkeSendt">
                    <AlertStripe type={'info'} solid={true}>
                        <span>{
                            `${hentIntl().formatMessage({id: 'overskrift.steg3.info.ikkeSendt'})}
                             ${hentIntl().formatMessage({id: 'overskrift.steg3.info.bekreftVerdier'})}`}
                        </span>
                    </AlertStripe>
                </div>
                <section className="seksjon flex-innhold tittel-sprakvelger">
                    <Innholdstittel><FormattedMessage id="overskrift.steg3" /></Innholdstittel>
                    <Sprakvelger/>
                </section>
                <Meldekortdetaljer meldekortdetaljer={this.state.meldekortdetaljer.meldekortdetaljer} erAap={meldegruppe === Meldegruppe.ATTF}/>
                <div className={'bekreftInfo'}>
                    <Normaltekst><FormattedHTMLMessage id={'utfylling.bekreft'}/></Normaltekst>
                    <Checkbox label={hentIntl().formatMessage({id: 'utfylling.bekreftAnsvar'})}/>
                </div>
                <section className="seksjon flex-innhold sentrert">
                    <NavKnapp
                        type={knappTyper.standard}
                        nestePath={'/innsending/utfylling'}
                        tekstid={'naviger.forrige'}
                        className={'navigasjonsknapp'}
                    />
                    <NavKnapp
                        type={knappTyper.hoved}
                        nestePath={'/innsending/kvittering'}
                        tekstid={'naviger.send'}
                        className={'navigasjonsknapp'}
                    />
                </section>
            </main>
        );
    }
}

const mapStateToProps = (state: RootState): MapStateToProps => {
    const meldekort: AktivtMeldekortState = {meldekort: state.aktivtMeldekort.meldekort};
    return {
        innsending: state.innsending,
        aktivtMeldekort: meldekort,
        person: state.person,
    };
};

export default connect(mapStateToProps, null)(Bekreftelse);
