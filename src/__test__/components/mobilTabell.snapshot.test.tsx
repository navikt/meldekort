import * as React from "react";
import * as renderer from "react-test-renderer";
import ProviderWrapper from "../testSetup/providerWrapper";
import MobilTabell from "../../app/components/tabell/mobil/mobilTabell";

it("MobilTabell", () => {
  const tree = renderer.create(
    <ProviderWrapper>
      <MobilTabell
        columns={[
          {
            key: "test",
            label: <span>TEST</span>,
          },
        ]}
      />
    </ProviderWrapper>
  );
  expect(tree).toMatchSnapshot();
});
