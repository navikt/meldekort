import * as React from "react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import Detaljer from "./tidligereMeldekort/detaljer/detaljer";
import OfteStilteSporsmal from "./ofteStilteSporsmal/ofteStilteSporsmal";
import SendMeldekort from "./sendMeldekort/sendMeldekort";
import EtterregistrerMeldekort from "./etterregistrerMeldekort/etterregistrerMeldekort";
import OmMeldekort from "./omMeldekort/omMeldekort";
import TidligereMeldekort from "./tidligereMeldekort/tidligereMeldekort";
import InnsendingRoutes from "./innsending/innsendingRoutes";

const MeldekortRoutes: React.FunctionComponent = () => {
  const location = useLocation();

  return (
    <Routes>
      <Route path={"/send-meldekort/innsending/*"} element={<InnsendingRoutes location={location} />} />
      <Route path={"/send-meldekort"} element={<SendMeldekort />} />

      <Route path={"/etterregistrer-meldekort/innsending/*"} element={<InnsendingRoutes location={location} />} />
      <Route path={"/etterregistrer-meldekort"} element={<EtterregistrerMeldekort />} />

      <Route path={"/tidligere-meldekort/detaljer/korriger/*"} element={<InnsendingRoutes location={location} />} />
      <Route path={"/tidligere-meldekort/detaljer"} element={<Detaljer />} />
      <Route path={"/tidligere-meldekort"} element={<TidligereMeldekort />} />

      <Route path={"/ofte-stilte-sporsmal"} element={<OfteStilteSporsmal />} />
      <Route path={"/om-meldekort"} element={<OmMeldekort />} />

      <Route path="404" element={<div />} />
      <Route path="/" element={<Navigate to="send-meldekort" replace />} />
    </Routes>
  );
};

export default MeldekortRoutes;
