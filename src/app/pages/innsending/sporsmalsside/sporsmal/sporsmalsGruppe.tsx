import * as React from 'react';

import Sporsmal from './sporsmal';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { hentIntl } from '../../../../utils/intlUtil';
import { InnsendingState } from '../../../../types/innsending';
import { oppdaterSpm } from '../../../../actions/innsending';
import { RootState } from '../../../../store/configureStore';
import { Sporsmal as Spm, hentSporsmalConfig} from './sporsmalConfig';

interface MapStateToProps {
    innsending: InnsendingState;
}

interface MapDispatchToProps {
    oppdaterSvar: (sporsmalsobjekt: Spm[]) => void;
}

interface Props {
    AAP: boolean;
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

    lagSporsmal = (sporsmalsobj: Spm, erAAP: boolean) => {
        const tekstendelse = (erAAP) ? '-AAP' : '';
        for (let key in sporsmalsobj) {
            if (sporsmalsobj[key] !== sporsmalsobj.kategori && sporsmalsobj[key] !== sporsmalsobj.feil && sporsmalsobj[key] !== sporsmalsobj.checked) {
                sporsmalsobj[key] = this.finnesIntlId(sporsmalsobj[key] + tekstendelse);
            } else if (sporsmalsobj[key] === sporsmalsobj.feil) {
                sporsmalsobj.feil.feilmeldingId = this.finnesIntlId(sporsmalsobj.feil.feilmeldingId);
            }

        }
        return(
            <Sporsmal
                sporsmalsobjekt={sporsmalsobj}
                key={sporsmalsobj.kategori}
                checked={sporsmalsobj.checked}
                sporsmalOnChange={this.sporsmalOnChange}
            />
        );
    }

    render() {
        const sporsmalsgruppe = this.props.innsending.sporsmalsobjekter
            .map( sporsmalobj => this.lagSporsmal(sporsmalobj, this.props.AAP));

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
        innsending: state.innsending
    };
};

const mapDispatcherToProps = (dispatch: Dispatch): MapDispatchToProps =>{
    return {
        oppdaterSvar: (sporsmalsobjekt: Spm[]) =>
            dispatch(oppdaterSpm(sporsmalsobjekt))
    };
};

export default connect(mapStateToProps, mapDispatcherToProps)(SporsmalsGruppe);
