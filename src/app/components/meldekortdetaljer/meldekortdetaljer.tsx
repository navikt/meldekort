import * as React from 'react';
import { FormattedMessage } from 'react-intl';

import { MeldekortdetaljerState } from '../../reducers/meldekortdetaljerReducer';
import { MeldekortDag, SporsmalOgSvar } from '../../types/meldekort';
import { hentNestePeriodeMedUkerOgDato, hentNummerOgDatoForAndreUke, hentNummerOgDatoForForsteUke } from '../../utils/dates';
import { RootState } from '../../store/configureStore';
import { connect } from 'react-redux';
import { Undertittel, Element } from 'nav-frontend-typografi';

import Sporsmalvisning from '../sporsmalvisning/sporsmalvisning';

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
            uke = hentNummerOgDatoForAndreUke(props.aktivtMeldekort.meldekort.meldeperiode.til);
        }

        if (dagListe.length > 0) {
            return (
                <div className="uke">
                    <Undertittel className="uketittel flex-innhold sentrert">{uke}</Undertittel>
                    <hr className="detaljerborder"/>
                    <ul>{dagListe}</ul>
                </div>
            );
        }
        return null;
    };

    const sporsmalOgSvar = (): SporsmalOgSvar[] => {
        return [
            {sporsmalId: 'sporsmal.arbeid', svar: props.meldekortdetaljer.sporsmal.arbeidet},
            {sporsmalId: 'sporsmal.aktivitetArbeid', svar: props.meldekortdetaljer.sporsmal.kurs},
            {sporsmalId: 'sporsmal.forhindret', svar: props.meldekortdetaljer.sporsmal.syk},
            {sporsmalId: 'sporsmal.ferieFravar', svar: props.meldekortdetaljer.sporsmal.annetFravaer},
            {sporsmalId: 'sporsmal.registrert', svar: props.meldekortdetaljer.sporsmal.arbeidssoker,
                formatertDato: hentNestePeriodeMedUkerOgDato(
                    props.aktivtMeldekort.meldekort.meldeperiode.fra,
                    props.aktivtMeldekort.meldekort.meldeperiode.til)
            }
        ];
    };

    return (
        <div className="meldekortdetaljer">
            <div className="sporsmal">
                <Sporsmalvisning sporsmalOgSvar={sporsmalOgSvar()}/>
            </div>
            <div className="ukevisning">
                <section className="seksjon">
                    {hentUkeListe(props.meldekortdetaljer.sporsmal.meldekortDager.slice(0, 7), 1)}
                </section>
                <section className="seksjon">
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