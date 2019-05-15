import * as React from 'react';
import { FormattedHTMLMessage } from 'react-intl';
import { hentUkedagerSomStringListe, konverterUkedag, matchUkedager } from '../../../../../utils/ukedager';
import { Checkbox } from 'nav-frontend-skjema';
import { FeilIDager, InnsendingState } from '../../../../../types/innsending';
import { UtfyltDag } from '../utfyllingConfig';
import { RootState } from '../../../../../store/configureStore';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import { hentIntl } from '../../../../../utils/intlUtil';
import { Undertittel } from 'nav-frontend-typografi';
import { InnsendingActions } from '../../../../../actions/innsending';
import UtvidetInformasjon from '../../../../../components/utvidetinformasjon/utvidetInformasjon';

interface MapStateToProps {
    innsending: InnsendingState;
}

interface MapDispatchToProps {
    oppdaterDager: (utfylteDager: UtfyltDag[]) => void;
}

interface RadProps {
    tekstId: string;
    ukeNummer: number;
    aap: boolean;
    forklaringId: string;
}

type AktivitetsradProps = RadProps & FeilIDager & MapStateToProps & MapDispatchToProps;

class Aktivitetsrad extends React.Component<AktivitetsradProps> {
    setVerdi = (ukedag: string) => {
        const oppdaterteDager = this.props.innsending.utfylteDager.map(dag => {
            if (dag.uke === this.props.ukeNummer && matchUkedager(dag.dag, ukedag.trim())) {
                switch (this.props.tekstId) {
                    case 'utfylling.tiltak':
                        return {
                            ...dag,
                            kurs: !dag.kurs,
                        };
                    case 'utfylling.syk':
                        return {
                            ...dag,
                            syk: !dag.syk,
                        };
                    case 'utfylling.ferieFravar':
                        return {
                            ...dag,
                            annetFravaer: !dag.annetFravaer,
                        };
                    default:
                        return {
                            ...dag,
                        };
                }
            }
            return { ...dag };
        });
        this.props.oppdaterDager(oppdaterteDager);
    };

    isChecked = (ukedag: string): boolean => {
        let valgtDag = this.props.innsending.utfylteDager.filter(
            dag => dag.uke === this.props.ukeNummer && matchUkedager(dag.dag, ukedag.trim())
        );
        let checked: boolean = false;
        switch (this.props.tekstId) {
            case 'utfylling.tiltak':
                checked = valgtDag[0].kurs;
                break;
            case 'utfylling.syk':
                checked = valgtDag[0].syk;
                break;
            case 'utfylling.ferieFravar':
                checked = valgtDag[0].annetFravaer;
                break;
            default:
                break;
        }
        return checked;
    };

    settFelter = () => {
        return hentUkedagerSomStringListe().map(dag => {
            let ukedag = konverterUkedag(dag);
            return (
                <Checkbox
                    className="utfylling-checkboks"
                    key={ukedag}
                    label={
                        <span className="vekk">
                            {dag} {hentIntl().formatMessage({ id: this.props.tekstId })}
                        </span>
                    }
                    checked={this.isChecked(ukedag)}
                    onChange={() => {
                        this.setVerdi(ukedag);
                    }}
                />
            );
        });
    };

    hentFarge = () => {
        switch (this.props.tekstId) {
            case 'utfylling.tiltak':
                return { borderLeftColor: '#ffe9cc', backgroundColor: this.props.feil ? '#e79999' : '' };
            case 'utfylling.syk':
                return { borderLeftColor: '#6ab889', backgroundColor: this.props.feil ? '#e79999' : '' };
            case 'utfylling.ferieFravar':
                return { borderLeftColor: '#c1b5d0', backgroundColor: this.props.feil ? '#e79999' : '' };
            default:
                break;
        }
    };

    innhold = () => {
        let { tekstId, aap, forklaringId } = this.props;
        return (
            <div className="aktivitetsrad" style={this.hentFarge()}>
                <Undertittel className={'tittel'}>
                    <FormattedHTMLMessage id={tekstId} />
                </Undertittel>
                <div className="inputrad">{this.settFelter()}</div>
                <UtvidetInformasjon>
                    <FormattedHTMLMessage id={aap ? forklaringId + '-AAP' : forklaringId} />
                </UtvidetInformasjon>
            </div>
        );
    };

    render() {
        return <>{this.innhold()}</>;
    }
}

const mapStateToProps = (state: RootState): MapStateToProps => {
    return {
        innsending: state.innsending,
    };
};

const mapDispatcherToProps = (dispatch: Dispatch): MapDispatchToProps => {
    return {
        oppdaterDager: (utfylteDager: UtfyltDag[]) => dispatch(InnsendingActions.oppdaterUtfylteDager(utfylteDager)),
    };
};

export default connect(
    mapStateToProps,
    mapDispatcherToProps
)(Aktivitetsrad);
