import * as React from "react";
import * as renderer from "react-test-renderer";
import Sprakvelger from "../../app/components/sprakvelger/sprakvelger";
import ProviderWrapper, { setLocalesBeforeAll } from "../testSetup/providerWrapper";

setLocalesBeforeAll();

it("Sprakvelger", () => {
  const tree = renderer.create(
    <ProviderWrapper>
      <Sprakvelger />
    </ProviderWrapper>
  );
  expect(tree).toMatchSnapshot();
});
