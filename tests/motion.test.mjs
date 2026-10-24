import test from 'node:test';
import assert from 'node:assert/strict';
import {springStep} from '../src/lib/motion.ts';

test('spring settles without overshoot at 30, 60 and 120 fps',()=>{
  for(const fps of [30,60,120]){
    let state={position:0,velocity:0};
    for(let i=0;i<fps;i++){
      const previous=state.position;
      state=springStep(state.position,state.velocity,1,1/fps);
      assert.ok(state.position>=previous&&state.position<=1);
    }
    assert.ok(Math.abs(1-state.position)<.001);
  }
});

test('retargeting keeps momentum continuous and settles at the new target',()=>{
  let state=springStep(0,0,1,.1);
  const reversed=springStep(state.position,state.velocity,0,.0001);
  assert.ok(Math.abs(reversed.position-state.position)<.002);
  assert.ok(Math.abs(reversed.velocity-state.velocity)<.1);
  for(let i=0;i<120;i++)state=springStep(state.position,state.velocity,0,1/120);
  assert.ok(Math.abs(state.position)<.001);
  assert.ok(Math.abs(state.velocity)<.01);
});
