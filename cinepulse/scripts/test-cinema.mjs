import {spawnSync} from 'node:child_process';
import {mkdirSync,writeFileSync} from 'node:fs';
const out='.sites-runtime/test-build';mkdirSync(out,{recursive:true});
const compiled=spawnSync(process.execPath,['node_modules/typescript/bin/tsc','tests/cinema.test.ts','--outDir',out,'--module','commonjs','--target','ES2022','--esModuleInterop','--skipLibCheck','--moduleResolution','node'],{stdio:'inherit'});
if(compiled.status!==0)process.exit(compiled.status||1);
writeFileSync(`${out}/package.json`,JSON.stringify({type:'commonjs'}));
const tests=spawnSync(process.execPath,['--test',`${out}/tests/cinema.test.js`],{stdio:'inherit'});process.exit(tests.status||0);
