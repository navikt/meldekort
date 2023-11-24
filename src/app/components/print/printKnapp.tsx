import * as React from "react";
import { formatMessage } from "../../utils/intlUtil";
import { Flatknapp } from "nav-frontend-knapper";
import printLogo from "../../ikoner/print.svg";
import DOMPortal from "./DOMPortal";
import Utskrift from "./utskrift";
import { Person, PersonInfo } from "../../types/person";

export interface PrintKnappProps {
  innholdRenderer: () => React.ReactNode;
  prerenderInnhold?: boolean;
  erKvittering?: boolean;
  person: Person;
  personInfo: PersonInfo;
}

export interface State {
  active: boolean;
  person: Person;
  personInfo: PersonInfo;
}

function updateDocumentClass(active: boolean) {
  if (active) {
    document.documentElement.classList.add("js-utskriftsmodus");
  } else {
    document.documentElement.classList.remove("js-utskriftsmodus");
  }
}

class PrintKnapp extends React.Component<PrintKnappProps, State> {
  printTimeoutId: number;
  tekst = formatMessage("overskrift.skrivUt");

  constructor(props: PrintKnappProps) {
    super(props);
    this.state = {
      active: false,
      person: this.props.person,
      personInfo: this.props.personInfo,
    };
  }

  componentDidMount() {
    updateDocumentClass(this.state.active);
  }

  componentWillUnmount() {
    updateDocumentClass(false);
  }

  print = () => {
    window.print();
    this.printTimeoutId = -1;
    setTimeout(this.reset, 10);
  };

  reset = () => {
    this.setState({
      active: false,
    });
  };

  componentDidUpdate(
    prevProps: Readonly<PrintKnappProps>,
    prevState: Readonly<State>
  ) {
    updateDocumentClass(this.state.active);
    if (!prevState.active && this.state.active) {
      if (this.printTimeoutId > 0) {
        clearTimeout(this.printTimeoutId);
      }
      setTimeout(this.print, 10);
    }
  }

  render() {
    const {
      prerenderInnhold,
      innholdRenderer,
      erKvittering,
      personInfo,
      person,
    } = this.props;

    return (
      <div className={"navigasjonsknapp"}>
        <Flatknapp
          htmlType="button"
          onClick={() =>
            this.setState({
              active: !this.state.active,
            })
          }
        >
          <img className="printLogo" src={printLogo} alt="" />
          {this.tekst}
        </Flatknapp>
        {prerenderInnhold || this.state.active ? (
          <DOMPortal>
            <Utskrift
              active={true}
              erKvittering={erKvittering}
              person={person}
              personInfo={personInfo}
            >
              {innholdRenderer()}
            </Utskrift>
          </DOMPortal>
        ) : null}
      </div>
    );
  }
}

export default PrintKnapp;
