import * as React from "react";
import classNames from "classnames";
import { guid } from "nav-frontend-js-utils";
import { formatMessage } from "../../utils/intlUtil";
import InfoToggler from "./infoToggler/infoToggler";
import EkspanderbartInnhold from "../ekspanderbartInnhold/ekspanderbartInnhold";

interface Props {
  children: React.ReactNode;
  erApen?: boolean;
  apenLabelId?: string;
  lukkLabelId?: string;
}

interface State {
  apen: boolean;
}

class UtvidetInformasjon extends React.Component<Props, State> {
  id: string;

  constructor(props: Props) {
    super(props);
    this.id = guid();
    this.state = {
      apen: props.erApen || false,
    };
  }

  render() {
    const cls = classNames("noPrint utvidetInformasjon", {
      "utvidetInformasjon--apen": this.state.apen,
    });
    const {
      apenLabelId = "veiledning.les",
      lukkLabelId = "veiledning.lukk",
    } = this.props;

    return (
      <div className={cls}>
        <div className="utvidetInformasjon__toggler">
          <InfoToggler
            onToggle={() => this.setState({ apen: !this.state.apen })}
            apen={this.state.apen}
          >
            {this.state.apen
              ? formatMessage(lukkLabelId)
              : formatMessage(apenLabelId)}
          </InfoToggler>
        </div>
        <div className="utvidetInformasjon__innhold" id={this.id}>
          <EkspanderbartInnhold erApen={this.state.apen}>
            {this.props.children}
          </EkspanderbartInnhold>
        </div>
      </div>
    );
  }
}

export default UtvidetInformasjon;
