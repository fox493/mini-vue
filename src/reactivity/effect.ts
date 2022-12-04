import { extend } from "../shared";

let shouldTrack;
class ReactiveEffect {
  private _fn: any;
  deps = [];
  active = true;
  shouldTrack = true;
  onStop?: () => void;
  public scheduler: Function | undefined;
  constructor(fn: any, scheduler?: Function) {
    this._fn = fn;
    this.scheduler = scheduler;
  }
  run() {
    if (!this.active) {
      activeEffect = this;
      return this._fn();
    }
    shouldTrack = true;
    activeEffect = this;
    const result = this._fn();
    shouldTrack = false;
    return result;
  }
  stop() {
    if (this.active) {
      cleanUpEffects(this);
      if (this.onStop) {
        this.onStop();
      }
      this.active = false;
    }
  }
}

function cleanUpEffects(effect) {
  effect.deps.forEach((dep: any) => {
    dep.delete(effect);
  });
}

let targetMap = new Map();
export function track(target: any, key: any) {
  if (!shouldTrack) return;
  let depsMap = targetMap.get(target);
  if (!depsMap) {
    depsMap = new Map();
    targetMap.set(target, depsMap);
  }
  let dep = depsMap.get(key);
  if (!dep) {
    dep = new Set();
    depsMap.set(key, dep);
  }
  if (!activeEffect) return;
  dep.add(activeEffect);
  activeEffect.deps.push(dep);
}

export function trigger(target: any, key: any) {
  const depsMap = targetMap.get(target);
  const deps = depsMap.get(key);
  for (const effect of deps) {
    if (effect.scheduler) {
      effect.scheduler();
    } else {
      effect.run();
    }
  }
}

let activeEffect;
export function effect(fn, options: any = {}) {
  const _effect = new ReactiveEffect(fn, options.scheduler);
  // options
  extend(_effect, options);
  _effect.run();
  const runner: any = _effect.run.bind(_effect);
  runner.effect = _effect;
  return runner;
}

export function stop(runner: { effect: { stop: () => void } }) {
  runner.effect.stop();
}
