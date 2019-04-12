import {RootState} from "../../store/configureStore";
import {connect} from "react-redux";
import navLogo from "../../ikoner/nav-logo.svg";
import {Ingress, Innholdstittel} from "nav-frontend-typografi";
import {FormattedMessage} from "react-intl";
import * as React from "react";
import {hentIntl} from "../../utils/intlUtil";


interface Props {
    erKvittering: boolean;
}

type PrintHeaderProps = Props & ReturnType<typeof mapStateToProps>;

const PrintHeader: React.FunctionComponent<PrintHeaderProps> = (props) => {

    const { fornavn, etternavn, fodselsnr } = props.person;
    const printTekst = hentIntl().formatMessage({id: 'overskrift.meldekort.sendt'});
    return (
        <div className="onlyPrint ">
            <img src={navLogo} alt={printTekst + ' logo'} className="navLogo flex-innhold sentrert"/>
            {props.erKvittering ?
                <Innholdstittel className="flex-innhold sentrert">
                    {printTekst}
                </Innholdstittel> :
                <>
                    <Ingress className="flex-innhold sentrert">
                        <FormattedMessage id={"meldekort.for"}/>
                    </Ingress>
                    <Innholdstittel className="flex-innhold sentrert">
                        <span>{`${fornavn} ${etternavn} (${fodselsnr})`}</span>
                    </Innholdstittel>
                </>
            }
        </div>
    )
}

const mapStateToProps = (state: RootState) => {
    return {
        person: state.person
    }
}

export default connect(mapStateToProps, null)(PrintHeader);