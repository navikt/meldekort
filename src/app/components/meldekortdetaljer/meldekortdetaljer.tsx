import * as React from 'react';
import { FormattedMessage } from 'react-intl';

import { MeldekortdetaljerState } from '../../reducers/meldekortdetaljerReducer';
import { MeldekortDag } from '../../types/meldekort';
import { hentNestePeriodeMedUkerOgDato, hentNummerOgDatoForAndreUke, hentNummerOgDatoForForsteUke } from '../../utils/dates';
import { RootState } from '../../store/configureStore';
import { connect } from 'react-redux';

type Props = MeldekortdetaljerState & ReturnType<typeof mapStateToProps>;

const Meldekortdetaljer: React.FunctionComponent<Props> = (props) => {

    let ukedager = [
        <FormattedMessage key={1} id="ukedag.mandag"/>,
        <FormattedMessage key={2} id="ukedag.tirsdag"/>,
        <FormattedMessage key={3} id="ukedag.onsdag"/>,
        <FormattedMessage key={4} id="ukedag.torsdag"/>,
        <FormattedMessage key={5} id="ukedag.fredag"/>,
        <FormattedMessage key={6} id="ukedag.lordag"/>,
        <FormattedMessage key={7} id="ukedag.sondag"/>
    ];

    const hentDagListe = (meldekortdager: MeldekortDag[]) => {
        const dagListe = [];
        for (let i = 0; i < meldekortdager.length; i++) {
            let meldekortDag = meldekortdager[i];
            if (meldekortDag.arbeidetTimerSum > 0 || meldekortDag.kurs || meldekortDag.annetFravaer || meldekortDag.syk) {
                let ukedag = i <= 6 ? ukedager[i] : ukedager[i - 6];
                dagListe.push(
                    <li key={i}>
                        {ukedag}
                        {
                            meldekortDag.arbeidetTimerSum > 0 ?
                                <div>
                                    <FormattedMessage id="utfylling.arbeid"/>
                                    <span> {meldekortDag.arbeidetTimerSum} </span>
                                    <FormattedMessage id="overskrift.timer"/>
                                </div> : null
                        }
                        {
                            meldekortDag.kurs ?
                                <div>
                                    <FormattedMessage id="utfylling.tiltak"/>
                                </div> : null
                        }
                        {
                            meldekortDag.syk ?
                                <div>
                                    <FormattedMessage id="utfylling.syk"/>
                                </div> : null
                        }
                        {
                            meldekortDag.annetFravaer ?
                                <div>
                                    <FormattedMessage id="utfylling.ferieFravar"/>
                                </div> : null
                        }
                    </li>
                );
            }
        }
        return dagListe;
    };

    const uke1 = () => {
        let uke = hentDagListe(props.meldekortdetaljer.sporsmal.meldekortDager.slice(0, 7));

        if (uke.length > 0) {
            return (
                <div>
                    <p>{hentNummerOgDatoForForsteUke(props.aktivtMeldekort.meldekort.meldeperiode.fra)}</p>
                    <ul>{uke}</ul>
                </div>
            );
        }
        return null;
    };

    const uke2 = () => {
        let uke = hentDagListe(props.meldekortdetaljer.sporsmal.meldekortDager.slice(7, 14));

        if (uke.length > 0) {
            return (
                <div>
                    <p>{hentNummerOgDatoForAndreUke(props.aktivtMeldekort.meldekort.meldeperiode.til)}</p>
                    <ul>{uke}</ul>
                </div>
            );
        }
        return null;
    };

    const hentTekstForSvar = (svar: boolean) => {
        if (svar) {
            return <FormattedMessage id="diverse.ja"/>;
        }
        return <FormattedMessage id="diverse.nei"/>;
    };

    return (
        <div className="meldekortdetaljer">
            <div className="sporsmal">
                <section className="seksjon">
                    <FormattedMessage id="sporsmal.arbeid"/>
                    <span> {hentTekstForSvar(props.meldekortdetaljer.sporsmal.arbeidet)} </span>
                </section>
                <section className="seksjon">
                    <FormattedMessage id="sporsmal.aktivitetArbeid"/>
                    <span> {hentTekstForSvar(props.meldekortdetaljer.sporsmal.kurs)} </span>
                </section>
                <section className="seksjon">
                    <FormattedMessage id="sporsmal.forhindret"/>
                    <span> {hentTekstForSvar(props.meldekortdetaljer.sporsmal.syk)} </span>
                </section>
                <section className="seksjon">
                    <FormattedMessage id="sporsmal.ferieFravar"/>
                    <span> {hentTekstForSvar(props.meldekortdetaljer.sporsmal.annetFravaer)} </span>
                </section>
                <section className="seksjon">
                    <FormattedMessage id="sporsmal.registrert"/>
                    <span>
                        {hentNestePeriodeMedUkerOgDato(props.aktivtMeldekort.meldekort.meldeperiode.fra, props.aktivtMeldekort.meldekort.meldeperiode.til)}
                    </span>
                    <span> {hentTekstForSvar(props.meldekortdetaljer.sporsmal.arbeidssoker)} </span>
                </section>
            </div>
            {uke1()}
            {uke2()}
        </div>
    );
};

const mapStateToProps = (state: RootState) => {
    return {
        aktivtMeldekort: state.aktivtMeldekort
    };
};

export default connect(mapStateToProps, null)(Meldekortdetaljer);