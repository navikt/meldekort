import * as React from 'react';
import { connect } from 'react-redux';
import { InnsendingActions } from '../../../../actions/innsending';
import { Dispatch } from 'redux';
import Select from 'nav-frontend-skjema/lib/select';
import { hentIntl } from '../../../../utils/intlUtil';
import { Begrunnelse } from '../../../../types/innsending';
import { RootState } from '../../../../store/configureStore';

interface MapStateToProps {
    begrunnelse: Begrunnelse;
}

interface MapDispatchToProps {
    settBegrunnelse: (begrunnelse: Begrunnelse) => void;
}

type Props = MapDispatchToProps & MapStateToProps;

const BegrunnelseVelger: React.StatelessComponent<Props> = (props) => {

    const handleOnChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        props.settBegrunnelse({
            valgtArsak: event.target.value,
            erFeil: event.target.value === '' ? true : false
        });
    };

    const options: string[] = hentIntl()
        .formatMessage({id: 'korriger.begrunnelse.valg'})
        .split(',');

    return (
        <div className="seksjon">
            <Select
                label={hentIntl().formatMessage({id: 'korrigering.sporsmal.begrunnelse'})}
                onChange={handleOnChange}
            >
                <option value={''}> {hentIntl().formatMessage({id: 'begrunnelse.velgArsak'})}</option>
                {options.map(opt => (
                    <option key={opt}> {opt} </option>
                ))}
            </Select>
        </div>
    );
};

const mapStateToProps = (state: RootState) => {
    return {
      begrunnelse: state.innsending.begrunnelse,
    };
};

const mapDispatchToProps = (dispatch: Dispatch): MapDispatchToProps => {
    return {
        settBegrunnelse: (begrunnelse: Begrunnelse) =>
            dispatch(InnsendingActions.settBegrunnelse(begrunnelse)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(BegrunnelseVelger);
