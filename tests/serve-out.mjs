import http from 'node:http';
import {createReadStream} from 'node:fs';
import {stat} from 'node:fs/promises';
import path from 'node:path';

const root=path.resolve('out');
const types={'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.xml':'application/xml; charset=utf-8','.txt':'text/plain; charset=utf-8','.json':'application/json; charset=utf-8','.svg':'image/svg+xml','.webp':'image/webp','.png':'image/png','.ico':'image/x-icon','.woff2':'font/woff2','.mp4':'video/mp4'};
const port=Number(process.env.PORT||3001);
http.createServer(async(request,response)=>{
  let url;
  try{url=decodeURIComponent(new URL(request.url||'/',`http://localhost:${port}`).pathname)}catch{response.writeHead(400).end();return}
  const relative=url==='/'?'index.html':url.replace(/^\//,'').replace(/\/$/,'');
  const exact=path.resolve(root,relative);
  const file=await stat(exact).then(info=>info.isFile()?exact:path.resolve(root,relative+'.html'),()=>path.resolve(root,relative+'.html'));
  if(!file.startsWith(root+path.sep)){response.writeHead(403).end();return}
  try{
    const info=await stat(file);
    if(!info.isFile())throw new Error('not a file');
    response.writeHead(200,{'Content-Type':path.basename(file)==='opengraph-image'?'image/png':types[path.extname(file)]||'application/octet-stream','Content-Length':info.size});
    createReadStream(file).pipe(response);
  }catch{response.writeHead(404,{'Content-Type':'text/html; charset=utf-8'});createReadStream(path.join(root,'404.html')).pipe(response)}
}).listen(port,'127.0.0.1',()=>console.log(`Exportação local em http://127.0.0.1:${port}`));
