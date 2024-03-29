import * as React from "react";
import Enzyme, { shallow } from "enzyme";
import Adapter from "@wojtekmaj/enzyme-adapter-react-17";
import ProviderWrapper from "../testSetup/providerWrapper";
import BegrunnelseVisning from "../../app/components/meldekortdetaljer/begrunnelsevisning/begrunnelse";

Enzyme.configure({ adapter: new Adapter() });

it("BegrunnelseVelger", () => {
  const tree = shallow(
    <ProviderWrapper>
      <BegrunnelseVisning begrunnelse={"TEST"} />
    </ProviderWrapper>
  );
  expect(tree).toMatchSnapshot();
});
