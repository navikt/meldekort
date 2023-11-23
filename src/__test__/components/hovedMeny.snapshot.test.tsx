import * as React from "react";
import * as renderer from "react-test-renderer";
import ProviderWrapper, { setLocalesBeforeAll } from "../testSetup/providerWrapper";
import HovedMeny from "../../app/components/meny/desktop/hovedmeny";
import { menyPunkterTEST } from "../testSetup/testData";
import { BrowserRouter } from "react-router-dom";

setLocalesBeforeAll();

it("HovedMeny", () => {
  const tree = renderer.create(
    <ProviderWrapper>
      <BrowserRouter>
        <HovedMeny menypunkter={menyPunkterTEST} />
      </BrowserRouter>
    </ProviderWrapper>
  );
  expect(tree).toMatchSnapshot();
});
