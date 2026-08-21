import type { Asset, DesignDocument, DesignElement, DesignPage } from "../../design-ir/src/index.ts";

const esc = (s: string) => s.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");
const attr = (s: string) => esc(s).replaceAll('"', "&quot;");

export function renderHtml(doc: DesignDocument, pageId?: string): string {
  const page = pageId ? doc.pages.find(p => p.id === pageId) : doc.pages[0];
  if (!page) throw new Error("Page not found");
  const assets = new Map((doc.assets ?? []).map(a => [a.id, a]));
  const elements = [...page.elements].sort((a,b)=>(a.zIndex ?? 0)-(b.zIndex ?? 0)).map(e=>renderElement(e, assets)).join("\n");
  const embedded = JSON.stringify(doc).replaceAll("</script", "<\\/script");
  return `<!doctype html>\n<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${esc(doc.name ?? "Roundtrip design")}</title><style>html,body{margin:0}body{min-height:100vh;display:grid;place-items:center;background:#ddd}.rt-page{position:relative;overflow:hidden;box-sizing:border-box}</style></head><body><main class="rt-page" data-document-role="page" data-roundtrip-page="${attr(page.id)}" style="width:${page.width}px;height:${page.height}px;background:${attr(page.background ?? "transparent")}">${elements}</main><script type="application/json" id="roundtrip-designir">${embedded}</script></body></html>`;
}

function baseStyle(el: DesignElement): string {
  return `position:absolute;left:${el.x}px;top:${el.y}px;width:${el.width}px;height:${el.height}px;box-sizing:border-box;transform:rotate(${el.rotation ?? 0}deg);opacity:${el.opacity ?? 1};${el.visible === false ? "display:none;" : ""}`;
}

function renderElement(el: DesignElement, assets: Map<string, Asset>): string {
  const data = `data-rt-id="${attr(el.id)}" data-rt-type="${el.type}"`;
  if (el.type === "text") {
    const s=el.style ?? {};
    const st=baseStyle(el)+`font-family:${attr(s.fontFamily ?? "Arial, sans-serif")};font-size:${s.fontSize ?? 16}px;font-weight:${s.fontWeight ?? 400};font-style:${s.fontStyle ?? "normal"};color:${attr(s.color ?? "#000")};text-align:${s.align ?? "left"};line-height:${s.lineHeight ?? 1.2};letter-spacing:${s.letterSpacing ?? 0}px;white-space:pre-wrap;overflow:hidden;`;
    return `<div ${data} style="${st}">${esc(el.text)}</div>`;
  }
  if (el.type === "shape") {
    let st=baseStyle(el);
    if (el.shape === "ellipse") st += "border-radius:50%;";
    else if (el.shape === "rect") st += `border-radius:${el.borderRadius ?? 0}px;`;
    else if (el.shape === "line") st += `height:${el.strokeWidth ?? 1}px;`;
    st += `background:${attr(el.fill ?? (el.shape === "line" ? el.stroke ?? "#000" : "transparent"))};`;
    if (el.stroke && el.shape !== "line") st += `border:${el.strokeWidth ?? 1}px solid ${attr(el.stroke)};`;
    return `<div ${data} style="${st}"></div>`;
  }
  if (el.type === "image") {
    const a=assets.get(el.assetId); const src=a?.src ?? "";
    return `<img ${data} alt="" src="${attr(src)}" style="${baseStyle(el)}object-fit:${el.fit ?? "cover"};">`;
  }
  const kids=[...el.children].sort((a,b)=>(a.zIndex ?? 0)-(b.zIndex ?? 0)).map(e=>renderElement(e,assets)).join("");
  return `<div ${data} style="${baseStyle(el)}">${kids}</div>`;
}
