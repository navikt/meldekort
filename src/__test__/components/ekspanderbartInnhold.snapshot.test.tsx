import * as React from "react";
import * as renderer from "react-test-renderer";
import ProviderWrapper from "../testSetup/providerWrapper";
import EkspanderbartInnhold from "../../app/components/ekspanderbartInnhold/ekspanderbartInnhold";

it("EkspanderbartInnhold", () => {
  const tree = renderer.create(
    <ProviderWrapper>
      <EkspanderbartInnhold children={<span>Test</span>} />
    </ProviderWrapper>
  );
  expect(tree).toMatchSnapshot();
});
