import * as React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import Detaljer from './tidligereMeldekort/detaljer/detaljer';
import OfteStilteSporsmal from './ofteStilteSporsmal/ofteStilteSporsmal';
import SendMeldekort from './sendMeldekort/sendMeldekort';
import EtterregistrerMeldekort from './etterregistrerMeldekort/etterregistrerMeldekort';
import OmMeldekort from './omMeldekort/omMeldekort';
import TidligereMeldekort from './tidligereMeldekort/tidligereMeldekort';
import InnsendingRoutes from './innsending/innsendingRoutes';

const MeldekortRoutes: React.FunctionComponent = () => {
  return (
    <Switch>
      <Route
        path="/send-meldekort/innsending"
        children={({ match, history, location }) => (
          <InnsendingRoutes
            match={match}
            history={history}
            location={location}
          />
        )}
      />
      <Route exact={true} path="/send-meldekort" children={<SendMeldekort />} />

      <Route
        path="/etterregistrer-meldekort/innsending"
        children={({ match, history, location }) => (
          <InnsendingRoutes
            match={match}
            history={history}
            location={location}
          />
        )}
      />
      <Route
        path="/etterregistrer-meldekort"
        children={<EtterregistrerMeldekort />}
      />

      <Route
        path="/tidligere-meldekort/detaljer/korriger"
        children={({ match, history, location }) => (
          <InnsendingRoutes
            match={match}
            history={history}
            location={location}
          />
        )}
      />
      <Route path="/tidligere-meldekort/detaljer" children={<Detaljer />} />
      <Route path="/tidligere-meldekort" children={<TidligereMeldekort />} />

      <Route path="/ofte-stilte-sporsmal" children={<OfteStilteSporsmal />} />
      <Route path="/om-meldekort" children={<OmMeldekort />} />

      <Route path="/404" children={<div />} />
      <Redirect exact={true} from="/" to="/send-meldekort" />
    </Switch>
  );
};

export default MeldekortRoutes;
