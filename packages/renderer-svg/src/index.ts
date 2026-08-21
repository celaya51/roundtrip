import type { Asset, DesignDocument, DesignElement } from "../../design-ir/src/index.ts";
const esc=(s:string)=>s.replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;");
export function renderSvg(doc: DesignDocument, pageId?: string): string {
  const p=pageId?doc.pages.find(p=>p.id===pageId):doc.pages[0]; if(!p) throw new Error("Page not found");
  const assets=new Map((doc.assets??[]).map(a=>[a.id,a]));
  const bg=p.background?`<rect width="100%" height="100%" fill="${esc(p.background)}"/>`:"";
  const body=[...p.elements].sort((a,b)=>(a.zIndex??0)-(b.zIndex??0)).map(e=>element(e,assets)).join("\n");
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${p.width}" height="${p.height}" viewBox="0 0 ${p.width} ${p.height}">${bg}${body}</svg>`;
}
function element(el:DesignElement,assets:Map<string,Asset>):string{
 const opacity=el.opacity??1; const tr=el.rotation?` transform="rotate(${el.rotation} ${el.x+el.width/2} ${el.y+el.height/2})"`:"";
 if(el.type==="shape"){
  if(el.shape==="ellipse") return `<ellipse data-rt-id="${esc(el.id)}" cx="${el.x+el.width/2}" cy="${el.y+el.height/2}" rx="${el.width/2}" ry="${el.height/2}" fill="${esc(el.fill??"none")}" opacity="${opacity}"${tr}/>`;
  if(el.shape==="line") return `<line data-rt-id="${esc(el.id)}" x1="${el.x}" y1="${el.y}" x2="${el.x+el.width}" y2="${el.y+el.height}" stroke="${esc(el.stroke??"#000")}" stroke-width="${el.strokeWidth??1}" opacity="${opacity}"${tr}/>`;
  return `<rect data-rt-id="${esc(el.id)}" x="${el.x}" y="${el.y}" width="${el.width}" height="${el.height}" rx="${el.borderRadius??0}" fill="${esc(el.fill??"none")}" stroke="${esc(el.stroke??"none")}" stroke-width="${el.strokeWidth??0}" opacity="${opacity}"${tr}/>`;
 }
 if(el.type==="text"){
  const s=el.style??{}; return `<foreignObject data-rt-id="${esc(el.id)}" x="${el.x}" y="${el.y}" width="${el.width}" height="${el.height}" opacity="${opacity}"${tr}><div xmlns="http://www.w3.org/1999/xhtml" style="font-family:${esc(s.fontFamily??"Arial")};font-size:${s.fontSize??16}px;font-weight:${s.fontWeight??400};color:${esc(s.color??"#000")};line-height:${s.lineHeight??1.2};white-space:pre-wrap">${esc(el.text)}</div></foreignObject>`;
 }
 if(el.type==="image") { const src=assets.get(el.assetId)?.src??""; return `<image data-rt-id="${esc(el.id)}" href="${esc(src)}" x="${el.x}" y="${el.y}" width="${el.width}" height="${el.height}" opacity="${opacity}" preserveAspectRatio="xMidYMid slice"${tr}/>`; }
 const kids=el.children.map(c=>element(c,assets)).join(""); return `<g data-rt-id="${esc(el.id)}" opacity="${opacity}"${tr}>${kids}</g>`;
}
