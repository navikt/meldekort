import * as React from "react";
import * as renderer from "react-test-renderer";
import NorskFlaggSVG from "../../app/components/sprakvelger/NorskFlaggSVG";

it("NorskFlaggSVG", () => {
  const tree = renderer.create(<NorskFlaggSVG />);
  expect(tree).toMatchSnapshot();
});
