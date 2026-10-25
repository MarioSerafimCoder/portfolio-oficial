'use client';
import {useEffect,useRef} from 'react';

/** A lit, actual 3D torus: one mesh, one draw call, no external assets/runtime. */
export function IdentitySculpture(){
 const ref=useRef<HTMLCanvasElement>(null);
 useEffect(()=>{
  const canvas=ref.current;if(!canvas)return;
  const gl=canvas.getContext('webgl',{alpha:true,antialias:true,powerPreference:'low-power'});if(!gl)return;
  const vertex=`attribute vec3 position;attribute vec3 normal;uniform vec2 turn;uniform float aspect;varying vec3 N;varying vec3 P;
  void main(){float a=turn.x,b=turn.y;mat3 rx=mat3(1.,0.,0.,0.,cos(a),sin(a),0.,-sin(a),cos(a));mat3 ry=mat3(cos(b),0.,-sin(b),0.,1.,0.,sin(b),0.,cos(b));vec3 p=ry*rx*position;N=ry*rx*normal;P=p;float z=4.3-p.z;float lens=2.7*min(1.,aspect);gl_Position=vec4(p.x*lens/aspect,p.y*lens,z-.2,z);}`;
  const fragment=`precision mediump float;varying vec3 N;varying vec3 P;void main(){vec3 n=normalize(N),l=normalize(vec3(-2.,3.,4.)),v=normalize(vec3(0.,0.,4.3)-P);float d=max(dot(n,l),0.);float spec=pow(max(dot(reflect(-l,n),v),0.),45.);float rim=pow(1.-max(dot(n,v),0.),3.);vec3 red=vec3(.72,.012,.025)*(.22+d*.92)+vec3(1.,.64,.55)*spec*.9+vec3(.34,.025,.035)*rim;gl_FragColor=vec4(red,1.);}`;
  const compile=(type:number,source:string)=>{const shader=gl.createShader(type)!;gl.shaderSource(shader,source);gl.compileShader(shader);if(!gl.getShaderParameter(shader,gl.COMPILE_STATUS)){gl.deleteShader(shader);return null}return shader};
  const vs=compile(gl.VERTEX_SHADER,vertex),fs=compile(gl.FRAGMENT_SHADER,fragment);if(!vs||!fs)return;
  const program=gl.createProgram()!;gl.attachShader(program,vs);gl.attachShader(program,fs);gl.linkProgram(program);if(!gl.getProgramParameter(program,gl.LINK_STATUS))return;
  gl.useProgram(program);gl.enable(gl.DEPTH_TEST);
  const positions:number[]=[],normals:number[]=[];
  const point=(u:number,v:number)=>{const tube=.3+.055*Math.cos(u*3);return {p:[(1+tube*Math.cos(v))*Math.cos(u),(1+tube*Math.cos(v))*Math.sin(u),tube*Math.sin(v)],n:[Math.cos(v)*Math.cos(u),Math.cos(v)*Math.sin(u),Math.sin(v)]}};
  for(let i=0;i<80;i++)for(let j=0;j<24;j++)for(const [du,dv] of [[0,0],[1,0],[1,1],[0,0],[1,1],[0,1]]){const v=point((i+du)/80*Math.PI*2,(j+dv)/24*Math.PI*2);positions.push(...v.p);normals.push(...v.n)}
  const buffers=[['position',positions],['normal',normals]].map(([name,values])=>{const b=gl.createBuffer()!;gl.bindBuffer(gl.ARRAY_BUFFER,b);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(values as number[]),gl.STATIC_DRAW);const location=gl.getAttribLocation(program,name as string);gl.enableVertexAttribArray(location);gl.vertexAttribPointer(location,3,gl.FLOAT,false,0,0);return b});
  const turn=gl.getUniformLocation(program,'turn'),aspect=gl.getUniformLocation(program,'aspect');
  const reduced=matchMedia('(prefers-reduced-motion: reduce)');let frame=0,visible=false,start=0,x=0,y=0,tx=0,ty=0,angle=0;
  const draw=(time:number)=>{frame=0;if(!visible||document.hidden)return;const dt=start?Math.min((time-start)/1000,.04):0;start=time;if(!reduced.matches){angle+=dt*.18;x+=(tx-x)*.09;y+=(ty-y)*.09}const box=canvas.getBoundingClientRect(),ratio=Math.min(devicePixelRatio,1.5);const w=Math.round(box.width*ratio),h=Math.round(box.height*ratio);if(canvas.width!==w||canvas.height!==h){canvas.width=w;canvas.height=h}gl.viewport(0,0,w,h);gl.clearColor(0,0,0,0);gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);gl.uniform1f(aspect,w/Math.max(h,1));gl.uniform2f(turn,.6+y*.65+angle*.25,.5+x*.8+angle);gl.drawArrays(gl.TRIANGLES,0,positions.length/3);canvas.dataset.ready='true';if(!reduced.matches)frame=requestAnimationFrame(draw)};
  const request=()=>{if(!frame&&visible&&!document.hidden){start=0;frame=requestAnimationFrame(draw)}};
  const parent=canvas.closest('.home-hero')!;
  const move=(e:PointerEvent)=>{if(e.pointerType!=='mouse')return;const r=parent.getBoundingClientRect();tx=(e.clientX-r.left)/r.width-.5;ty=(e.clientY-r.top)/r.height-.5};
  const leave=()=>{tx=ty=0};
  const observer=new IntersectionObserver(([entry])=>{visible=entry.isIntersecting;if(visible)request();else{cancelAnimationFrame(frame);frame=0}});observer.observe(canvas);
  const resize=new ResizeObserver(request);resize.observe(canvas);
  const preference=()=>{cancelAnimationFrame(frame);frame=0;request()};
  parent.addEventListener('pointermove',move as EventListener,{passive:true});parent.addEventListener('pointerleave',leave);document.addEventListener('visibilitychange',preference);reduced.addEventListener('change',preference);
  return()=>{cancelAnimationFrame(frame);observer.disconnect();resize.disconnect();parent.removeEventListener('pointermove',move as EventListener);parent.removeEventListener('pointerleave',leave);document.removeEventListener('visibilitychange',preference);reduced.removeEventListener('change',preference);buffers.forEach(b=>gl.deleteBuffer(b));gl.deleteProgram(program);gl.deleteShader(vs);gl.deleteShader(fs)};
 },[]);
 return <div className="identity-sculpture" aria-hidden="true"><span className="sculpture-shadow"/><canvas ref={ref}/></div>;
}
