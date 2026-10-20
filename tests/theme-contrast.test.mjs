import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
const css=fs.readFileSync('src/app/globals.css','utf8');
function luminance(hex){const rgb=hex.match(/\w\w/g).map(h=>parseInt(h,16)/255).map(c=>c<=.04045?c/12.92:((c+.055)/1.055)**2.4);return rgb[0]*.2126+rgb[1]*.7152+rgb[2]*.0722}
function ratio(a,b){const x=luminance(a),y=luminance(b);return (Math.max(x,y)+.05)/(Math.min(x,y)+.05)}
for(const [theme,selector] of [['claro',':root{'],['escuro',':root[data-theme=dark]{']]){
 test(`tokens de texto e controles atendem ao contraste AA no tema ${theme}`,()=>{
  const body=css.split(selector)[1].split('}')[0];const tokens=Object.fromEntries([...body.matchAll(/--([\w-]+):#([\da-f]{6})/gi)].map(m=>[m[1],m[2]]));
  assert.ok(ratio(tokens['on-accent'],tokens.accent)>=4.5,'texto sobre o vermelho');
  for(const surface of ['paper','surface']){
   for(const text of ['ink','muted','accent-text','error','success','disabled'])assert.ok(ratio(tokens[text],tokens[surface])>=4.5,`${text} em ${surface}`);
   for(const control of ['control','focus','accent'])assert.ok(ratio(tokens[control],tokens[surface])>=3,`${control} em ${surface}`);
  }
 });
}
