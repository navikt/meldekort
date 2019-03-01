import * as React from 'react';
import { Input } from 'nav-frontend-skjema';
import { hentUkedagerSomStringListe } from '../../../utils/ukedager';
import { FormattedHTMLMessage } from 'react-intl';
import { guid } from 'nav-frontend-js-utils';

class Arbeidsrad extends React.Component<any, any> {

    constructor(props: any) {
        super(props);
    }

    setFelter = () => {
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
    }

    render() {
        return (
            <div className="arbeidsrad">
                <FormattedHTMLMessage id="utfylling.arbeid"/>
                <div className="inputrad">
                    {this.setFelter()}
                </div>
            </div>
        );
    }
}

export default Arbeidsrad;