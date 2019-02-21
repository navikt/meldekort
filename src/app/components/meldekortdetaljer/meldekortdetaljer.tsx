import * as React from 'react';
import { FormattedMessage } from 'react-intl';

import { MeldekortdetaljerState } from '../../reducers/meldekortdetaljerReducer';
import { MeldekortDag } from '../../types/meldekort';

const Meldekortdetaljer: React.FunctionComponent<MeldekortdetaljerState> = (props) => {

    let ukedager = [
        <FormattedMessage key={1} id="ukedag.mandag"/>,
        <FormattedMessage key={2} id="ukedag.tirsdag"/>,
        <FormattedMessage key={3} id="ukedag.onsdag"/>,
        <FormattedMessage key={4} id="ukedag.torsdag"/>,
        <FormattedMessage key={5} id="ukedag.fredag"/>,
        <FormattedMessage key={6} id="ukedag.lordag"/>,
        <FormattedMessage key={7} id="ukedag.sondag"/>
    ];

    const hentUkeListe = (meldekortdager: MeldekortDag[]) => {
        console.log(meldekortdager);
        const ukeListe = [];
        for (let i = 0; i < meldekortdager.length; i++) {
            let meldekortDag = meldekortdager[i];
            if (meldekortDag.arbeidetTimerSum > 0 || meldekortDag.kurs || meldekortDag.annetFravaer || meldekortDag.syk) {
                let ukedag = i <= 6 ? ukedager[i] : ukedager[i - 6];
                ukeListe.push(
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
        return ukeListe;
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
                    <span> {hentTekstForSvar(props.meldekortdetaljer.sporsmal.arbeidssoker)} </span>
                </section>
            </div>
            <p>Uke 1</p>
            <ul> {hentUkeListe(props.meldekortdetaljer.sporsmal.meldekortDager.slice(0, 7))} </ul>
            <p>Uke 2</p>
            <ul> {hentUkeListe(props.meldekortdetaljer.sporsmal.meldekortDager.slice(7, 14))} </ul>
        </div>
    );
};

export default Meldekortdetaljer;