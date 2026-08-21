import { readFile, mkdir, writeFile } from "node:fs/promises";
import { renderHtml } from "../packages/renderer-html/src/index.ts";
import { renderSvg } from "../packages/renderer-svg/src/index.ts";
const doc=JSON.parse(await readFile(new URL("../examples/veia/veia-post.design.json",import.meta.url),"utf8"));
await mkdir(new URL("../dist/",import.meta.url),{recursive:true});
await writeFile(new URL("../dist/veia-post.html",import.meta.url),renderHtml(doc));
await writeFile(new URL("../dist/veia-post.svg",import.meta.url),renderSvg(doc));
console.log("Rendered dist/veia-post.html and dist/veia-post.svg");
