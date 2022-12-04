import { readonly } from "../reactive";
describe("readonly", () => {
  it("happy path", () => {
    // cannot be set
    const original = {
      foo: 1,
      bar: 2,
    };
    const wrapped = readonly(original);
    expect(wrapped).not.toBe(original);
    expect(wrapped.foo).toBe(1);
  });
  it("throw warn when call the set", () => {
    console.warn = jest.fn()

    const user = readonly({
        age: 11
    })

    user.age = 12

    expect(console.warn).toBeCalled()
  });
});
