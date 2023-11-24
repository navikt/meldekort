import * as React from "react";
import * as renderer from "react-test-renderer";
import ProviderWrapper from "../testSetup/providerWrapper";
import InfoToggler from "../../app/components/utvidetinformasjon/infoToggler/infoToggler";

it("InfoToggler", () => {
  const tree = renderer.create(
    <ProviderWrapper>
      <InfoToggler
        onToggle={() => {
          return 1 + 1;
        }}
      >
        <span>Test</span>
      </InfoToggler>
    </ProviderWrapper>
  );
  expect(tree).toMatchSnapshot();
});
