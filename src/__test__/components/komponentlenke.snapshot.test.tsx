import * as React from "react";
import * as renderer from "react-test-renderer";
import ProviderWrapper from "../testSetup/providerWrapper";
import Komponentlenke from "../../app/components/komponentlenke/komponentlenke";
import { BrowserRouter } from "react-router-dom";

it("Komponentlenke", () => {
  const tree = renderer.create(
    <ProviderWrapper>
      <BrowserRouter>
        <Komponentlenke lenketekst={"Test"} rute={"/testrute"} />
      </BrowserRouter>
    </ProviderWrapper>
  );
  expect(tree).toMatchSnapshot();
});
