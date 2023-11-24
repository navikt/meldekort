import * as React from "react";
import Enzyme, { shallow } from "enzyme";
import Adapter from "@wojtekmaj/enzyme-adapter-react-17";
import ProviderWrapper from "../testSetup/providerWrapper";
import UkePanel from "../../app/components/ukepanel/ukepanel";
import { innsendingTEST, utfyllingFeilTEST } from "../testSetup/testData";
import { TypeYtelse } from "../../app/utils/teksterUtil";

Enzyme.configure({ adapter: new Adapter() });

it("UkePanel", () => {
  const tree = shallow(
    <ProviderWrapper
      initialStateName={"innsending"}
      initialState={innsendingTEST}
    >
      <UkePanel
        ukenummer={1}
        typeYtelsePostfix={TypeYtelse.DAGPENGER}
        datoTittel={"naviger.neste"}
        faktiskUkeNummer={"1"}
        utfyllingFeil={utfyllingFeilTEST}
        innsending={innsendingTEST}
      />
    </ProviderWrapper>
  );
  expect(tree).toMatchSnapshot();
});
