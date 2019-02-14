import * as React from 'react';
import { Innholdstittel } from 'nav-frontend-typografi';
import Sprakvelger from '../../components/sprakvelger/sprakvelger';
import AlertStripe from 'nav-frontend-alertstriper';
import { FormattedMessage, FormattedHTMLMessage } from 'react-intl';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { PersonActions } from '../../actions/person';
import KnappBase from 'nav-frontend-knapper';
import Tabell from '../../components/tabell/tabell';

interface MapDispatchToProps {
    hentPerson: () => void;
}

type Props = MapDispatchToProps;

class SendMeldekort extends React.Component<Props> {
    constructor(props: any) {
        super(props);

        this.props.hentPerson();
    }

    // bruker sitt antall meldekort må hentes fra store (etter at vi har fått koblet sammen back2front)
    // TODO: Info varierer basert på antall mk

    render() {

        const rows = [
            {'periode': 'uke 31-32', 'dato': '30. jul 2018 - 13. aug 2018'},
            {'periode': 'uke 29-30', 'dato': '16. jul 2018 - 30. jul 2018'},
            {'periode': 'uke 27-28', 'dato': '2. jul 2018 - 16. jul 2018'},
        ];
        const columns = [
            {key: 'periode', label: 'Periode'},
            {key: 'dato', label: 'Dato'}
        ];

        return(
            <main className="sideinnhold">
                <Innholdstittel className="seksjon"> [X] meldekort klar for innsending </Innholdstittel>
                <section className="seksjon">
                    <Sprakvelger/>
                </section>
                <section className="seksjon">
                    <div className="item">
                        <FormattedHTMLMessage id="sendMeldekort.info.kanSende"/>
                    </div>
                    <div className="item">
                        <Tabell
                            rows={rows}
                            columns={columns}
                        />
                    </div>
                </section>
                <section className="seksjon">
                    <AlertStripe type="info" solid={true}>
                        <FormattedHTMLMessage id="sendMeldekort.info.automatiskLedet"/>
                        <FormattedHTMLMessage id="sendMeldekort.info.eldstePerioden"/>
                        <br/>
                        <FormattedHTMLMessage id="sendMeldekort.info.neste"/>
                    </AlertStripe>
                </section>
                <section className="seksjon flex-innhold sentrert">
                    <KnappBase type="hoved">
                        <FormattedMessage id="sendMeldekort.knapp.startUtfylling" />
                    </KnappBase>
                </section>
            </main>
        );
    }
}

const mapDispatchToProps = (dispatch: Dispatch): MapDispatchToProps => {
    return {
        hentPerson: () => dispatch(PersonActions.hentPerson.request()),
    };
};

export default connect(
    null,
    mapDispatchToProps
)(SendMeldekort);
