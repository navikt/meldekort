import * as React from 'react';

import Sporsmal from './sporsmal';
import { injectIntl, InjectedIntlProps } from 'react-intl';
import { Sporsmal as Spm, hentSporsmalConfig } from './sporsmalConfig';

interface Props {
    AAP: boolean;
}

interface SporsmalsGruppeState {
    sporsmalobjekter: Spm[];
}

type SporsmalsGruppeProps = Props & InjectedIntlProps;

class SporsmalsGruppe extends React.Component<SporsmalsGruppeProps, SporsmalsGruppeState> {
    constructor( props: SporsmalsGruppeProps ) {
        super(props);
        this.state = {
            sporsmalobjekter: hentSporsmalConfig(),
        };
    }

    // TODO: mellomlagre sporsmalsvar > beregne & sett inn i fravarsdager variabel
    sporsmalOnChange = (event: React.SyntheticEvent<EventTarget>) => {
        console.log('Save to Persist SS!');
    }

    finnesIntlId = (id: string) => {
        if (this.props.intl.formatMessage({id: id}) !== id) {
            return id;
        } else {
            return id.slice(0, -4);
        }
    }

    lagSporsmal = (sporsmalsobj: Spm, erAAP: boolean) => {
        const tekstendelse = (erAAP) ? '-AAP' : '';
        for (let key in sporsmalsobj) {
            if (sporsmalsobj[key] !== sporsmalsobj.kategori) {
                sporsmalsobj[key] = this.finnesIntlId(sporsmalsobj[key] + tekstendelse);
            }
        }
        return(
            <Sporsmal
                id={sporsmalsobj.kategori}
                key={sporsmalsobj.kategori}
                sporsmal={sporsmalsobj.sporsmal}
                jaSvar={sporsmalsobj.ja}
                neiSvar={sporsmalsobj.nei}
                hjelpetekst={sporsmalsobj.forklaring}
                checked={undefined}
                sporsmalOnChange={this.sporsmalOnChange}
            />
        );
    }

    render() {
        // Lag en liste med tekstid'er for AAP og dagpenger.
        // Map gjennom alle spm & returner dem.
        const sporsmalsgruppe = this.state.sporsmalobjekter
            .map( sporsmalobj => this.lagSporsmal(sporsmalobj, this.props.AAP));

        return(
            <div>
                {sporsmalsgruppe}
            </div>
        );
    }
}

export default injectIntl(SporsmalsGruppe);
