import { reactive } from "../reactive";
import { effect, stop } from "../effect";

describe("effect", () => {
  it("happy path", () => {
    const userA = reactive({
      age: 10,
    });
    let agePlusOne;
    effect(() => {
      agePlusOne = userA.age + 1;
    });
    expect(agePlusOne).toBe(11);
    userA.age++;
    expect(agePlusOne).toBe(12);
  });
  it("return the passed function when the effect function is called", () => {
    let foo = 10;
    const runner = effect(() => {
      foo++;
      return "testReturnedValue";
    });
    expect(foo).toBe(11);
    const res = runner();
    expect(foo).toBe(12);
    expect(res).toBe("testReturnedValue");
  });
  it("scheduler", () => {
    let dummy;
    let run: any;
    const scheduler = jest.fn(() => {
      run = runner;
    });
    const obj = reactive({ foo: 1 });
    const runner = effect(
      () => {
        dummy = obj.foo;
      },
      { scheduler }
    );
    expect(scheduler).not.toHaveBeenCalled();
    expect(dummy).toBe(1);
    obj.foo++;
    expect(scheduler).toHaveBeenCalledTimes(1);
    expect(dummy).toBe(1);
    run();
    expect(dummy).toBe(2);
  });
  it("stop", () => {
    let dummy;
    const obj = reactive({ foo: 1 });
    const runner = effect(() => {
      dummy = obj.foo;
    });
    obj.foo = 2;
    expect(dummy).toBe(2);
    stop(runner);
    obj.foo ++;
    expect(dummy).toBe(2);
    runner();
    expect(dummy).toBe(3);
  });
  it("onStop", () => {
    const obj = reactive({
      foo: 1,
    });
    const onStop = jest.fn();
    let dummy;
    const runner = effect(
      () => {
        dummy = obj.foo;
      },
      {
        onStop,
      }
    );

    stop(runner);
    expect(onStop).toBeCalledTimes(1);
  });
});
