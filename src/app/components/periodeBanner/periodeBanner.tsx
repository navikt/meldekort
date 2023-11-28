import * as React from "react";
import { hentDatoPeriode, hentUkePeriode } from "../../utils/dates";
import { RootState } from "../../store/configureStore";
import { connect } from "react-redux";
import { Meldekort } from "../../types/meldekort";
import { formatMessage } from "../../utils/intlUtil";
import { BodyLong, BodyShort, Heading } from "@navikt/ds-react";

interface MapStateToProps {
  aktivtMeldekort: Meldekort;
}

interface PeriodeBannerProps {
  className?: string;
}

type Props = PeriodeBannerProps & MapStateToProps;

const PeriodeBanner: React.FunctionComponent<Props> = props => {
  const { meldeperiode } = props.aktivtMeldekort;
  const { className = "" } = props;
  return (
    <section
      id="periodebanner"
      className={"seksjon periodeBanner " + className}
    >
      <BodyLong size="large" className="flex-innhold sentrert">
        {formatMessage("meldekort.for.perioden")}
      </BodyLong>
      <Heading size="large" className="flex-innhold sentrert">
        {hentUkePeriode(meldeperiode.fra, meldeperiode.til)}
      </Heading>
      <BodyShort className="flex-innhold sentrert">
        {hentDatoPeriode(meldeperiode.fra, meldeperiode.til)}
      </BodyShort>
    </section>
  );
};

const mapStateToProps = (state: RootState): MapStateToProps => {
  return {
    aktivtMeldekort: state.aktivtMeldekort,
  };
};

export default connect(mapStateToProps)(PeriodeBanner);
