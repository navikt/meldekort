import * as React from "react";
import * as renderer from "react-test-renderer";
import ProviderWrapper, { setLocalesBeforeAll } from "../testSetup/providerWrapper";
import NavKnapp, { KnappTyper } from "../../app/components/knapp/navKnapp";
import { BrowserRouter } from "react-router-dom";

setLocalesBeforeAll();

it("NavKnapp", () => {
  const tree = renderer.create(
    <ProviderWrapper>
      <BrowserRouter>
        <NavKnapp
          type={KnappTyper.HOVED}
          nestePath={"/test"}
          tekstid={"naviger.neste"}
        />
      </BrowserRouter>
    </ProviderWrapper>
  );
  expect(tree).toMatchSnapshot();
});
