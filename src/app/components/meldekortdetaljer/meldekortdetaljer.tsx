import * as React from 'react';
import {FormattedHTMLMessage, FormattedMessage} from 'react-intl';

import {MeldekortdetaljerState} from '../../reducers/meldekortdetaljerReducer';
import {KortType, MeldekortDag, SporsmalOgSvar} from '../../types/meldekort';
import {
    hentNestePeriodeMedUkerOgDato,
    hentNummerOgDatoForAndreUke,
    hentNummerOgDatoForForsteUke
} from '../../utils/dates';
import {RootState} from '../../store/configureStore';
import {connect} from 'react-redux';
import {Undertittel} from 'nav-frontend-typografi';

import Sporsmalvisning from '../sporsmalvisning/sporsmalvisning';
import {hentUkedagerSomElementListe, hentUkedagerSomStringListe} from '../../utils/ukedager';
import {hentIntl} from '../../utils/intlUtil';
import checkMark from '../../ikoner/check.svg';
import UtvidetInformasjon from "../utvidetinformasjon/utvidetInformasjon";
import {guid} from "nav-frontend-js-utils";

interface ErAap {
    erAap: boolean;
}

type Props = MeldekortdetaljerState & ErAap & ReturnType<typeof mapStateToProps>;

const Meldekortdetaljer: React.FunctionComponent<Props> = (props) => {

    let ukedager = hentUkedagerSomStringListe();

    const sjekkOmDetFinnesFlereElementer = (element: string, meldekortDag: MeldekortDag) => {
        switch (element) {
            case 'arbeid':
                return meldekortDag.kurs || meldekortDag.syk || meldekortDag.annetFravaer;
            case 'kurs':
                return meldekortDag.syk || meldekortDag.annetFravaer;
            case 'syk':
                return meldekortDag.annetFravaer;
            default:
                return false;
        }
    };

    const hentDagListe = (meldekortdager: MeldekortDag[]) => {
        const dagListe = [];
        for (let i = 0; i < meldekortdager.length; i++) {
            let meldekortDag = meldekortdager[i];
            if (meldekortDag.arbeidetTimerSum > 0 || meldekortDag.kurs || meldekortDag.annetFravaer || meldekortDag.syk) {
                let ukedag = i <= 6 ? ukedager[i] : ukedager[i - 6];
                dagListe.push(
                    <div className="dagliste" key={guid()}>
                        <div className="dagliste__dager">
                        <strong>{ukedag}:&nbsp;</strong>
                            <span>
                        {
                            meldekortDag.arbeidetTimerSum > 0 ?
                                `${hentIntl().formatMessage({id: 'utfylling.arbeid'})}
                                ${meldekortDag.arbeidetTimerSum} 
                                ${hentIntl().formatMessage({id: 'overskrift.timer'}).trim()}${
                                sjekkOmDetFinnesFlereElementer('arbeid', meldekortDag) ? ', ' : null}`
                                : null
                        }
                        {
                            meldekortDag.kurs ?
                                `${hentIntl().formatMessage({id: 'utfylling.tiltak'}).trim()}${
                                sjekkOmDetFinnesFlereElementer('kurs', meldekortDag) ? ', ' : null}`
                                : null
                        }
                        {
                            meldekortDag.syk ?
                                `${hentIntl().formatMessage({id: 'utfylling.syk'}).trim()}${
                                sjekkOmDetFinnesFlereElementer('syk', meldekortDag) ? ', ' : null}`
                                : null
                        }
                        {
                            meldekortDag.annetFravaer ?
                                `${hentIntl().formatMessage({id: 'utfylling.ferieFravar'}).trim()}`
                                : null
                        }
                            </span>
                        </div>
                        {
                            meldekortDag.arbeidetTimerSum > 0 || meldekortDag.kurs || meldekortDag.syk || meldekortDag.annetFravaer ?
                             <UtvidetInformasjon>
                                 {leggTilHjelpetekster(meldekortDag)}
                             </UtvidetInformasjon> : null
                        }
                    </div>
                );
            }
        }
        return dagListe;
    };

    const leggTilHjelpetekster = (meldekortDag: MeldekortDag) => {
        let aap = '';
        if (props.erAap) {
            aap = '-AAP';
        }
        return (
            <span className={'meldekortdetaljer-utfyllt-hjelpetekster'}>
                {meldekortDag.arbeidetTimerSum > 0 ?
                    <span>
                        <span className={'overskrift-hjelpetekst'}>
                            <strong>{hentIntl().formatMessage({id: 'utfylling.arbeid'}).toUpperCase()}</strong>
                        </span>
                        <FormattedHTMLMessage id={'forklaring.utfylling.arbeid' + aap}/>
                    </span> : null
                }
                {meldekortDag.kurs ?
                    <span>
                        <span className={'overskrift-hjelpetekst'}>
                            <strong>{hentIntl().formatMessage({id: 'utfylling.tiltak'}).toUpperCase()}</strong>
                        </span>
                        <FormattedHTMLMessage id={'forklaring.utfylling.tiltak' + aap}/>
                    </span> : null
                }
                {meldekortDag.syk ?
                    <span>
                        <span className={'overskrift-hjelpetekst'}>
                            <strong>{hentIntl().formatMessage({id: 'utfylling.syk'}).toUpperCase()}</strong>
                        </span>
                        <FormattedHTMLMessage id={'forklaring.utfylling.syk' + aap}/>
                    </span> : null
                }
                {meldekortDag.annetFravaer ?
                    <span>
                        <span className={'overskrift-hjelpetekst'}>
                            <strong>{hentIntl().formatMessage({id: 'utfylling.ferieFravar'}).toUpperCase()}</strong>
                        </span>
                        <FormattedHTMLMessage id={'forklaring.utfylling.ferieFravar' + aap}/>
                    </span> : null
                }
            </span>
        );
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
                    <hr className="detaljerborder noPrint"/>
                    <>{dagListe}</>
                </div>
            );
        }
        return null;
    };

    const sporsmalOgSvar = (): SporsmalOgSvar[] => {
        let aap = '';
        if (props.erAap) {
            aap = '-AAP';
        }
        return [
            {sporsmalId: 'sporsmal.arbeid', svar: props.meldekortdetaljer.sporsmal.arbeidet,
                forklaring: 'forklaring.sporsmal.arbeid' + aap},
            {sporsmalId: 'sporsmal.aktivitetArbeid' + aap, svar: props.meldekortdetaljer.sporsmal.kurs,
                forklaring: 'forklaring.sporsmal.aktivitetArbeid' + aap},
            {sporsmalId: 'sporsmal.forhindret' + aap, svar: props.meldekortdetaljer.sporsmal.syk,
                forklaring: 'forklaring.sporsmal.forhindret' + aap},
            {sporsmalId: 'sporsmal.ferieFravar' + aap, svar: props.meldekortdetaljer.sporsmal.annetFravaer,
                forklaring: 'forklaring.sporsmal.ferieFravar' + aap},
            {sporsmalId: 'sporsmal.registrert', svar: props.meldekortdetaljer.sporsmal.arbeidssoker,
                forklaring: 'forklaring.sporsmal.registrert'  + aap,
                formatertDato: hentNestePeriodeMedUkerOgDato(
                    props.aktivtMeldekort.meldekort.meldeperiode.fra,
                    props.aktivtMeldekort.meldekort.meldeperiode.til)
            }
        ];
    };

    const visBegrunnelse = () => {
        if (typeof props.meldekortdetaljer.begrunnelse !== 'undefined') {
            const begrunnelse = String(props.meldekortdetaljer.begrunnelse);
            if(begrunnelse.length > 0) {
                return (
                    <section className="seksjon">
                        <div className="flex-sporsmal-hjelpetekst-container">
                            <Undertittel><FormattedMessage id={'korrigering.sporsmal.begrunnelse'}/></Undertittel>
                            <UtvidetInformasjon>
                                <FormattedHTMLMessage id={'forklaring.sporsmal.begrunnelse'}/>
                            </UtvidetInformasjon>
                        </div>
                        <img alt={'checkmark'} src={checkMark}/>
                        <span>{props.meldekortdetaljer.begrunnelse}</span>
                    </section>
                );
            }
        }
        return null;
    };

    return (
        <div className="meldekortdetaljer">
            <div className="sporsmal">
                {visBegrunnelse()}
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