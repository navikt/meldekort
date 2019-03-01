import * as React from 'react';
import { FormattedHTMLMessage } from 'react-intl';
import { hentUkedagerSomStringListe } from '../../../utils/ukedager';
import { Checkbox } from 'nav-frontend-skjema';

interface AktivitetsradProps {
    tekstId: string;
}

class Aktivitetsrad extends React.Component<AktivitetsradProps, any> {

    constructor(props: any) {
        super(props);
    }

    setFelter = () => {
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

    render() {
        return (
            <div className="aktivitetsrad">
                <FormattedHTMLMessage id={this.props.tekstId}/>
                <div className="inputrad">
                    {this.setFelter()}
                </div>
            </div>
        );
    }
}

export default Aktivitetsrad;