import * as React from 'react';
import { Input } from 'nav-frontend-skjema';
import { hentUkedagerSomStringListe } from '../../../../../utils/ukedager';
import { FormattedHTMLMessage } from 'react-intl';
import { FeilIDager, InnsendingState } from '../../../../../types/innsending';
import { AktivtMeldekortState } from '../../../../../reducers/aktivtMeldekortReducer';
import { UtfyltDag } from '../utfyllingConfig';
import { RootState } from '../../../../../store/configureStore';
import { Dispatch } from 'redux';
import { oppdaterUtfylteDager } from '../../../../../actions/innsending';
import { connect } from 'react-redux';
import { SkjemaelementFeil } from 'nav-frontend-skjema/lib/skjemaelement-feilmelding';
import AlertStripe from 'nav-frontend-alertstriper';
import { Normaltekst } from 'nav-frontend-typografi';

interface MapStateToProps {
    innsending: InnsendingState;
}

interface MapDispatchToProps {
    oppdaterDager: (utfylteDager: UtfyltDag[]) => void;
}

interface UkeProps {
    ukeNummer: number;
}

type ArbeidsradProps = UkeProps & FeilIDager & MapStateToProps & MapDispatchToProps;

class Arbeidsrad extends React.Component<ArbeidsradProps> {
    constructor(props: ArbeidsradProps) {
        super(props);
    }

    setTimer = (event: React.ChangeEvent<HTMLInputElement>, ukedag: string) => {
        const oppdaterteDager = this.props.innsending.utfylteDager.map(dag => {
           if (dag.uke === this.props.ukeNummer && dag.dag === ukedag.trim()) {
               return {
                   ...dag,
                   arbeidetTimer: Number(event.target.value)

               };
           }
           return {...dag};
        });
        this.props.oppdaterDager(oppdaterteDager);
    }

    setFelter = () => {
        return hentUkedagerSomStringListe().map((ukedag) => {
            return (
                <Input
                    className="arbeidInput"
                    key={ukedag}
                    label={<abbr title={ukedag}>{ukedag.charAt(0)}</abbr>}
                    bredde="XS"
                    type={'number'}
                    step={0.5}
                    value={0}
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                        this.setTimer(event, ukedag);
                    }}
                    feil={
                        this.props.feilIDager !== undefined ?
                            (this.props.feilIDager[ukedag.trim().toLowerCase().replace('ø', 'o') + this.props.ukeNummer]
                            !== undefined ? {feilmelding: ''} : undefined) : undefined
                    }
                />
            );
        });
    }

    innhold = () => {
        return (
            <div className="arbeidsrad">
                <FormattedHTMLMessage id="utfylling.arbeid"/>
                <div className="inputrad">
                    {this.setFelter()}
                </div>
            </div>
        );
    }

    render() {
        return (
            <div>
                {this.props.feilmelding !== undefined && this.props.feilmelding !== '' ?
                    <div className={'feilIRad'}>
                        {this.innhold()}
                    </div> :
                    this.innhold()
                }
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

export default connect(mapStateToProps, mapDispatcherToProps)(Arbeidsrad);