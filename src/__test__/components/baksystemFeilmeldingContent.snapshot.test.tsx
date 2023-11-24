import { baksystemFeilmeldingContent } from "../../app/components/feil/baksystemFeilmeldingContent";

it("BaksystemFeilmeldingContent", () => {
  expect(baksystemFeilmeldingContent()).toMatchSnapshot();
});
