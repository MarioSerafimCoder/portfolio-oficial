import {readdir,mkdir,stat,writeFile,readFile} from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import sharp from 'sharp';

const root=path.resolve('public/media');
const widths=[96,160,320,640,960,1440,1920];
const version=(await stat(fileURLToPath(import.meta.url))).mtimeMs;
async function walk(directory) {
  const files=[];
  for(const item of await readdir(directory,{withFileTypes:true})) {
    if(item.name==='responsive')continue;
    const file=path.join(directory,item.name);
    if(item.isDirectory())files.push(...await walk(file));
    else if(/\.(webp|png|jpe?g)$/i.test(item.name))files.push(file);
  }
  return files;
}
let count=0;
for(const file of await walk(root)) {
  const info=await stat(file);
  const folder=path.join(root,'responsive',path.relative(root,file));
  const fingerprint=`${info.size}:${info.mtimeMs}:${version}`;
  try{if(await readFile(path.join(folder,'.source'),'utf8')===fingerprint)continue}catch{}
  await mkdir(folder,{recursive:true});
  // One source at a time bounds memory when CI processes the full case library.
  const input=sharp(file).rotate();
  await Promise.all(widths.map(width=>input.clone().resize({width,withoutEnlargement:true}).webp({quality:82,effort:4}).toFile(path.join(folder,`${width}.webp`))));
  await writeFile(path.join(folder,'.source'),fingerprint);
  count++;
}
console.log(`Responsive images: ${count} sources updated; ${widths.length} sizes per source.`);
