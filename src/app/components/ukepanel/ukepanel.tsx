import { InnsendingState, SpmSvar, UtfyllingFeil } from '../../types/innsending';
import * as React from 'react';
import { EkspanderbartpanelBase } from 'nav-frontend-ekspanderbartpanel';
import { Ingress, Innholdstittel } from 'nav-frontend-typografi';
import { ukeTekst } from '../../utils/dates';
import { hentUkedagerSomStringListe } from '../../utils/ukedager';
import Aktivitetsrad from '../../sider/innsending/2-utfyllingsside/utfylling/aktivitet/aktivitetsrad';
import Arbeidsrad from '../../sider/innsending/2-utfyllingsside/utfylling/arbeid/arbeidsrad';
import { RootState } from '../../store/configureStore';
import { connect } from 'react-redux';

interface Props {
    ukenummer: number;
    faktiskUkeNummer: string;
    datoTittel: string;
    utfyllingFeil: UtfyllingFeil;
    erAap: boolean;
}

interface MapStateToProps {
    innsending: InnsendingState;
}

type UkePanelProps = Props & MapStateToProps;

const UkePanel: React.FunctionComponent<UkePanelProps> = (props) => {
    const hentUkedager = () => {
        return hentUkedagerSomStringListe().map((dag) => {
            return (
                <abbr className="bold" key={'ukedager-' + dag} title={dag}>{dag.toUpperCase()[0]}</abbr>
            );
        });
    };

    const hentSporsmal = (): SpmSvar[] => {
        let sporsmalListe: SpmSvar[] = [];
        props.innsending.sporsmalsobjekter.map(sporsmalobj => {
            sporsmalListe.push({
                kategori: sporsmalobj.kategori,
                svar: sporsmalobj.checked === undefined ? false : sporsmalobj.checked.endsWith('ja')
            });
        });
        return sporsmalListe;
    };

    const sjekkSporsmal = (kategori: string): boolean => {
        let sporsmalListe = hentSporsmal();
        let sporsmal = sporsmalListe.filter( spm => spm.kategori === kategori);
        if (sporsmal.length !== 0) {
            return sporsmal[0].svar;
        }
        return false;
    };

    return (
        <EkspanderbartpanelBase
            heading={
                <div className="uketittel">
                    <Innholdstittel>{`${ukeTekst()} ${props.faktiskUkeNummer}`}</Innholdstittel>
                    <Ingress>{props.datoTittel}</Ingress>
                </div>
            }
            border={true}
            apen={true}
            ariaTittel={`${ukeTekst()} ${props.faktiskUkeNummer} ${props.datoTittel}`}
        >
            <div className="ukepanel">
                <div className="ukedager">
                    {hentUkedager()}
                </div>
                {sjekkSporsmal('arbeid') ?
                    <Arbeidsrad
                        ukeNummer={props.ukenummer}
                        feil={props.utfyllingFeil.feilIArbeid.feil}
                        feilIDager={props.utfyllingFeil.feilIDager}
                        aap={props.erAap}
                        tekstId={'utfylling.arbeid'}
                        forklaringId={'forklaring.utfylling.arbeid'}
                        bareArbeid={
                            !sjekkSporsmal('aktivitetArbeid') &&
                            !sjekkSporsmal('forhindret') &&
                            !sjekkSporsmal('ferieFravar')
                        }
                    /> : null
                }
                {sjekkSporsmal('aktivitetArbeid') ?
                    <Aktivitetsrad
                        ukeNummer={props.ukenummer}
                        tekstId="utfylling.tiltak"
                        forklaringId={'forklaring.utfylling.tiltak'}
                        aap={props.erAap}
                        feil={props.utfyllingFeil.feilIKurs.feil}
                    /> : null
                }
                {sjekkSporsmal('forhindret') ?
                    <Aktivitetsrad
                        ukeNummer={props.ukenummer}
                        tekstId="utfylling.syk"
                        forklaringId={'forklaring.utfylling.syk'}
                        aap={props.erAap}
                        feil={props.utfyllingFeil.feilISyk.feil}
                    /> : null
                }
                {sjekkSporsmal('ferieFravar') ?
                    <Aktivitetsrad
                        ukeNummer={props.ukenummer}
                        tekstId="utfylling.ferieFravar"
                        forklaringId={'forklaring.utfylling.ferieFravar'}
                        aap={props.erAap}
                        feil={props.utfyllingFeil.feilIFerie.feil}
                    /> : null
                }
            </div>
        </EkspanderbartpanelBase>
    );

};

const mapStateToProps = (state: RootState): MapStateToProps => {
    return {
        innsending: state.innsending,
    };
};

export default connect(mapStateToProps, null)(UkePanel);