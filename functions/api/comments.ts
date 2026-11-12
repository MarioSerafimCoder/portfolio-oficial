import publicSlugs from '../../src/content/journal-comments-public.json' with {type:'json'};

type Env = {
  COMMENTS_HMAC_SECRET?: string;
  COMMENTS_STUDIO_ORIGIN?: string;
  COMMENTS_TURNSTILE_SITEKEY?: string;
};
type Context = {request:Request;env:Env};
const bridgePath = '/comments/v1';
const articleSlugs = new Set(publicSlugs);
const headers = {'Cache-Control':'no-store','X-Content-Type-Options':'nosniff'};
const error = (status:number, code:string) => Response.json({error:code},{status,headers});
const encoder = new TextEncoder();
const hex = (bytes:ArrayBuffer) => Array.from(new Uint8Array(bytes),byte=>byte.toString(16).padStart(2,'0')).join('');

async function readSubmission(request:Request) {
  const reader = request.body?.getReader();
  if (!reader) throw new TypeError();
  const decoder = new TextDecoder('utf-8',{fatal:true});
  let raw = '', size = 0;
  try {
    while (true) {
      const {done,value} = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > 8192) throw new RangeError();
      raw += decoder.decode(value,{stream:true});
    }
    return JSON.parse(raw+decoder.decode());
  } catch (cause) {
    await reader.cancel().catch(()=>{});
    throw cause;
  } finally { reader.releaseLock(); }
}
async function forward(env:Env, payload:Record<string,unknown>, ip?:string) {
  const secret = env.COMMENTS_HMAC_SECRET;
  if (!secret || secret.length < 32 || !env.COMMENTS_STUDIO_ORIGIN) return error(503,'comments_unavailable');
  try {
    const studio = new URL(env.COMMENTS_STUDIO_ORIGIN);
    const local = studio.protocol === 'http:' && ['localhost','127.0.0.1'].includes(studio.hostname);
    if ((!local && studio.protocol !== 'https:') || studio.username || studio.password || studio.href !== studio.origin+'/') {
      return error(503,'comments_unavailable');
    }
    const key = await crypto.subtle.importKey('raw',encoder.encode(secret),{name:'HMAC',hash:'SHA-256'},false,['sign']);
    const sign = async (message:string) => hex(await crypto.subtle.sign('HMAC',key,encoder.encode(message)));
    if (ip) payload.originKey = await sign('comments-origin-v1\n'+ip);
    const body = JSON.stringify(payload), time = String(Date.now()), nonce = crypto.randomUUID();
    const signature = await sign(`comments-v1\n${time}\n${nonce}\nPOST\n${bridgePath}\n${body}`);
    const result = await fetch(studio.origin+bridgePath,{
      method:'POST',redirect:'manual',signal:AbortSignal.timeout(15000),body,
      headers:{'Content-Type':'application/json','X-Comments-Time':time,'X-Comments-Nonce':nonce,'X-Comments-Signature':signature},
    });
    if ((result.status >= 300 && result.status < 400) || result.status >= 500 || result.status === 401 || !result.headers.get('Content-Type')?.startsWith('application/json')) {
      return error(503,'comments_unavailable');
    }
    return Response.json(await result.json(),{status:result.status,headers});
  } catch { return error(503,'comments_unavailable'); }
}
function postSlug(request:Request) {
  const slug = new URL(request.url).searchParams.get('slug') ?? '';
  return articleSlugs.has(slug) ? slug : null;
}
export async function onRequestGet({request,env}:Context) {
  if (!env.COMMENTS_HMAC_SECRET || !env.COMMENTS_STUDIO_ORIGIN) return error(404,'comments_unavailable');
  const slug = postSlug(request);
  if (!slug) return error(404,'post_unavailable');
  const page = Number(new URL(request.url).searchParams.get('page') ?? '0');
  if (!Number.isInteger(page) || page<0 || page>1000) return error(400,'invalid_page');
  const response = await forward(env,{op:'list',slug,page});
  if (!response.ok) return response;
  const data = await response.json() as {accepting:boolean};
  const sitekey = data.accepting ? env.COMMENTS_TURNSTILE_SITEKEY || null : null;
  return Response.json({...data,accepting: Boolean(sitekey),sitekey},{headers});
}
export async function onRequestPost({request,env}:Context) {
  const slug = postSlug(request);
  if (!slug) return error(404,'post_unavailable');
  if (!env.COMMENTS_TURNSTILE_SITEKEY) return error(403,'comments_closed');
  const origin = request.headers.get('Origin'), site = request.headers.get('Sec-Fetch-Site');
  if (origin !== new URL(request.url).origin || (site && site !== 'same-origin')) return error(403,'invalid_origin');
  if (request.headers.get('Content-Type')?.split(';')[0].trim() !== 'application/json') return error(415,'json_required');
  const ip = request.headers.get('CF-Connecting-IP');
  if (!ip || ip.length>45 || !/^[a-f0-9:.]+$/i.test(ip)) return error(403,'invalid_origin');
  let data;
  try { data = await readSubmission(request); }
  catch (cause) {return cause instanceof RangeError ? error(413,'body_too_large') : error(400,'invalid_json');}
  if (!data || typeof data !== 'object' || Array.isArray(data) || Object.keys(data).some(key=>!['author','body','token','website'].includes(key)) ||
      typeof data.author !== 'string' || !data.author.trim() || data.author.length>50 ||
      typeof data.body !== 'string' || !data.body.trim() || data.body.length>800 ||
      typeof data.token !== 'string' || !data.token || data.token.length>2048 || data.website !== '') {
    return error(400,'invalid_payload');
  }
  return forward(env,{op:'submit',slug,author:data.author,body:data.body,token:data.token},ip);
}
