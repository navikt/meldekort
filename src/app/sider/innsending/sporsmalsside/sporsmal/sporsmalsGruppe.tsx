import * as React from 'react';

import Sporsmal from './sporsmal';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { hentIntl } from '../../../../utils/intlUtil';
import { InnsendingState, Innsendingstyper } from '../../../../types/innsending';
import { InnsendingActions } from '../../../../actions/innsending';
import { RootState } from '../../../../store/configureStore';
import { Sporsmal as Spm } from './sporsmalConfig';
import { AktivtMeldekortState } from '../../../../reducers/aktivtMeldekortReducer';
import { hentNestePeriodeMedUkerOgDato } from '../../../../utils/dates';

interface MapStateToProps {
    aktivtMeldekort: AktivtMeldekortState;
}

interface MapDispatchToProps {
    oppdaterSvar: (sporsmalsobjekt: Spm[]) => void;
}

interface Props {
    AAP: boolean;
    innsending: InnsendingState;
}

type SporsmalsGruppeProps = Props & MapStateToProps & MapDispatchToProps;

class SporsmalsGruppe extends React.Component<SporsmalsGruppeProps> {
    constructor( props: SporsmalsGruppeProps ) {
        super(props);
    }

    // TODO: mellomlagre sporsmalsvar > beregne & sett inn i fravarsdager variabel
    sporsmalOnChange = (event: React.SyntheticEvent<EventTarget>, value?: string) => {
        const nySporsmalsobjekterState = this.props.innsending.sporsmalsobjekter
            .map( sporsmalsobj => {
                const val = (value !== undefined) ? value : '';
                if (sporsmalsobj.kategori === val.split('.')[0] ) {
                    return {
                        ...sporsmalsobj,
                        checked: value
                    };
                }
                return {...sporsmalsobj};
            });
        this.props.oppdaterSvar(nySporsmalsobjekterState);
    }

    finnesIntlId = (id: string) => {
        if (hentIntl().formatMessage({id: id}) !== id) {
            return id;
        } else {
            return id.slice(0, -4);
        }
    }

    lagSporsmal = (sporsmalsobj: Spm, erAAP: boolean, innsendingstype: Innsendingstyper | null) => {
        const tekstendelse = (erAAP) ? '-AAP' : '';
        for (let key in sporsmalsobj) {
            // kategori == registrert såå
            if (sporsmalsobj[key] !== sporsmalsobj.kategori && sporsmalsobj[key] !== sporsmalsobj.feil && sporsmalsobj[key] !== sporsmalsobj.checked) {
                sporsmalsobj[key] = this.finnesIntlId(sporsmalsobj[key] + tekstendelse);
            } else if (sporsmalsobj[key] === sporsmalsobj.feil) {
                sporsmalsobj.feil.feilmeldingId = this.finnesIntlId(sporsmalsobj.feil.feilmeldingId);
            }
        }
        let { til, fra } = this.props.aktivtMeldekort.meldekort.meldeperiode;
        return(
            <Sporsmal
                sporsmalsobjekt={sporsmalsobj}
                key={sporsmalsobj.kategori}
                checked={sporsmalsobj.checked}
                sporsmalOnChange={this.sporsmalOnChange}
                formatertDato={sporsmalsobj.kategori === 'registrert' ? hentNestePeriodeMedUkerOgDato(fra, til) : undefined}
            />
        );
    }

    render() {
        const { innsending, AAP } = this.props;
        const sporsmalsgruppe = innsending.sporsmalsobjekter
            .map( sporsmalobj => this.lagSporsmal(sporsmalobj, AAP, innsending.innsendingstype ));

        return(
            <div>
                {sporsmalsgruppe}
            </div>
        );
    }
}

// TODO: Bytt til å hente meldekortDetaljer fra Store
const mapStateToProps = (state: RootState): MapStateToProps => {
    return {
        aktivtMeldekort: state.aktivtMeldekort,
    };
};

const mapDispatcherToProps = (dispatch: Dispatch): MapDispatchToProps => {
    return {
        oppdaterSvar: (sporsmalsobjekt: Spm[]) =>
            dispatch(InnsendingActions.oppdaterSpm(sporsmalsobjekt))
    };
};

export default connect(mapStateToProps, mapDispatcherToProps)(SporsmalsGruppe);
