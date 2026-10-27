import test from 'node:test';
import assert from 'node:assert/strict';
import {validateDocument} from '../scripts/validate-export.mjs';

const valid='<!DOCTYPE html><html lang="en"><head><title>Page</title></head><body><main>Page</main></body></html>';
test('export guard rejects the document wrapping regression even when page content exists',()=>{
 assert.doesNotThrow(()=>validateDocument(valid,'en.html'));
 assert.throws(()=>validateDocument(`<script src="/polyfill.js"></script><div>${valid}</div>`,'en.html'),/DOCTYPE/);
 assert.throws(()=>validateDocument(valid.replace('<main>','<html><main>').replace('</main>','</main></html>'),'en.html'),/exactly one <html>/);
});
