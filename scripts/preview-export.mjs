import http from 'node:http';
import {readFile,stat} from 'node:fs/promises';
import path from 'node:path';
import {gzipSync} from 'node:zlib';

// Local-only review of the exact static export, including the no-JavaScript fallback.
const root=path.resolve('out');
const port=Number(process.env.PORT||3003);
const types={'.html':'text/html; charset=utf-8','.js':'text/javascript','.css':'text/css','.json':'application/json','.txt':'text/x-component','.webp':'image/webp','.png':'image/png','.jpg':'image/jpeg','.svg':'image/svg+xml','.woff2':'font/woff2','.mp4':'video/mp4','.xml':'application/xml'};
http.createServer(async(req,res)=>{
  try{
    const url=new URL(req.url,'http://127.0.0.1');
    const target=path.resolve(root,'.'+decodeURIComponent(url.pathname));
    if(target!==root&&!target.startsWith(root+path.sep)){res.writeHead(403).end();return}
    let file;
    for(const candidate of [target,target+'.html',path.join(target,'index.html'),target.replace(/\.__PAGE__\.txt$/,path.sep+'__PAGE__.txt')]){
      if(await stat(candidate).then(info=>info.isFile(),()=>false)){file=candidate;break}
    }
    if(!file){res.writeHead(404).end();return}
    let body=await readFile(file);
    const extension=path.extname(file);
    if(extension==='.html'&&url.searchParams.has('review-no-js'))body=Buffer.from(body.toString().replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi,''));
    // Local-only fault injection; this server and its controls are never exported.
    if(extension==='.html'&&url.searchParams.has('review-no-webgl'))body=Buffer.from(body.toString().replace('<head>',`<head><script>{const get=HTMLCanvasElement.prototype.getContext;HTMLCanvasElement.prototype.getContext=function(type,...args){return /webgl/.test(type)?null:get.call(this,type,...args)}}<\/script>`));
    if(extension==='.html'&&url.searchParams.has('review-context'))body=Buffer.from(body.toString().replace('</body>',`<div style="position:fixed;bottom:8px;left:8px;z-index:99999;background:white;color:black;padding:8px"><button id="review-lose">Perder contexto WebGL</button><button id="review-restore">Restaurar contexto WebGL</button><output id="review-status">Pronto</output></div><script>{let extension;document.getElementById('review-lose').onclick=()=>{extension=document.querySelector('.ribbon-scene canvas')?.getContext('webgl2')?.getExtension('WEBGL_lose_context');extension?.loseContext();document.getElementById('review-status').textContent=extension?'Contexto perdido':'Canvas indisponível'};document.getElementById('review-restore').onclick=()=>{extension?.restoreContext();document.getElementById('review-status').textContent='Restauração solicitada'}}<\/script></body>`));
    const compressed=/\b(gzip)\b/.test(req.headers['accept-encoding']||'')&&['.html','.js','.css','.json','.xml','.txt','.svg'].includes(extension);
    if(compressed)body=gzipSync(body);
    res.writeHead(200,{'Content-Type':types[extension]||'application/octet-stream','Cache-Control':'no-store',...(compressed?{'Content-Encoding':'gzip','Vary':'Accept-Encoding'}:{})});res.end(body);
  }catch{res.writeHead(500).end()}
}).listen(port,'127.0.0.1',()=>console.log(`Static review: http://127.0.0.1:${port}`));
