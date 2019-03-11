import * as React from 'react';
import { FormattedHTMLMessage } from 'react-intl';
import { hentUkedagerSomStringListe } from '../../../../../utils/ukedager';
import { Checkbox } from 'nav-frontend-skjema';
import { FeilIDager, InnsendingState } from '../../../../../types/innsending';
import { UtfyltDag } from '../utfyllingConfig';
import { RootState } from '../../../../../store/configureStore';
import { Dispatch } from 'redux';
import { oppdaterUtfylteDager } from '../../../../../actions/innsending';
import { connect } from 'react-redux';

interface MapStateToProps {
    innsending: InnsendingState;
}

interface MapDispatchToProps {
    oppdaterDager: (utfylteDager: UtfyltDag[]) => void;
}

interface RadProps {
    tekstId: string;
    ukeNummer: number;
}

type AktivitetsradProps = RadProps & FeilIDager & MapStateToProps & MapDispatchToProps;

class Aktivitetsrad extends React.Component<AktivitetsradProps> {

    constructor(props: AktivitetsradProps) {
        super(props);
    }

    setVerdi = (ukedag: string) => {
        const oppdaterteDager = this.props.innsending.utfylteDager.map( dag => {
            if (dag.uke === this.props.ukeNummer && dag.dag === ukedag.trim()) {
                switch (this.props.tekstId) {
                    case 'utfylling.tiltak':
                        return {
                            ...dag,
                            kurs: !(dag.kurs)
                        };
                    case 'utfylling.syk':
                       return {
                           ...dag,
                            syk: !(dag.syk)
                       };
                    case 'utfylling.ferieFravar':
                        return {
                            ...dag,
                            annetFravaer: !(dag.annetFravaer)
                        };
                    default:
                        return {
                            ...dag
                        };
                }
            }
            return {...dag};
        });
        this.props.oppdaterDager(oppdaterteDager);
    }

    isChecked = (ukedag: string): boolean => {
        let valgtDag = this.props.innsending.utfylteDager.filter(dag => dag.uke === this.props.ukeNummer && dag.dag === ukedag.trim());
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
        }
        return checked;
    }

    setFelter = () => {
        return hentUkedagerSomStringListe().map((ukedag) => {
            return (
                <Checkbox
                    className="flex-container"
                    key={ukedag}
                    label={<abbr title={ukedag}>{ukedag.charAt(0)}</abbr>}
                    checked={this.isChecked(ukedag)}
                    onChange={() => { this.setVerdi(ukedag); }}
                    feil={
                        this.props.feilIDager !== undefined ?
                            (this.props.feilIDager[ukedag.trim().toLowerCase().replace('ø', 'o') + this.props.ukeNummer]
                            !== undefined ? {feilmelding: ''} : undefined) : undefined
                    }
                />
            );
        });
    }

    render() {
        return (
            <div className="aktivitetsrad">
                <FormattedHTMLMessage id={this.props.tekstId}/>
                <div className="inputrad">
                    {this.setFelter()}
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state: RootState): MapStateToProps => {
    return {
        innsending: state.innsending,
    };
};

const mapDispatcherToProps = (dispatch: Dispatch): MapDispatchToProps => {
    return {
        oppdaterDager: (utfylteDager: UtfyltDag[]) =>
            dispatch(oppdaterUtfylteDager(utfylteDager))
    };
};

export default connect(mapStateToProps, mapDispatcherToProps)(Aktivitetsrad);