import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,readdirSync,statSync} from 'node:fs';
import {join,relative} from 'node:path';

const SRC=new URL('../src/',import.meta.url).pathname;
function files(dir:string):string[]{
 return readdirSync(dir).flatMap(name=>{const path=join(dir,name);return statSync(path).isDirectory()?files(path):/\.tsx?$/.test(name)?[path]:[];});
}

test('mocks stay in one folder: only app/services.ts imports them, so the folder can be removed in one go',()=>{
 const importers=files(SRC).filter(path=>!relative(SRC,path).startsWith('mocks/'))
  .filter(path=>/from\s+['"][^'"]*\/mocks(\/|['"])/.test(readFileSync(path,'utf8')))
  .map(path=>relative(SRC,path));
 assert.deepEqual(importers,['app/services.ts']);
 const named=files(SRC).filter(path=>!relative(SRC,path).startsWith('mocks/'))
  .filter(path=>/export const mock[A-Z]/.test(readFileSync(path,'utf8'))).map(path=>relative(SRC,path));
 assert.deepEqual(named,[],'no mock implementation lives outside mocks/');
});
