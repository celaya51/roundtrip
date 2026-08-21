import { McpServer } from "@modelcontextprotocol/server";
import { serveStdio } from "@modelcontextprotocol/server/stdio";
import * as z from "zod/v4";
import { validateDesign, setText, resizePage } from "../../../packages/core/src/index.ts";
import { renderHtml } from "../../../packages/renderer-html/src/index.ts";
import { renderSvg } from "../../../packages/renderer-svg/src/index.ts";
import type { DesignDocument } from "../../../packages/design-ir/src/index.ts";

const designSchema = z.record(z.string(), z.unknown());
function textResult(value: unknown){ return { content:[{type:"text" as const,text:typeof value==="string"?value:JSON.stringify(value,null,2)}], structuredContent: typeof value === "object" && value !== null ? value as Record<string,unknown> : undefined }; }

function createServer(){
 const server=new McpServer({name:"roundtrip",version:"0.2.0"});
 server.registerTool("validate_design",{title:"Validate Roundtrip design",description:"Validate a DesignIR document.",inputSchema:{design:designSchema}},async({design})=>textResult(validateDesign(design)));
 server.registerTool("render_html",{title:"Render HTML",description:"Render a DesignIR document to editable HTML/CSS.",inputSchema:{design:designSchema,pageId:z.string().optional()}},async({design,pageId})=>({content:[{type:"text",text:renderHtml(design as unknown as DesignDocument,pageId)}]}));
 server.registerTool("render_svg",{title:"Render SVG",description:"Render a DesignIR document to SVG.",inputSchema:{design:designSchema,pageId:z.string().optional()}},async({design,pageId})=>({content:[{type:"text",text:renderSvg(design as unknown as DesignDocument,pageId)}]}));
 server.registerTool("set_text",{title:"Set text",description:"Replace the text of one DesignIR text element by id.",inputSchema:{design:designSchema,elementId:z.string(),text:z.string()}},async({design,elementId,text})=>textResult(setText(design as unknown as DesignDocument,elementId,text)));
 server.registerTool("resize_page",{title:"Resize page",description:"Resize one DesignIR page. scale scales content; canvas changes only canvas size.",inputSchema:{design:designSchema,pageId:z.string(),width:z.number().positive(),height:z.number().positive(),mode:z.enum(["scale","canvas"]).default("scale")}},async({design,pageId,width,height,mode})=>textResult(resizePage(design as unknown as DesignDocument,pageId,width,height,mode)));
 return server;
}

void serveStdio(createServer);
console.error("Roundtrip MCP v0.2 running on stdio");
