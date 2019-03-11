import * as React from 'react';
import { FormattedHTMLMessage } from 'react-intl';
import { hentUkedagerSomStringListe } from '../../../../../utils/ukedager';
import { Checkbox } from 'nav-frontend-skjema';

interface AktivitetsradProps {
    tekstId: string;
}

const Aktivitetsrad: React.FunctionComponent<AktivitetsradProps> = (props) => {

    const setFelter = () => {
        return hentUkedagerSomStringListe().map((ukedag) => {
            return (
                <Checkbox
                    className="flex-container"
                    key={ukedag}
                    label={<abbr title={ukedag}>{ukedag.charAt(0)}</abbr>}
                />
            );
        });
    }

    return (
        <div className="aktivitetsrad">
            <FormattedHTMLMessage id={props.tekstId}/>
            <div className="inputrad">
                {setFelter()}
            </div>
        </div>
    );
}

export default Aktivitetsrad;