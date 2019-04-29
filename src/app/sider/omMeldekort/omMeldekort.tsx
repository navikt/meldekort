import * as React from 'react';
import { Innholdstittel, Normaltekst } from 'nav-frontend-typografi';
import Sprakvelger from '../../components/sprakvelger/sprakvelger';
import { FormattedHTMLMessage, FormattedMessage } from 'react-intl';
import Veilederpanel from 'nav-frontend-veilederpanel';

import veileder from '../../ikoner/veileder.svg';
import { InnsendingActions } from '../../actions/innsending';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { hentIntl } from '../../utils/intlUtil';

interface MapDispatchToProps {
    resetInnsending: () => void;
}

class OmMeldekort extends React.Component<MapDispatchToProps, any> {

    componentDidMount() {
        this.props.resetInnsending();
    }

    render() {
        return(
            <div className="sideinnhold">
                <section className="seksjon flex-innhold tittel-sprakvelger">
                    <Innholdstittel><FormattedMessage id="overskrift.genereltOmMeldekort" /></Innholdstittel>
                    <Sprakvelger/>
                </section>
                <Veilederpanel type={'plakat'} kompakt={true} svg={<img alt={'Veileder'} src={veileder}/>}>
                    <section className="seksjon">
                        <Normaltekst><FormattedMessage id="genereltOmMeldekort.velkommen" /></Normaltekst>
                        <Normaltekst><FormattedMessage id="genereltOmMeldekort.velge" /></Normaltekst>
                        <ul>
                            <li><FormattedMessage id="genereltOmMeldekort.valg.sende" /></li>
                            <li><FormattedMessage id="genereltOmMeldekort.valg.tidligere" /></li>
                            <li><FormattedMessage id="genereltOmMeldekort.valg.endre"/></li>
                        </ul>
                        <Normaltekst><FormattedHTMLMessage
                            id="genereltOmMeldekort.om.meldekort"
                            values={{
                                0: 'https://www.nav.no',
                                1: hentIntl().formatMessage({id: 'genereltOmMeldekort.informasjonOmMeldekortLink'}).trim()
                            }}
                        /></Normaltekst>
                        <Normaltekst><FormattedMessage id="genereltOmMeldekort.oss" /></Normaltekst>
                    </section>
                </Veilederpanel>
            </div>
        );
    }
}

const mapDispatchToProps = (dispatch: Dispatch): MapDispatchToProps => {
    return {
        resetInnsending: () => dispatch(InnsendingActions.resetInnsending()),
    };
};

export default connect(null, mapDispatchToProps)(OmMeldekort);