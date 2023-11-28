import * as React from "react";
import { MenyPunkt } from "../../../utils/menyConfig";
import { RootState } from "../../../store/configureStore";
import { connect } from "react-redux";
import { formatMessage } from "../../../utils/intlUtil";
import { MenyActions } from "../../../actions/meny";
import { Dispatch } from "redux";
import classNames from "classnames";
import { Collapse } from "react-collapse";
import { useNavigate } from "react-router";
import { Link } from "@navikt/ds-react";

interface MobilMenyProps {
  menypunkter: MenyPunkt[];
}

interface MapStateToProps {
  erApen: boolean;
  valgtMenyPunkt: MenyPunkt;
}

interface MapDispatchToProps {
  settValgtMenyPunkt: (menypunkt: MenyPunkt) => void;
  toggleMeny: (erApen: boolean) => void;
}

const MobilMeny: React.FunctionComponent<
  MobilMenyProps & MapStateToProps & MapDispatchToProps
> = props => {
  const {
    settValgtMenyPunkt,
    toggleMeny,
    valgtMenyPunkt,
    menypunkter,
    erApen,
  } = props;
  const navigate = useNavigate();

  const onChange = (item: MenyPunkt) => {
    settValgtMenyPunkt(item);
    navigate(item.urlparam, { replace: true })
  };

  return (
    <nav className={classNames("mobilmeny")}>
      <Collapse isOpened={props.erApen}>
        <ul className={classNames("mobilmeny__navlist", { open: erApen })}>
          {menypunkter.map(menypunkt => (
            <li
              className={"mobilmeny__item"}
              onClick={() => onChange(menypunkt)}
              key={menypunkt.tittel}
              aria-labelledby={"navlink"}
            >
              <Link
                className={classNames("mobilmeny__lenke", {
                  active: valgtMenyPunkt.tittel === menypunkt.tittel,
                })}
                href={"#"}
              >
                {formatMessage(menypunkt.tekstid)}
              </Link>
            </li>
          ))}
        </ul>
      </Collapse>
      <div
        className={classNames("overlay", { on: erApen })}
        onClick={() => toggleMeny(false)}
      />
    </nav>
  );
};

const mapStateToProps = (state: RootState): MapStateToProps => {
  return {
    erApen: state.meny.erApen,
    valgtMenyPunkt: state.meny.valgtMenyPunkt,
  };
};

const mapDispatchToProps = (dispatch: Dispatch): MapDispatchToProps => {
  return {
    settValgtMenyPunkt: (menypunkt: MenyPunkt) =>
      dispatch(MenyActions.settValgtMenyPunkt(menypunkt)),
    toggleMeny: (erApen: boolean) => dispatch(MenyActions.toggleMeny(erApen)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MobilMeny);
