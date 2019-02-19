/*
import * as React from 'react';

import { connect } from 'react-redux';
import { RootState } from '../../store/configureStore';
import { IntlAction, updateIntl } from 'react-intl-redux';
import { Dispatch } from 'redux';

type SporsmalsGruppeProps = MapStateToProps & MapDispatchToProps;

interface MapStateToProps {

}
interface MapDispatchToProps {

}

// <> props inside
class SporsmalsGruppe extends React.Component<SporsmalsGruppeProps> {
    constructor( props: SporsmalsGruppeProps ) {
        super(props);
    }

    // Functions & Methods
    // onChange fn som

    sporsmalOnChange = (event: React.SyntheticEvent<EventTarget>) => {

    }

    lagRadioKnapper() {

    }

    handleOnChange = () => {

    }

    lagRadioKnapp () {

    }/*
           /* <Sporsmal
                AAP={false}
                id="1"
                sporsmal="sporsmal.arbeid"
                svarJa="svar.arbeid.ja"
                svarNei="svar.arbeid.nei"
                hjelpetekst="forklaring.sporsmal.arbeid"
                sporsmalOnChange={this.sporsmalOnChange}
            />*/

    /*render() {
        // Lag en liste med tekstid'er for AAP og dagpenger.
        // Map gjennom alle spm & returner dem.

        return(
            <div></div>
        );
    }
}*/

// TODO: Bytt til å hente meldekortDetaljer fra Store
/*const mapStateToProps = ({ intl, locales }: RootState) => {
    const { locale, messages } = intl;
    const locs = locales;
    return { locale, messages, locs};
};

const mapDispatcherToProps = (dispatch: Dispatch<IntlAction>) => {
    return {

        updateIntl: (locale: any, messages: any) =>
            dispatch(updateIntl({ locale, messages }))
    };
};

export default connect(mapStateToProps, mapDispatcherToProps)(SporsmalsGruppe);
*/