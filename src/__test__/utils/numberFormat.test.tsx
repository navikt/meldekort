import { formaterBelop } from "../../app/utils/numberFormat";

it("formaterBelop", () => {
  expect(formaterBelop(100)).toBe("kr. 100,00");
  expect(formaterBelop(2000)).toBe("kr. 2 000,00");
  expect(formaterBelop(30000)).toBe("kr. 30 000,00");
  expect(formaterBelop(400000)).toBe("kr. 400 000,00");
  expect(formaterBelop(5000000)).toBe("kr. 5 000 000,00");
});
