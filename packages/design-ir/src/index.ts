export const DESIGN_IR_VERSION = "0.2" as const;

export type Color = string;
export type ElementType = "text" | "shape" | "image" | "group";

export interface BaseElement {
  id: string;
  type: ElementType;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation?: number;
  opacity?: number;
  zIndex?: number;
  visible?: boolean;
  name?: string;
}

export interface TextStyle {
  fontFamily?: string;
  fontSize?: number;
  fontWeight?: number | string;
  fontStyle?: "normal" | "italic";
  color?: Color;
  align?: "left" | "center" | "right";
  lineHeight?: number;
  letterSpacing?: number;
}

export interface TextElement extends BaseElement {
  type: "text";
  text: string;
  style?: TextStyle;
}

export interface ShapeElement extends BaseElement {
  type: "shape";
  shape: "rect" | "ellipse" | "line";
  fill?: Color;
  stroke?: Color;
  strokeWidth?: number;
  borderRadius?: number;
}

export interface ImageElement extends BaseElement {
  type: "image";
  assetId: string;
  fit?: "cover" | "contain" | "fill";
}

export interface GroupElement extends BaseElement {
  type: "group";
  children: DesignElement[];
}

export type DesignElement = TextElement | ShapeElement | ImageElement | GroupElement;

export interface Asset {
  id: string;
  kind: "image" | "video" | "font" | "other";
  src: string;
  mimeType?: string;
  name?: string;
}

export interface DesignPage {
  id: string;
  width: number;
  height: number;
  background?: Color;
  name?: string;
  elements: DesignElement[];
}

export interface DesignDocument {
  schema: "roundtrip.design";
  version: typeof DESIGN_IR_VERSION | string;
  id: string;
  name?: string;
  metadata?: Record<string, unknown>;
  assets?: Asset[];
  pages: DesignPage[];
}
