import * as React from 'react';
import { Innholdstittel } from 'nav-frontend-typografi';
import Sprakvelger from '../../components/sprakvelger/sprakvelger';
import AlertStripe from 'nav-frontend-alertstriper';
import { FormattedHTMLMessage, FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { PersonActions } from '../../actions/person';
import KnappBase from 'nav-frontend-knapper';
import Tabell from '../../components/tabell/tabell';
import { PersonState } from '../../reducers/personReducer';
import { RootState } from '../../store/configureStore';
import { KortStatus } from '../../types/meldekort';

const moment = require('moment');

interface MapStateToProps {
   person: PersonState;
}
interface MapDispatchToProps {
    hentPerson: () => void;
}

interface Rad {
    periode: string;
    dato: string;
}

type Props = MapDispatchToProps&MapStateToProps;

class SendMeldekort extends React.Component<Props> {
    constructor(props: any) {
        super(props);

        this.props.hentPerson();
    }

    hentRaderFraPerson = () => {
        let meldekortListe = this.props.person.person.meldekort;
        let radliste = [];
        for (let i = 0; i < meldekortListe.length; i++) {
            if (meldekortListe[i].kortStatus === KortStatus.OPPRE || meldekortListe[i].kortStatus === KortStatus.SENDT) {
                let meldeperiode = meldekortListe[i].meldeperiode;
                let fra = moment(meldeperiode.fra);
                let til = moment(meldeperiode.til);

                let rad: Rad = {
                    periode: `Uke ${fra.isoWeek()} - ${til.isoWeek()}`,
                    dato: `${fra.format('DD.MM.YYYY').toString()} - ${til.format('DD.MM.YYYY').toString()}`,
                };
                radliste.push(rad);
            }
        }
        return radliste;
    }

    // bruker sitt antall meldekort må hentes fra store (etter at vi har fått koblet sammen back2front)
    // TODO: Info varierer basert på antall mk

    render() {
        const rows = this.hentRaderFraPerson();
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
const mapStateToProps = (person: RootState): MapStateToProps => {
    return {
        person: person.person,
    };
};

const mapDispatchToProps = (dispatch: Dispatch): MapDispatchToProps => {
    return {
        hentPerson: () => dispatch(PersonActions.hentPerson.request()),
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(SendMeldekort);
