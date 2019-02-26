import * as React from 'react';
import { FormattedMessage } from 'react-intl';

import { MeldekortdetaljerState } from '../../reducers/meldekortdetaljerReducer';
import { MeldekortDag } from '../../types/meldekort';
import { hentNestePeriodeMedUkerOgDato, hentNummerOgDatoForAndreUke, hentNummerOgDatoForForsteUke } from '../../utils/dates';
import { RootState } from '../../store/configureStore';
import { connect } from 'react-redux';
import { Undertittel, Element } from 'nav-frontend-typografi';

import checkMark from '../../ikoner/check.svg';

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
                        <Element>{ukedag}</Element>
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

    const hentUkeListe = (meldekortDager: MeldekortDag[], ukeNr: number) => {
        let dagListe = hentDagListe(meldekortDager);

        let uke: string = '';
        if (ukeNr === 1) {
            uke = hentNummerOgDatoForForsteUke(props.aktivtMeldekort.meldekort.meldeperiode.fra);
        } else if (ukeNr === 2) {
            uke = hentNummerOgDatoForAndreUke(props.aktivtMeldekort.meldekort.meldeperiode.til)
        }

        if (dagListe.length > 0) {
            return (
                <div>
                    <Undertittel className="uketittel flex-innhold sentrert">{uke}</Undertittel>
                    <hr className="detaljerborder"/>
                    <ul>{dagListe}</ul>
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
                    <Element><FormattedMessage id="sporsmal.arbeid"/></Element>
                    <img src={checkMark}/>
                    <span> {hentTekstForSvar(props.meldekortdetaljer.sporsmal.arbeidet)} </span>
                </section>
                <section className="seksjon">
                    <Element><FormattedMessage id="sporsmal.aktivitetArbeid"/></Element>
                    <img src={checkMark}/>
                    <span> {hentTekstForSvar(props.meldekortdetaljer.sporsmal.kurs)} </span>
                </section>
                <section className="seksjon">
                    <Element><FormattedMessage id="sporsmal.forhindret"/></Element>
                    <img src={checkMark}/>
                    <span> {hentTekstForSvar(props.meldekortdetaljer.sporsmal.syk)} </span>
                </section>
                <section className="seksjon">
                    <Element><FormattedMessage id="sporsmal.ferieFravar"/></Element>
                    <img src={checkMark}/>
                    <span> {hentTekstForSvar(props.meldekortdetaljer.sporsmal.annetFravaer)} </span>
                </section>
                <section className="seksjon">
                    <Element><FormattedMessage id="sporsmal.registrert"/>
                        <span>
                            {hentNestePeriodeMedUkerOgDato(props.aktivtMeldekort.meldekort.meldeperiode.fra, props.aktivtMeldekort.meldekort.meldeperiode.til)}?
                        </span>
                    </Element>
                    <img src={checkMark}/>
                    <span> {hentTekstForSvar(props.meldekortdetaljer.sporsmal.arbeidssoker)} </span>
                </section>
            </div>
            <div className="ukevisning">
                <section className="uke seksjon">
                    {hentUkeListe(props.meldekortdetaljer.sporsmal.meldekortDager.slice(0, 7), 1)}
                </section>
                <section className="uke seksjon">
                    {hentUkeListe(props.meldekortdetaljer.sporsmal.meldekortDager.slice(7, 14), 2)}
                </section>
            </div>
        </div>
    );
};

const mapStateToProps = (state: RootState) => {
    return {
        aktivtMeldekort: state.aktivtMeldekort
    };
};

export default connect(mapStateToProps, null)(Meldekortdetaljer);