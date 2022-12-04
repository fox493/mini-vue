import { reactive } from "../reactive";
describe("reactive", () => {
  it("happy path", () => {
    const original = {
      foo: 1,
    };
    const objectserved = reactive(original);
    // expect(typeof original.foo).toBe("string")
    expect(objectserved).not.toBe(original);
    expect(objectserved.foo).toBe(1);
  });
});
