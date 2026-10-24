/** Critically damped response: no overshoot, current velocity survives retargeting. */
export function springStep(position: number, velocity: number, target: number, seconds: number) {
  const response = 24;
  const displacement = position - target;
  const momentum = velocity + response * displacement;
  const decay = Math.exp(-response * seconds);
  return {
    position: target + (displacement + momentum * seconds) * decay,
    velocity: (velocity - response * momentum * seconds) * decay,
  };
}

export function createSpring(update: (value: number) => void, initial = 0) {
  let position = initial, velocity = 0, target = initial, frame = 0, last = 0;
  let settled: (() => void) | undefined;
  function tick(time: number) {
    const next = springStep(position, velocity, target, Math.min((time - last) / 1000, .064));
    last = time;
    position = next.position;
    velocity = next.velocity;
    if (Math.abs(position - target) < .001 && Math.abs(velocity) < .01) {
      position = target; velocity = 0; frame = 0;
      update(position); settled?.(); return;
    }
    update(position);
    frame = requestAnimationFrame(tick);
  }
  return {
    to(value: number, instant = false, onRest?: () => void) {
      target = value; settled = onRest;
      if (instant) {
        cancelAnimationFrame(frame); frame = 0; velocity = 0; position = target;
        update(position); settled?.();
      } else if (!frame) {
        last = performance.now(); frame = requestAnimationFrame(tick);
      }
    },
    stop() { cancelAnimationFrame(frame); frame = 0; settled = undefined; },
  };
}
