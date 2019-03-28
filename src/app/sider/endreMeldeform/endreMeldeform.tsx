import * as React from 'react';
import { Innholdstittel } from 'nav-frontend-typografi';
import { hentIntl } from '../../utils/intlUtil';
import { FormattedMessage } from 'react-intl';

import NavKnapp, { knappTyper } from '../../components/knapp/navKnapp';
import Sprakvelger from '../../components/sprakvelger/sprakvelger';
import Systemtittel from 'nav-frontend-typografi/lib/systemtittel';
import Normaltekst from 'nav-frontend-typografi/lib/normaltekst';

class EndreMeldeform extends React.Component<any, any> {
    constructor(props: any) {
        super(props);
    }

    render() {
        return(
            <main className="sideinnhold">
                <section className="seksjon flex-innhold tittel-sprakvelger">
                    <Innholdstittel> {hentIntl().formatMessage({id: 'overskrift.endreMeldeform'})} </Innholdstittel>
                    <Sprakvelger/>
                </section>
                <section className="seksjon">
                    <Normaltekst className="item">
                        {hentIntl().formatMessage({id: 'endreMeldeform.info' })}
                        </Normaltekst>
                    <div className="item">
                        <Normaltekst>
                            {hentIntl().formatMessage({id: 'endreMeldeform.benytter' })}
                            {hentIntl().formatMessage({id: 'endreMeldeform.papir' })}.
                        </Normaltekst>
                        <Normaltekst>
                            {hentIntl().formatMessage({id: 'endreMeldeform.bytte' })}
                            {hentIntl().formatMessage({id: 'endreMeldeform.elektronisk' })}?
                        </Normaltekst>
                    </div>
                </section>
                <section className="seksjon">
                    <Systemtittel className="item">{hentIntl().formatMessage({id: 'overskrift.elektroniskMeldekort'})}</Systemtittel>
                    <Normaltekst className="item">
                        {hentIntl().formatMessage({id: 'endreMeldeform.info.elektronisk' })}
                    </Normaltekst>
                    <Normaltekst className="item">
                        {hentIntl().formatMessage({id: 'endreMeldeform.endre' })}
                    </Normaltekst>
                </section>
                <section className="seksjon flex-innhold sentrert">
                    <NavKnapp
                        type={knappTyper.hoved}
                        nestePath={'/innsending'}
                        tekstid={'overskrift.endreMeldeform'}
                    />
                </section>
            </main>
        );
    }
}

export default EndreMeldeform;
