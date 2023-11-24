import * as React from "react";
import Enzyme, { shallow } from "enzyme";
import Adapter from "@wojtekmaj/enzyme-adapter-react-17";
import ProviderWrapper from "../testSetup/providerWrapper";
import StegBanner from "../../app/components/stegBanner/stegBanner";

Enzyme.configure({ adapter: new Adapter() });

it("StegBanner", () => {
  const tree = shallow(
    <ProviderWrapper>
      <StegBanner />
    </ProviderWrapper>
  );
  expect(tree).toMatchSnapshot();
});
