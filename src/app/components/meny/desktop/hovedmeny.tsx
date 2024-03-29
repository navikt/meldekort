import * as React from "react";
import classNames from "classnames";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import { formatMessage } from "../../../utils/intlUtil";
import { MenyActions } from "../../../actions/meny";
import { MenyPunkt } from "../../../utils/menyConfig";
import { RootState } from "../../../store/configureStore";
import { useNavigate } from "react-router";
import { Link } from "@navikt/ds-react";

interface MapStateToProps {
  valgtMenyPunkt: MenyPunkt;
}

interface MapDispatchToProps {
  settValgtMenyPunkt: (menypunkt: MenyPunkt) => void;
}

interface HovedMenyProps {
  menypunkter: MenyPunkt[];
}

type Props = HovedMenyProps & MapStateToProps & MapDispatchToProps;

const HovedMeny: React.FunctionComponent<Props> = props => {
  const { menypunkter, settValgtMenyPunkt, valgtMenyPunkt } = props;
  const navigate = useNavigate();

  const onChange = (item: MenyPunkt) => {
    settValgtMenyPunkt(item);
    navigate(item.urlparam, { replace: true })
  };

  return (
    <nav className="hovedmeny">
      <ul className="hovedmeny__wrapper">
        {menypunkter
          .filter((item: MenyPunkt) => item.urlparam)
          .map((item: MenyPunkt) => ( // (item: MenyPunkt, index: any)
            <li key={item.tittel} className={"hovedmeny__item"}>
              <Link
                onClick={() => onChange(item)}
                className={classNames("hovedmeny__menypunkt", {
                  active: valgtMenyPunkt.tittel === item.tittel,
                })}
                href={"#"}
                aria-labelledby={"tab hovedmeny__menypunkt"}
              >
                {formatMessage(item.tekstid)}
              </Link>
            </li>
          ))}
      </ul>
    </nav>
  );
};

const mapStateToProps = (state: RootState): MapStateToProps => {
  return {
    valgtMenyPunkt: state.meny.valgtMenyPunkt,
  };
};

const mapDispatchToProps = (dispatch: Dispatch): MapDispatchToProps => {
  return {
    settValgtMenyPunkt: (menypunkt: MenyPunkt) =>
      dispatch(MenyActions.settValgtMenyPunkt(menypunkt)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(HovedMeny);
