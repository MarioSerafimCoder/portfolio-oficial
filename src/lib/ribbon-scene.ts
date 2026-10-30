import * as THREE from 'three';
import {perceptionMotion as motion} from './perception-motion';

/** Closed ribbon with a rounded rectangular cross section and one full twist. */
function ribbonGeometry(segments: number) {
  const positions: number[] = [], indices: number[] = [];
  const section = 16;
  for (let i = 0; i <= segments; i++) {
    const t = i / segments * Math.PI * 2;
    const center = new THREE.Vector3(1.68 * Math.cos(t), 1.18 * Math.sin(t), .25 * Math.sin(2 * t));
    const tangent = new THREE.Vector3(-1.68 * Math.sin(t), 1.18 * Math.cos(t), .5 * Math.cos(2 * t)).normalize();
    const radial = new THREE.Vector3(Math.cos(t), Math.sin(t), 0).normalize();
    const normal = new THREE.Vector3().crossVectors(tangent, radial).normalize();
    radial.crossVectors(normal, tangent).normalize();
    const twist = t + .4;
    const width = radial.clone().multiplyScalar(Math.cos(twist)).addScaledVector(normal, Math.sin(twist));
    const depth = new THREE.Vector3().crossVectors(tangent, width).normalize();
    for (let j = 0; j < section; j++) {
      const a = j / section * Math.PI * 2;
      const u = Math.sign(Math.cos(a)) * Math.pow(Math.abs(Math.cos(a)), .45) * .32;
      const v = Math.sign(Math.sin(a)) * Math.pow(Math.abs(Math.sin(a)), .45) * .047;
      const p = center.clone().addScaledVector(width, u).addScaledVector(depth, v);
      positions.push(p.x, p.y, p.z);
      if (i < segments) {
        const n = i * section + j, next = i * section + (j + 1) % section;
        indices.push(n, next, n + section, next, next + section, n + section);
      }
    }
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  geometry.setIndex(indices); geometry.computeVertexNormals();
  // Share the seam normals while retaining the closed cross-section topology.
  const normals = geometry.getAttribute('normal');
  for (let j = 0; j < section; j++) {
    const end = segments * section + j;
    const n = new THREE.Vector3().fromBufferAttribute(normals, j)
      .add(new THREE.Vector3().fromBufferAttribute(normals, end)).normalize();
    normals.setXYZ(j, n.x, n.y, n.z); normals.setXYZ(end, n.x, n.y, n.z);
  }
  return geometry;
}

/** Organic motion while visible; pauses offscreen, in hidden tabs and for reduced motion. */
export function createRibbonScene(host: HTMLElement, hero: HTMLElement) {
  const mobile = matchMedia('(max-width: 700px)').matches;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const fine = matchMedia('(pointer: fine)');
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('webgl2', {alpha:true,antialias:true,powerPreference:'low-power'});
  if (!context) throw new Error('WebGL2 unavailable; keep the static sculpture.');
  const renderer = new THREE.WebGLRenderer({canvas,context,alpha: true, antialias: true, powerPreference: 'low-power'});
  renderer.setPixelRatio(Math.min(devicePixelRatio, mobile ? motion.mobileDpr : motion.desktopDpr));
  renderer.setClearColor(0x000000, 0);
  renderer.toneMapping = THREE.ACESFilmicToneMapping; renderer.toneMappingExposure = 1.15;
  canvas.setAttribute('aria-hidden', 'true'); host.appendChild(canvas);
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(36, 1, .1, 30); camera.position.z = 7.2;
  const geometry = ribbonGeometry(mobile ? 128 : 200);
  const positions = geometry.getAttribute('position') as THREE.BufferAttribute;
  const rest = new Float32Array(positions.array);
  positions.setUsage(THREE.DynamicDrawUsage);
  const material = new THREE.MeshStandardMaterial({color: 0xd70918, metalness: .12, roughness: .61, side: THREE.DoubleSide});
  const ribbon = new THREE.Mesh(geometry, material); scene.add(ribbon);
  scene.add(new THREE.HemisphereLight(0xfff5ed, 0x42121b, 3.1));
  const key = new THREE.DirectionalLight(0xfff7f0, 3.4); key.position.set(-3, 4, 5); scene.add(key);
  const fill = new THREE.DirectionalLight(0xffa7a2, 1.8); fill.position.set(4, -1, 2); scene.add(fill);
  const rim = new THREE.DirectionalLight(0xffe4d8, 2.2); rim.position.set(1, 3, -4); scene.add(rim);
  let visible = false, lost = false, disposed = false, compiled = false, frame = 0, last = 0;
  let progress = 0, x = 0, y = 0, tx = 0, ty = 0, currentProgress = 0;
  let elapsed = 0, attraction = 0, targetAttraction = 0;
  const pointerWorld = new THREE.Vector3(), pointerTarget = new THREE.Vector3(), localPointer = new THREE.Vector3();
  const pointerNdc = new THREE.Vector2();
  const ray = new THREE.Raycaster();
  const interactionPlane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
  const seamNormal = new THREE.Vector3(), endNormal = new THREE.Vector3();
  function stop() {cancelAnimationFrame(frame); frame = 0; last = 0;}
  function deform(time: number) {
    // Always deform the original vertices: no accumulating drift or stretching.
    localPointer.copy(pointerWorld); ribbon.worldToLocal(localPointer);
    for (let i = 0; i < positions.count; i++) {
      const offset = i * 3;
      const bx = rest[offset], by = rest[offset + 1], bz = rest[offset + 2];
      const angle = Math.atan2(by / 1.18, bx / 1.68);
      const wave = Math.sin(angle * 3 - time * .65) * .055
        + Math.sin(angle * 2 + time * .43) * .035;
      const dx = bx - localPointer.x, dy = by - localPointer.y;
      const influence = Math.exp(-(dx * dx + dy * dy) / 1.1) * attraction;
      positions.setXYZ(i,
        bx * (1 + wave) + (localPointer.x - bx) * influence * .12,
        by * (1 + wave * .8) + (localPointer.y - by) * influence * .12,
        bz + Math.sin(angle * 2 - time * .55) * .12
          + Math.cos(angle * 3 + time * .37) * .045 + influence * .18);
    }
    positions.needsUpdate = true;
    geometry.computeVertexNormals();
    // Keep the join invisible as the ribbon changes shape.
    const normals = geometry.getAttribute('normal');
    for (let j = 0; j < 16; j++) {
      const end = positions.count - 16 + j;
      seamNormal.fromBufferAttribute(normals, j);
      endNormal.fromBufferAttribute(normals, end);
      seamNormal.add(endNormal).normalize();
      normals.setXYZ(j, seamNormal.x, seamNormal.y, seamNormal.z);
      normals.setXYZ(end, seamNormal.x, seamNormal.y, seamNormal.z);
    }
  }
  function render(time: number) {
    frame = 0;
    if (disposed || lost || !compiled || !visible || document.hidden) return;
    const dt = last ? Math.min((time - last) / 1000, .05) : 1 / 60; last = time;
    if (!reduced.matches) elapsed += dt;
    const ease = reduced.matches ? 1 : 1 - Math.exp(-motion.damping * dt);
    x += (tx - x) * ease; y += (ty - y) * ease; currentProgress += (progress - currentProgress) * ease;
    attraction += (targetAttraction - attraction) * ease;
    pointerWorld.lerp(pointerTarget, ease);
    const p = reduced.matches ? 0 : currentProgress;
    const t = reduced.matches ? 0 : elapsed;
    ribbon.rotation.set(.22 + y + p * .5 + Math.sin(t * .29) * .085,
      -.32 + x + p * motion.scrollTurn + Math.sin(t * .23) * .12,
      -.38 - p * .45 + Math.sin(t * .19) * .055);
    ribbon.scale.setScalar(1 + p * motion.scrollScale + Math.sin(t * .7) * .018);
    ribbon.position.set(-p * .22 + x * .12, -p * .2 + Math.sin(t * .6) * .065 - y * .12, 0);
    ribbon.updateMatrixWorld();
    if (!reduced.matches) deform(t);
    renderer.render(scene, camera); host.dataset.ready = 'true';
    if (!reduced.matches) request();
  }
  function request() {if (!frame && compiled && visible && !document.hidden && !lost && !disposed) frame = requestAnimationFrame(render);}
  renderer.compileAsync(scene,camera).then(() => {if (!disposed) {compiled = true; request();}}).catch(() => {lost = true;});
  const resize = new ResizeObserver(entries => {
    const {width, height} = entries[0].contentRect;
    if (!width || !height) return;
    renderer.setSize(width, height); camera.aspect = width / height;
    camera.position.z = camera.aspect < 1 ? 8.1 : 7.2;
    camera.updateProjectionMatrix(); request();
  }); resize.observe(host);
  const observer = new IntersectionObserver(entries => {visible = entries[0].isIntersecting; if (visible) request(); else stop();}); observer.observe(host);
  const pointer = (event: PointerEvent) => {
    if (reduced.matches || !fine.matches || event.pointerType === 'touch') return;
    const bounds = host.getBoundingClientRect();
    if (!bounds.width || !bounds.height) return;
    const px = (event.clientX - bounds.left) / bounds.width * 2 - 1;
    const py = (event.clientY - bounds.top) / bounds.height * 2 - 1;
    tx = THREE.MathUtils.clamp(px, -1, 1) * motion.pointerTilt;
    ty = THREE.MathUtils.clamp(py, -1, 1) * motion.pointerTilt * .7;
    pointerNdc.set(px, -py); ray.setFromCamera(pointerNdc, camera);
    ray.ray.intersectPlane(interactionPlane, pointerTarget);
    targetAttraction = 1; request();
  };
  const reset = () => {
    tx = ty = targetAttraction = 0;
    if (reduced.matches) {
      x = y = attraction = 0;
      positions.array.set(rest); positions.needsUpdate = true;
      geometry.computeVertexNormals();
    }
    request();
  };
  const visibility = () => {if (document.hidden) stop(); else request();};
  const contextLost = (event: Event) => {event.preventDefault(); lost = true; stop(); delete host.dataset.ready;};
  const contextRestored = () => {
    compiled = false; lost = false;
    renderer.compileAsync(scene,camera).then(() => {if (!disposed) {compiled = true; request();}}).catch(() => {lost = true;});
  };
  hero.addEventListener('pointermove', pointer, {passive:true}); hero.addEventListener('pointerleave', reset);
  document.addEventListener('visibilitychange', visibility); reduced.addEventListener('change', reset);
  canvas.addEventListener('webglcontextlost', contextLost); canvas.addEventListener('webglcontextrestored', contextRestored);
  return {
    progress(value: number) {progress = reduced.matches ? 0 : value; request();},
    dispose() {
      disposed = true; stop(); observer.disconnect(); resize.disconnect();
      hero.removeEventListener('pointermove', pointer); hero.removeEventListener('pointerleave', reset);
      document.removeEventListener('visibilitychange', visibility); reduced.removeEventListener('change', reset);
      canvas.removeEventListener('webglcontextlost', contextLost); canvas.removeEventListener('webglcontextrestored', contextRestored);
      geometry.dispose(); material.dispose(); renderer.dispose(); renderer.forceContextLoss(); canvas.remove(); delete host.dataset.ready;
    },
  };
}
