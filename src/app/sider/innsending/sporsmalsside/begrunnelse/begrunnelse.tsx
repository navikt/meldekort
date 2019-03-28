import * as React from 'react';
import { connect } from 'react-redux';
import { InnsendingActions } from '../../../../actions/innsending';
import { Dispatch } from 'redux';
import Select from 'nav-frontend-skjema/lib/select';
import { hentIntl } from '../../../../utils/intlUtil';

interface MapDispatchToProps {
    settBegrunnelse: (begrunnelse: string) => void;
}

type Props = MapDispatchToProps;

const Begrunnelse: React.StatelessComponent<Props> = (props) => {

    const handleOnChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        props.settBegrunnelse(event.target.value);
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

const mapDispatchToProps = (dispatch: Dispatch): MapDispatchToProps => {
    return {
        settBegrunnelse: (begrunnelse: string) =>
            dispatch(InnsendingActions.settBegrunnelse(begrunnelse)),
    };
};

export default connect(null, mapDispatchToProps)(Begrunnelse);
