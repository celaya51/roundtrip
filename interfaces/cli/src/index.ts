#!/usr/bin/env node
import { readFile, writeFile } from "node:fs/promises";
import { validateDesign } from "../../../packages/core/src/index.ts";
import { renderHtml } from "../../../packages/renderer-html/src/index.ts";
import { renderSvg } from "../../../packages/renderer-svg/src/index.ts";
const [cmd,input,output]=process.argv.slice(2);
if(!cmd||!input){ console.error("usage: roundtrip <validate|html|svg> input.json [output]"); process.exit(2); }
const doc=JSON.parse(await readFile(input,"utf8"));
if(cmd==="validate"){ const r=validateDesign(doc); console.log(JSON.stringify(r,null,2)); process.exit(r.ok?0:1); }
const text=cmd==="html"?renderHtml(doc):cmd==="svg"?renderSvg(doc):null;
if(text===null){ console.error(`Unknown command: ${cmd}`); process.exit(2); }
if(output) await writeFile(output,text); else process.stdout.write(text);
