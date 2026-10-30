import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import yaml from 'js-yaml';
test('Pages CMS configuration parses and every field label is a string',()=>{
 const config=yaml.safeLoad(readFileSync('.pages.yml','utf8'));
 for(const collection of config.content)for(const field of collection.fields)assert.equal(typeof field.label,'string',field.name);
 const body=config.content.find(c=>c.name==='posts').fields.find(f=>f.name==='body');
 assert.equal(body.type,'rich-text');
 assert.deepEqual(body.options,{format:'markdown',switcher:true});
});
