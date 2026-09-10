import * as THREE from "three";

type LabelSpec = {
  kicker: string;
  title: string;
  scent: string;
  body: string;
  volume: string;
};

const wrap = (
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number,
) => {
  const words = text.split(" ");
  let line = "";
  let cursor = y;
  for (const word of words) {
    const test = line ? `${line} ${word}` : word;
    if (ctx.measureText(test).width > maxWidth && line) {
      ctx.fillText(line, x, cursor);
      line = word;
      cursor += lineHeight;
    } else {
      line = test;
    }
  }
  if (line) ctx.fillText(line, x, cursor);
  return cursor;
};

/**
 * Draws the Lecce 28 bottle label to a canvas so the 3D vessels carry real
 * product typography without shipping an external font or texture file.
 */
export function createLabelTexture(spec: LabelSpec): THREE.CanvasTexture {
  const w = 1024;
  const h = 512;
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d")!;

  ctx.fillStyle = "#e8e3d6";
  ctx.fillRect(0, 0, w, h);

  // The cylinder seam sits at the camera-facing centre, so the artwork is
  // drawn twice — once either side of u=0 — and reads as one panel head-on.
  const panelW = w * 0.3;
  for (const originX of [-w * 0.15, w * 0.85]) {
    drawPanel(ctx, spec, originX, panelW, h);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 4;
  return texture;
}

function drawPanel(
  ctx: CanvasRenderingContext2D,
  spec: LabelSpec,
  panelX: number,
  panelW: number,
  h: number,
) {
  // Black wordmark bar
  ctx.fillStyle = "#0b0b0b";
  ctx.fillRect(panelX, 44, panelW * 0.62, 56);
  ctx.fillStyle = "#e8e3d6";
  ctx.font = "300 23px 'Helvetica Neue', Arial, sans-serif";
  ctx.textBaseline = "middle";
  ctx.letterSpacing = "3px";
  ctx.fillText("LECCE", panelX + 16, 73);
  ctx.font = "600 30px 'Helvetica Neue', Arial, sans-serif";
  ctx.fillText("28", panelX + 96, 72);

  ctx.textBaseline = "alphabetic";
  ctx.letterSpacing = "2px";
  ctx.fillStyle = "#4a453f";
  ctx.font = "400 14px 'Courier New', monospace";
  let y = wrap(ctx, spec.kicker.toUpperCase(), panelX, 158, panelW, 20);

  ctx.fillStyle = "#0b0b0b";
  ctx.font = "400 27px 'Courier New', monospace";
  y = wrap(ctx, spec.title.toUpperCase(), panelX, y + 40, panelW, 32);

  ctx.fillStyle = "#4a453f";
  ctx.font = "400 14px 'Courier New', monospace";
  y = wrap(ctx, spec.scent.toUpperCase(), panelX, y + 34, panelW, 20);

  ctx.letterSpacing = "0px";
  ctx.fillStyle = "#5b554e";
  ctx.font = "400 12.5px 'Courier New', monospace";
  wrap(ctx, spec.body, panelX, y + 32, panelW, 19);

  ctx.fillStyle = "#0b0b0b";
  ctx.font = "400 13px 'Courier New', monospace";
  ctx.fillText(spec.volume, panelX, h - 42);
}
