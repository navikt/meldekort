import * as React from 'react';
import { Input } from 'nav-frontend-skjema';
import { hentUkedagerSomStringListe } from '../../../../../utils/ukedager';
import { FormattedHTMLMessage } from 'react-intl';

const Arbeidsrad: React.FunctionComponent<any> = () => {

    const setFelter = () => {
        return hentUkedagerSomStringListe().map((ukedag) => {
            return (
                <Input
                    className="arbeidInput"
                    key={ukedag}
                    label={<abbr title={ukedag}>{ukedag.charAt(0)}</abbr>}
                    bredde="XS"
                />
            );
        });
    };

    return (
        <div className="arbeidsrad">
            <FormattedHTMLMessage id="utfylling.arbeid"/>
            <div className="inputrad">
                {setFelter()}
            </div>
        </div>
    );
};

export default Arbeidsrad;