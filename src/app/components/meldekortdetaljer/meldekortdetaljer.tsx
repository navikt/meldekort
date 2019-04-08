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
import {Element, Undertittel} from 'nav-frontend-typografi';

import Sporsmalvisning from '../sporsmalvisning/sporsmalvisning';
import {hentUkedagerSomElementListe} from '../../utils/ukedager';
import {hentIntl} from '../../utils/intlUtil';
import HjelpetekstBase from 'nav-frontend-hjelpetekst';
import checkMark from '../../ikoner/check.svg';

interface ErAap {
    erAap: boolean;
}

type Props = MeldekortdetaljerState & ErAap & ReturnType<typeof mapStateToProps>;

const Meldekortdetaljer: React.FunctionComponent<Props> = (props) => {

    let ukedager = hentUkedagerSomElementListe();

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
                    <li key={i}>
                        <Element>{ukedag}</Element>
                        {
                            meldekortDag.arbeidetTimerSum > 0 ?
                                <div className="utfylling">
                                    <FormattedMessage id="utfylling.arbeid"/>
                                    <span> {meldekortDag.arbeidetTimerSum} </span>
                                    {hentIntl().formatMessage({id: 'overskrift.timer'}).trim()}
                                    {sjekkOmDetFinnesFlereElementer('arbeid', meldekortDag) ? <span>,</span> : null}
                                </div> : null
                        }
                        {
                            meldekortDag.kurs ?
                                <div className="utfylling">
                                    {hentIntl().formatMessage({id: 'utfylling.tiltak'}).trim()}
                                    {sjekkOmDetFinnesFlereElementer('kurs', meldekortDag) ? <span>,</span> : null}
                                </div> : null
                        }
                        {
                            meldekortDag.syk ?
                                <div className="utfylling">
                                    {hentIntl().formatMessage({id: 'utfylling.syk'}).trim()}
                                    {sjekkOmDetFinnesFlereElementer('syk', meldekortDag) ? <span>,</span> : null}
                                </div> : null
                        }
                        {
                            meldekortDag.annetFravaer ?
                                <div className="utfylling">
                                    {hentIntl().formatMessage({id: 'utfylling.ferieFravar'}).trim()}
                                </div> : null
                        }
                        {
                            meldekortDag.arbeidetTimerSum > 0 || meldekortDag.kurs || meldekortDag.syk || meldekortDag.annetFravaer ?
                                <HjelpetekstBase id={ukedag + `${i}`} type="auto">
                                    {leggTilHjelpetekster(meldekortDag)}
                                </HjelpetekstBase> : null
                        }
                    </li>
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
                    <hr className="detaljerborder"/>
                    <ul>{dagListe}</ul>
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
                            <HjelpetekstBase id={'forklaring_begrunnelse'} type="auto">
                                <FormattedHTMLMessage id={'forklaring.sporsmal.begrunnelse'}/>
                            </HjelpetekstBase>
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