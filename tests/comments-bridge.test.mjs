import test from 'node:test';
import assert from 'node:assert/strict';
import {createHmac} from 'node:crypto';
import {onRequestGet,onRequestPost} from '../functions/api/comments.ts';

const origin='https://blog.test', slug='o-novo-logo-da-caixa-e-a-pressa-de-ter-razao';
const env={COMMENTS_HMAC_SECRET:'test-signing-key-'.repeat(3),COMMENTS_STUDIO_ORIGIN:'https://studio.test',COMMENTS_TURNSTILE_SITEKEY:'public-key'};
const url=origin+'/api/comments?slug='+slug;
const valid={author:'Pessoa',body:'Olá',token:'test-token',website:''};
const request=(body=valid,overrides={})=>new Request(url,{
  method:'POST',headers:{Origin:origin,'Content-Type':'application/json','CF-Connecting-IP':'192.0.2.1',...overrides},
  body:JSON.stringify(body),
});

test('the bridge signs eligible list and submit requests and forwards only a protected origin identifier',async t=>{
  const nonces=new Set();
  t.mock.method(globalThis,'fetch',async (target,options)=>{
    assert.equal(target,'https://studio.test/comments/v1');
    assert.equal(options.redirect,'manual');
    const {'X-Comments-Time':time,'X-Comments-Nonce':nonce,'X-Comments-Signature':sig}=options.headers;
    assert.equal(sig,createHmac('sha256',env.COMMENTS_HMAC_SECRET).update(`comments-v1\n${time}\n${nonce}\nPOST\n/comments/v1\n${options.body}`).digest('hex'));
    assert(!nonces.has(nonce));nonces.add(nonce);
    const payload=JSON.parse(options.body);
    assert.equal(payload.slug,slug);
    assert(!options.body.includes('192.0.2.1'));
    if(payload.op==='list'){
      assert.deepEqual(payload,{op:'list',slug,page:0});
      return Response.json({accepting:true,comments:[],nextPage:null});
    }
    assert.deepEqual(Object.keys(payload).sort(),['author','body','op','originKey','slug','token']);
    assert.match(payload.originKey,/^[a-f0-9]{64}$/);
    return Response.json({received:true},{status:202});
  });
  const list=await onRequestGet({request:new Request(url),env});
  assert.deepEqual(await list.json(),{accepting:true,comments:[],nextPage:null,sitekey:'public-key'});
  assert.equal((await onRequestPost({request:request(),env})).status,202);
});

test('private, future, demo and invalid requests are stopped before forwarding',async t=>{
  const outbound=t.mock.method(globalThis,'fetch',async()=>{throw Error('No forwarding')});
  for(const hidden of ['missing','o-futuro-da-criatividade-comeca-com-uma-pausa','future-post','private-post']){
    assert.equal((await onRequestGet({request:new Request(origin+'/api/comments?slug='+hidden),env})).status,404);
  }
  assert.equal((await onRequestGet({request:new Request(url),env:{}})).status,404);
  assert.equal((await onRequestPost({request:request(),env:{}})).status,403);
  assert.equal((await onRequestPost({request:request(valid,{Origin:'https://evil.test'}),env})).status,403);
  assert.equal((await onRequestPost({request:request({...valid,website:'bot'}),env})).status,400);
  assert.equal((await onRequestPost({request:request({...valid,status:'approved'}),env})).status,400);
  assert.equal((await onRequestPost({request:request({...valid,body:'á'.repeat(5000)}),env})).status,413);
  assert.equal(outbound.mock.callCount(),0);
});
