// Flat 2D cartoon cast & text-free 2D FX cards for "The Man Who Sold the Eiffel Tower" (Paris, 1925).
// Exact cartoon-3d-short character grammar: superellipse bean heads (h/w 0.94), dark plum #241726 variable-width
// outlines, stick limbs with dot hands, deadpan expressive eyes, NO blush, NO eye catchlights, ZERO readable text.
// Design space: 600 x 1000, soles grounded at y = 975.
export const INK = "#241726";
export const SKIN = "#ffe2c2";
const WHITE = "#ffffff";
const MOUTH = "#5a1e28";
const TONGUE = "#e86e78";
type C3 = [number, number, number];
const SH_SKIN: C3 = [0.95, 0.85, 0.82];
const SH_CLOTH: C3 = [0.66, 0.68, 0.76];
const SH_FELT: C3 = [0.64, 0.64, 0.72];

export type Build = "adult" | "stout" | "slim";
export type HatStyle =
  | "none"
  | "homburg"
  | "bowler"
  | "tophat"
  | "kepi"
  | "cloche"
  | "cap"
  | "fedora";

export type Outfit = {
  jacket: string;
  pants: string;
  boots: string;
  skin?: string;
  hair?: string | null;
  hat?: HatStyle;
  hatCol?: string;
  hatBand?: string;
  collar?: string;
  tie?: string;
  moustache?: string;
  glasses?: boolean;
  brassButtons?: boolean;
  sash?: string;
  stripes?: boolean;
  dress?: boolean;
  pearls?: boolean;
  trench?: boolean;
  overalls?: boolean;
  build?: Build;
};

export type FaceExpr =
  | "neutral"
  | "smirk"
  | "wink"
  | "grin"
  | "starry"
  | "shock"
  | "skeptic"
  | "suspicious"
  | "whisper"
  | "ashamed"
  | "sweat"
  | "stern"
  | "despair"
  | "blink";

export type PoseKind =
  | "idle"
  | "walk"
  | "present"
  | "tip_hat"
  | "pockets"
  | "paint_drop"
  | "read_paper"
  | "stamp"
  | "point_up"
  | "arms_cross"
  | "whisper_lean"
  | "cash_give"
  | "cash_take"
  | "wave"
  | "hold_scroll"
  | "shoo"
  | "cover_face"
  | "flash_coat"
  | "hide_back"
  | "whistle"
  | "run"
  | "hands_up";

export type CharSpec = {
  outfit: Outfit;
  face: FaceExpr;
  pose: PoseKind;
  phase?: number;
  dir?: 1 | -1;
  prop?: "none" | "briefcase" | "cane" | "brush" | "paper" | "scroll" | "satchel" | "whistle" | "watch" | "medal";
};

// ---------------- 1925 Paris & Vienna Cast Outfits ----------------
export const LUSTIG: Outfit = {
  jacket: "#323c54", pants: "#2b3347", boots: "#231c1e", skin: "#fae0c4",
  hair: "#2e2422", hat: "homburg", hatCol: "#2e3548", hatBand: "#9e2a34",
  collar: "#ffffff", tie: "#a82a34", moustache: "#3a2c28", build: "slim",
};
export const LUSTIG_NOHAT: Outfit = { ...LUSTIG, hat: "none" };
export const LUSTIG_PRISON: Outfit = {
  jacket: "#e4e0d8", pants: "#565a66", boots: "#262224", skin: "#fae0c4",
  hair: "#2e2422", hat: "none", stripes: true, moustache: "#3a2c28", build: "slim",
};
export const DAN: Outfit = {
  jacket: "#6b5440", pants: "#574434", boots: "#2a1e18", skin: "#f4cfa8",
  hair: "#4a3626", hat: "bowler", hatCol: "#342a26", collar: "#f8f4ea", tie: "#2f6b4e", build: "adult",
};
export const POISSON: Outfit = {
  jacket: "#667054", pants: "#505942", boots: "#2d221c", skin: "#f5cfb0",
  hair: "#544032", hat: "bowler", hatCol: "#2d2a2e", collar: "#ffffff", tie: "#9a5428",
  moustache: "#5a4232", glasses: true, brassButtons: true, build: "stout",
};
export const MME_POISSON: Outfit = {
  jacket: "#3f7488", pants: "#356274", boots: "#2c2228", skin: "#fde2c8",
  hair: "#4c3226", hat: "cloche", hatCol: "#962e3c", hatBand: "#e2c272",
  dress: true, pearls: true, build: "slim",
};
export const PAINTER: Outfit = {
  jacket: "#d8d4c8", pants: "#3f6590", boots: "#3d2c20", skin: "#f0c6a2",
  hair: "#543c2c", hat: "cap", hatCol: "#4e5c72", overalls: true, moustache: "#5a3e2c", build: "adult",
};
export const MINISTER_REAL: Outfit = {
  jacket: "#424858", pants: "#383d4a", boots: "#221e22", skin: "#f3cfb2",
  hair: "#7a7678", hat: "tophat", hatCol: "#262832", hatBand: "#a82e36",
  collar: "#ffffff", tie: "#323846", sash: "#b82e34", moustache: "#7a7678", glasses: true, build: "stout",
};
export const GENDARME: Outfit = {
  jacket: "#293d64", pants: "#243456", boots: "#1e1c22", skin: "#f2caa8",
  hair: "#362820", hat: "kepi", hatCol: "#263a62", hatBand: "#c43034",
  brassButtons: true, moustache: "#3a2a22", build: "adult",
};
export const HUSTLER: Outfit = {
  jacket: "#7d6d56", pants: "#46423e", boots: "#282220", skin: "#e8be9c",
  hair: "#2e2420", hat: "fedora", hatCol: "#4a423c", hatBand: "#2a2422",
  trench: true, build: "slim",
};
export const BUYER: Outfit = {
  jacket: "#ba6a42", pants: "#485668", boots: "#34261e", skin: "#f8d8b8",
  hair: "#5a3e28", hat: "cap", hatCol: "#6e5a46", collar: "#f5eee0", build: "adult",
};
export const AGENT: Outfit = {
  jacket: "#4c5666", pants: "#3c4452", boots: "#201e22", skin: "#f2cca8",
  hair: "#382c24", hat: "fedora", hatCol: "#3a4250", hatBand: "#1e222a",
  collar: "#ffffff", tie: "#263042", build: "adult",
};

export const dealer = (v = 0): Outfit => {
  const coats = ["#6e5c4c", "#4b5a68", "#7d5442", "#596452", "#625468"];
  const hats: HatStyle[] = ["bowler", "homburg", "bowler", "cap", "homburg"];
  return {
    jacket: coats[v % 5],
    pants: v % 2 ? "#3e3a38" : "#444852",
    boots: "#28201c",
    skin: ["#f5d2b2", "#ecc29c", "#fae0c4", "#e4b690", "#f2cca8"][v % 5],
    hair: "#4a382c",
    hat: hats[v % 5],
    hatCol: v % 2 ? "#322e34" : "#4a3e36",
    collar: "#f8f4ea",
    tie: ["#8a3234", "#365678", "#5a6e42", "#9a6c30", "#683c5c"][v % 5],
    moustache: v % 2 === 0 ? "#4c382c" : undefined,
    glasses: v === 2,
    build: v % 3 === 0 ? "stout" : "adult",
  };
};

// ---------------- Pen & Geometry Helpers ----------------
type P2 = [number, number];
const rad = (d: number) => (d * Math.PI) / 180;
const mul = (c: string, m: C3) => {
  const n = parseInt(c.slice(1), 16);
  const ch = (v: number, k: number) => Math.min(255, Math.round(v * k)).toString(16).padStart(2, "0");
  return `#${ch((n >> 16) & 255, m[0])}${ch((n >> 8) & 255, m[1])}${ch(n & 255, m[2])}`;
};

class Pen {
  g: CanvasRenderingContext2D;
  ol = 12;
  rot: number[] | null = null;
  constructor(g: CanvasRenderingContext2D) { this.g = g; }
  P(x: number, y: number): P2 {
    if (!this.rot) return [x, y];
    const [a, cx, cy, dx = 0, dy = 0] = this.rot;
    const c = Math.cos(a), s = Math.sin(a);
    return [cx + (x - cx) * c - (y - cy) * s + dx, cy + (x - cx) * s + (y - cy) * c + dy];
  }
  path(pts: P2[], close: boolean) {
    const g = this.g;
    g.beginPath();
    pts.forEach((p, i) => { const [x, y] = this.P(p[0], p[1]); if (i) g.lineTo(x, y); else g.moveTo(x, y); });
    if (close) g.closePath();
  }
  poly(pts: P2[], fill: string | null, ol?: number) {
    const g = this.g, w = ol ?? this.ol;
    this.path(pts, true);
    if (fill) { g.fillStyle = fill; g.fill(); }
    if (w) { g.lineWidth = w; g.strokeStyle = INK; g.lineJoin = "round"; g.stroke(); }
  }
  ell(cx: number, cy: number, rx: number, ry: number, fill: string | null, ol?: number, a0 = 0, a1 = 360, rot = 0) {
    this.poly(ellPts(cx, cy, rx, ry, a0, a1, rot), fill, ol);
  }
  stroke(pts: P2[], w: number, fill = INK) {
    const g = this.g;
    g.lineCap = "round"; g.lineJoin = "round";
    this.path(pts, false); g.strokeStyle = fill; g.lineWidth = w; g.stroke();
  }
  arc(cx: number, cy: number, rx: number, ry: number, a0: number, a1: number, w: number, fill = INK) {
    const pts: P2[] = [];
    for (let i = 0; i <= 20; i++) pts.push([cx + rx * Math.cos(rad(a0 + ((a1 - a0) * i) / 20)), cy + ry * Math.sin(rad(a0 + ((a1 - a0) * i) / 20))]);
    this.stroke(pts, w, fill);
  }
  dot(cx: number, cy: number, r: number, fill = INK) {
    const [x, y] = this.P(cx, cy);
    this.g.beginPath(); this.g.arc(x, y, r, 0, Math.PI * 2); this.g.fillStyle = fill; this.g.fill();
  }
  shadedFill(pts: P2[], base: string, shadow: string, light: number, R: number) {
    const g = this.g, n = pts.length;
    let cx = 0, cy = 0;
    for (const [x, y] of pts) { cx += x / n; cy += y / n; }
    const [gx, gy] = this.P(cx + Math.cos(light) * 0.45 * R, cy + Math.sin(light) * 0.45 * R);
    const gr = g.createRadialGradient(gx, gy, 0, gx, gy, 1.25 * R);
    gr.addColorStop(0, base); gr.addColorStop(0.84, base); gr.addColorStop(1, shadow);
    this.path(pts, true); g.fillStyle = gr; g.fill();
  }
  gradFill(pts: P2[], base: string, shadow: string, light: number) {
    const g = this.g, dx = Math.cos(light), dy = Math.sin(light), n = pts.length;
    let cx = 0, cy = 0, lo = Infinity, hi = -Infinity;
    for (const [x, y] of pts) { cx += x / n; cy += y / n; const d = x * dx + y * dy; lo = Math.min(lo, d); hi = Math.max(hi, d); }
    const dc = cx * dx + cy * dy;
    const [ax, ay] = this.P(cx + dx * (hi - dc), cy + dy * (hi - dc));
    const [bx, by] = this.P(cx + dx * (lo - dc), cy + dy * (lo - dc));
    const gr = g.createLinearGradient(ax, ay, bx, by);
    gr.addColorStop(0, base); gr.addColorStop(0.25, base); gr.addColorStop(1, shadow);
    this.path(pts, true); g.fillStyle = gr; g.fill();
  }
  inkRing(pts: P2[], w0: number, thick: number, k = 0.42, col = INK) {
    const n = pts.length;
    let cx = 0, cy = 0;
    for (const [x, y] of pts) { cx += x / n; cy += y / n; }
    const out: P2[] = [], inn: P2[] = [];
    pts.forEach((q, i) => {
      const a = pts[(i + n - 1) % n], b = pts[(i + 1) % n];
      let nx = b[1] - a[1], ny = a[0] - b[0];
      const l = Math.hypot(nx, ny) || 1; nx /= l; ny /= l;
      const h = 0.5 * w0 * (1 + k * Math.cos(Math.atan2(q[1] - cy, q[0] - cx) - thick));
      out.push([q[0] + nx * h, q[1] + ny * h]); inn.push([q[0] - nx * h, q[1] - ny * h]);
    });
    const g = this.g;
    const trace = (r: P2[]) => { r.forEach(([x0, y0], i) => { const [x, y] = this.P(x0, y0); if (i) g.lineTo(x, y); else g.moveTo(x, y); }); g.closePath(); };
    g.beginPath(); trace(out); trace(inn.reverse());
    g.fillStyle = col; g.fill("evenodd");
  }
  clip(pts: P2[], fn: () => void) {
    const g = this.g; g.save(); this.path(pts, true); g.clip(); fn(); g.restore();
  }
}

const ellPts = (cx: number, cy: number, rx: number, ry: number, a0 = 0, a1 = 360, rot = 0, n = 40): P2[] => {
  const r = rad(rot), pts: P2[] = [];
  const full = Math.abs((a1 - a0) - 360) < 0.01;
  const end = full ? n - 1 : n;
  for (let i = 0; i <= end; i++) {
    const a = rad(a0 + ((a1 - a0) * i) / n), x = rx * Math.cos(a), y = ry * Math.sin(a);
    pts.push([cx + x * Math.cos(r) - y * Math.sin(r), cy + x * Math.sin(r) + y * Math.cos(r)]);
  }
  return pts;
};

/** Bean head superellipse (h/w ~0.94, slightly narrower chin, fuller crown) */
const beanHead = (cx: number, cy: number, rw: number, rh: number): P2[] => {
  const pts: P2[] = [];
  for (let i = 0; i < 64; i++) {
    const a = (i / 64) * Math.PI * 2;
    const ca = Math.cos(a), sa = Math.sin(a);
    const sgnC = Math.sign(ca), sgnS = Math.sign(sa);
    const taper = sa > 0 ? 1 - 0.08 * sa : 1 + 0.03 * (-sa);
    const x = cx + sgnC * Math.pow(Math.abs(ca), 0.90) * rw * taper;
    const y = cy + sgnS * Math.pow(Math.abs(sa), 0.93) * rh;
    pts.push([x, y]);
  }
  return pts;
};

const rrect = (x0: number, y0: number, x1: number, y1: number, r: number, n = 6): P2[] => {
  const pts: P2[] = [];
  for (const [cx, cy, a] of [[x1 - r, y0 + r, -90], [x1 - r, y1 - r, 0], [x0 + r, y1 - r, 90], [x0 + r, y0 + r, 180]])
    for (let i = 0; i <= n; i++) pts.push([cx + r * Math.cos(rad(a + (90 * i) / n)), cy + r * Math.sin(rad(a + (90 * i) / n))]);
  return pts;
};

function drawHat(p: Pen, o: Outfit, hx: number, hy: number, rw: number, rh: number) {
  const style = o.hat || "none";
  if (style === "none") return;
  const col = o.hatCol || "#32343e";
  const band = o.hatBand || "#241d26";
  const sh = mul(col, SH_FELT);
  const topY = hy - rh * 0.72;

  if (style === "homburg" || style === "fedora") {
    const crown = rrect(hx - rw * 0.76, topY - 92, hx + rw * 0.76, topY + 12, 26);
    p.gradFill(crown, col, sh, -0.7);
    p.inkRing(crown, 11, 2.2);
    // Ribbon band
    p.poly([[hx - rw * 0.76, topY - 22], [hx + rw * 0.76, topY - 22], [hx + rw * 0.76, topY + 4], [hx - rw * 0.76, topY + 4]], band, 8);
    // Curved brim
    const brim = ellPts(hx, topY + 10, rw * 1.18, 22);
    p.gradFill(brim, col, sh, -0.6);
    p.inkRing(brim, 11, 2.1);
    if (style === "fedora") {
      p.stroke([[hx - 24, topY - 82], [hx, topY - 64], [hx + 24, topY - 82]], 8);
    }
  } else if (style === "bowler") {
    const dome = ellPts(hx, topY - 18, rw * 0.76, 78, 180, 360);
    p.shadedFill(dome, col, sh, -0.7, 90);
    p.inkRing(dome, 11, 2.2);
    p.poly([[hx - rw * 0.76, topY - 14], [hx + rw * 0.76, topY - 14], [hx + rw * 0.76, topY + 6], [hx - rw * 0.76, topY + 6]], band, 7);
    const brim = ellPts(hx, topY + 8, rw * 1.06, 20);
    p.gradFill(brim, col, sh, -0.6);
    p.inkRing(brim, 10, 2.1);
  } else if (style === "tophat") {
    const cylPts: P2[] = [[hx - rw * 0.74, topY - 135], [hx + rw * 0.74, topY - 135], [hx + rw * 0.64, topY + 8], [hx - rw * 0.64, topY + 8]];
    p.gradFill(cylPts, col, sh, -0.6);
    p.inkRing(cylPts, 11, 2.1);
    p.poly([[hx - rw * 0.66, topY - 22], [hx + rw * 0.66, topY - 22], [hx + rw * 0.65, topY + 4], [hx - rw * 0.65, topY + 4]], band, 7);
    const brim = ellPts(hx, topY + 10, rw * 1.14, 19);
    p.gradFill(brim, col, sh, -0.6);
    p.inkRing(brim, 11, 2.1);
  } else if (style === "kepi") {
    // Classic 1925 French gendarme kepi (cylindrical navy cap with red band & glossy black visor)
    const cap: P2[] = [[hx - rw * 0.74, topY - 76], [hx + rw * 0.74, topY - 70], [hx + rw * 0.68, topY + 10], [hx - rw * 0.68, topY + 10]];
    p.gradFill(cap, col, sh, -0.6);
    p.inkRing(cap, 11, 2.1);
    p.poly([[hx - rw * 0.69, topY - 16], [hx + rw * 0.69, topY - 16], [hx + rw * 0.68, topY + 8], [hx - rw * 0.68, topY + 8]], band, 7);
    // Gold badge dot on front
    p.ell(hx + 16, topY - 40, 14, 14, "#e6be4c", 6);
    // Visor
    p.poly([[hx - rw * 0.45, topY + 6], [hx + rw * 1.15, topY + 12], [hx + rw * 0.92, topY + 32], [hx - rw * 0.35, topY + 22]], "#1d1c22", 9);
  } else if (style === "cloche") {
    // 1925 bell-shaped ladies' cloche hat
    const bell = ellPts(hx, topY + 10, rw * 0.96, 86, 172, 368);
    p.shadedFill(bell, col, sh, -0.7, 100);
    p.inkRing(bell, 11, 2.1);
    p.poly([[hx - rw * 0.94, topY - 6], [hx + rw * 0.94, topY - 6], [hx + rw * 0.96, topY + 18], [hx - rw * 0.96, topY + 18]], band, 7);
    p.ell(hx - rw * 0.72, topY + 4, 24, 18, "#e6c470", 7);
  } else if (style === "cap") {
    const dome = ellPts(hx - 6, topY + 4, rw * 0.96, 52, 180, 360);
    p.shadedFill(dome, col, sh, -0.7, 90);
    p.inkRing(dome, 10, 2.1);
    p.poly([[hx + 12, topY - 2], [hx + rw * 1.18, topY + 12], [hx + rw * 0.96, topY + 26], [hx + 4, topY + 14]], mul(col, [0.75, 0.75, 0.8]), 9);
  }
}

function drawFace(p: Pen, o: Outfit, face: FaceExpr, hx: number, hy: number, rw: number) {
  const ex = rw * 0.27;
  const ey = hy - 8;
  const look = 10;

  // Eyes (deadpan cartoon ovals/dots, NO catchlights, NO blush!)
  const drawEye = (x: number, y: number, closed = false, wide = false, squint = false, star = false) => {
    if (closed) {
      p.arc(x, y + 4, 18, 12, 195, 345, 9);
      return;
    }
    if (star) {
      p.ell(x, y, 22, 24, WHITE, 8);
      // 4-point golden star pupil
      const st: P2[] = [];
      for (let i = 0; i < 8; i++) {
        const a = (i * Math.PI) / 4;
        const r = i % 2 === 0 ? 18 : 7;
        st.push([x + Math.cos(a) * r, y + Math.sin(a) * r]);
      }
      p.poly(st, "#f2b82e", 5);
      return;
    }
    const rx = wide ? 22 : 17;
    const ry = wide ? 26 : squint ? 11 : 20;
    p.ell(x, y, rx, ry, WHITE, 8);
    p.dot(x + (wide ? 3 : 4), y + (squint ? 1 : 2), wide ? 8 : 7.5, INK);
    if (squint) {
      p.stroke([[x - 22, y - 9], [x + 22, y - 6]], 9);
    }
  };

  if (face === "blink" || face === "ashamed") {
    drawEye(hx - ex + look, ey, true);
    drawEye(hx + ex + look, ey, true);
  } else if (face === "wink") {
    drawEye(hx - ex + look, ey, false, false, false);
    p.arc(hx + ex + look, ey + 2, 18, 12, 190, 350, 9);
  } else if (face === "starry") {
    drawEye(hx - ex + look, ey, false, false, false, true);
    drawEye(hx + ex + look, ey, false, false, false, true);
  } else if (face === "shock" || face === "sweat") {
    drawEye(hx - ex + look, ey, false, true);
    drawEye(hx + ex + look, ey, false, true);
  } else if (face === "skeptic" || face === "suspicious" || face === "whisper" || face === "stern") {
    drawEye(hx - ex + look, ey, false, false, true);
    drawEye(hx + ex + look, ey, false, false, face !== "skeptic");
  } else {
    drawEye(hx - ex + look, ey);
    drawEye(hx + ex + look, ey);
  }

  // Eyebrows
  const by = ey - 32;
  if (face === "suspicious" || face === "stern") {
    p.stroke([[hx - ex + look - 20, by - 4], [hx - ex + look + 18, by + 10]], 9);
    p.stroke([[hx + ex + look - 18, by + 10], [hx + ex + look + 20, by - 4]], 9);
  } else if (face === "skeptic") {
    p.stroke([[hx - ex + look - 18, by + 8], [hx - ex + look + 18, by + 4]], 9);
    p.arc(hx + ex + look, by + 4, 20, 14, 200, 340, 9);
  } else if (face === "shock" || face === "despair" || face === "sweat") {
    p.arc(hx - ex + look, by - 6, 18, 12, 200, 340, 8);
    p.arc(hx + ex + look, by - 6, 18, 12, 200, 340, 8);
  } else if (face === "smirk" || face === "wink" || face === "whisper") {
    p.arc(hx - ex + look, by + 4, 18, 10, 200, 340, 8);
    p.stroke([[hx + ex + look - 16, by + 6], [hx + ex + look + 18, by - 4]], 8);
  }

  // Round spectacles if outfit has glasses
  if (o.glasses) {
    p.ell(hx - ex + look, ey, 26, 26, null, 6);
    p.ell(hx + ex + look, ey, 26, 26, null, 6);
    p.stroke([[hx - ex + look + 26, ey], [hx + ex + look - 26, ey]], 6);
  }

  // Sweat drop for nervous moments
  if (face === "sweat" || face === "ashamed") {
    const sx = hx - rw * 0.72, sy = hy - 34;
    p.poly([[sx, sy - 22], [sx + 13, sy + 6], [sx, sy + 18], [sx - 13, sy + 6]], "#7ec8f2", 6);
  }

  // Mouth
  const my = hy + 46;
  const mx = hx + look;
  if (face === "grin" || face === "starry") {
    const mPts = ellPts(mx, my - 4, 34, 26, 0, 180);
    p.poly(mPts, MOUTH, 8);
    p.ell(mx, my + 12, 18, 9, TONGUE, 0);
    p.poly([[mx - 30, my - 4], [mx + 30, my - 4], [mx + 26, my + 6], [mx - 26, my + 6]], WHITE, 4);
  } else if (face === "smirk" || face === "wink" || face === "whisper") {
    p.arc(mx + 6, my - 10, 30, 18, 18, 150, 9);
  } else if (face === "shock") {
    p.ell(mx, my + 4, 22, 30, MOUTH, 8);
    p.ell(mx, my + 20, 12, 8, TONGUE, 0);
  } else if (face === "despair" || face === "ashamed" || face === "sweat") {
    p.arc(mx, my + 22, 26, 18, 200, 340, 9);
  } else if (face === "suspicious" || face === "skeptic" || face === "stern") {
    p.stroke([[mx - 24, my + 4], [mx + 24, my - 2]], 9);
  } else {
    p.arc(mx, my - 4, 22, 12, 20, 160, 8);
  }

  // Dapper 1925 moustache
  if (o.moustache) {
    const mc = o.moustache;
    p.poly([[mx, my - 14], [mx - 36, my - 2], [mx - 44, my - 14], [mx - 20, my - 22]], mc, 6);
    p.poly([[mx, my - 14], [mx + 36, my - 2], [mx + 44, my - 14], [mx + 20, my - 22]], mc, 6);
  }
}

/** Draw a complete 600x1000 character card onto a 2D canvas context */
export function drawCharacter(g: CanvasRenderingContext2D, spec: CharSpec) {
  g.clearRect(0, 0, 600, 1000);
  g.save();
  if (spec.dir === -1) {
    g.translate(600, 0);
    g.scale(-1, 1);
  }
  const p = new Pen(g);
  const o = spec.outfit;
  const ph = spec.phase ?? 0;
  const pose = spec.pose;

  const isStout = o.build === "stout";
  const isSlim = o.build === "slim";
  const bodyW = isStout ? 104 : isSlim ? 78 : 88;
  const skin = o.skin || SKIN;

  const walkSwing = pose === "walk" ? Math.sin(ph) * 52 : pose === "run" ? Math.sin(ph) * 86 : 0;
  const bob = pose === "walk" ? Math.abs(Math.sin(ph)) * -18 : pose === "run" ? Math.abs(Math.sin(ph)) * -32 : Math.sin(ph * 0.5) * -5;
  const lean = pose === "run" ? 0.14 : pose === "whisper_lean" ? 0.12 : spec.face === "ashamed" || pose === "cover_face" ? -0.06 : 0;

  const hipY = 720 + bob;
  const shY = 468 + bob;
  const hx = 300 + lean * 90;
  const hy = 312 + bob;
  const rw = 116;
  const rh = 109;

  // --- Legs (stick limbs + rounded boots grounded at y = 975) ---
  const drawLeg = (hipX: number, swing: number, lift: number) => {
    const footX = hipX + swing;
    const footY = 960 - lift;
    const kneeX = (hipX + footX) * 0.5 + (pose === "run" ? 26 : 10);
    const kneeY = (hipY + footY) * 0.5;
    p.stroke([[hipX, hipY], [kneeX, kneeY], [footX, footY]], 24, INK);
    p.stroke([[hipX, hipY], [kneeX, kneeY], [footX, footY]], 12, o.pants);
    p.ell(footX + 16, footY + 6, 30, 15, o.boots, 9);
  };
  const liftA = pose === "walk" || pose === "run" ? Math.max(0, Math.sin(ph)) * (pose === "run" ? 44 : 20) : 0;
  const liftB = pose === "walk" || pose === "run" ? Math.max(0, -Math.sin(ph)) * (pose === "run" ? 44 : 20) : 0;
  drawLeg(268, -walkSwing, liftB);
  drawLeg(332, walkSwing, liftA);

  // --- Back arm ---
  const drawArm = (sx: number, sy: number, ex: number, ey: number, hx2: number, hy2: number) => {
    p.stroke([[sx, sy], [ex, ey], [hx2, hy2]], 21, INK);
    p.stroke([[sx, sy], [ex, ey], [hx2, hy2]], 10, o.jacket);
    p.dot(hx2, hy2, 16, INK);
    p.dot(hx2, hy2, 9, skin);
  };

  if (pose === "present" || pose === "point_up") {
    drawArm(300 + bodyW * 0.72, shY + 26, 448, shY - 30, 495, shY - 120);
  } else if (pose === "wave" || pose === "hands_up") {
    drawArm(300 + bodyW * 0.72, shY + 26, 455, shY - 22, 488, shY - 135 + Math.sin(ph * 2) * 18);
  } else if (pose === "shoo") {
    drawArm(300 + bodyW * 0.72, shY + 26, 445, shY + 20, 505, shY - 20 + Math.sin(ph * 3) * 28);
  } else if (pose === "cash_give" || pose === "cash_take" || pose === "hold_scroll") {
    drawArm(300 + bodyW * 0.72, shY + 26, 420, shY + 70, 480, shY + 45);
  } else if (pose === "flash_coat") {
    drawArm(300 + bodyW * 0.72, shY + 26, 460, shY + 60, 495, shY + 25);
  } else if (pose === "hide_back") {
    drawArm(300 + bodyW * 0.72, shY + 26, 360, shY + 125, 315, shY + 150);
  } else {
    drawArm(300 + bodyW * 0.72, shY + 26, 300 + bodyW + 24, shY + 108, 300 + bodyW + 14 - walkSwing * 0.6, shY + 190);
  }

  // --- Torso (tailored coat / dress / overalls / prison stripes) ---
  const torsoPts = o.dress
    ? ([[300 - bodyW * 0.8, shY], [300 + bodyW * 0.8, shY], [300 + bodyW * 1.25, hipY + 75], [300 - bodyW * 1.25, hipY + 75]] as P2[])
    : o.trench
    ? ([[300 - bodyW * 0.9, shY], [300 + bodyW * 0.9, shY], [300 + bodyW * 1.22, hipY + 90], [300 - bodyW * 1.22, hipY + 90]] as P2[])
    : rrect(300 - bodyW, shY, 300 + bodyW, hipY + 24, 34);

  p.gradFill(torsoPts, o.jacket, mul(o.jacket, SH_CLOTH), -0.6);

  // Prison horizontal stripes
  if (o.stripes) {
    p.clip(torsoPts, () => {
      for (let sy = shY + 18; sy < hipY + 20; sy += 38) {
        p.poly([[180, sy], [420, sy], [420, sy + 18], [180, sy + 18]], "#2a2d36", 0);
      }
    });
  }
  // Painter's overalls bib & straps
  if (o.overalls) {
    p.clip(torsoPts, () => {
      p.poly([[300 - bodyW * 0.75, shY + 65], [300 + bodyW * 0.75, shY + 65], [300 + bodyW, hipY + 30], [300 - bodyW, hipY + 30]], o.pants, 6);
      p.poly([[300 - 46, shY], [300 - 24, shY], [300 - 24, shY + 70], [300 - 46, shY + 70]], o.pants, 6);
      p.poly([[300 + 24, shY], [300 + 46, shY], [300 + 46, shY + 70], [300 + 24, shY + 70]], o.pants, 6);
    });
  }
  // Collar & tie / pearls / ministerial sash
  if (o.collar) {
    p.poly([[272, shY - 2], [328, shY - 2], [300, shY + 72]], o.collar, 7);
    if (o.tie) {
      p.poly([[292, shY + 16], [308, shY + 16], [314, shY + 116], [300, shY + 136], [286, shY + 116]], o.tie, 6);
    }
  }
  if (o.pearls) {
    for (let i = -3; i <= 3; i++) {
      p.ell(300 + i * 16, shY + 26 - Math.abs(i) * 4, 8, 8, "#faf4e6", 4);
    }
  }
  if (o.sash) {
    p.clip(torsoPts, () => {
      p.poly([[300 - bodyW, shY + 20], [300 - bodyW + 38, shY], [300 + bodyW, hipY - 12], [300 + bodyW - 38, hipY + 16]], o.sash!, 6);
    });
  }
  if (o.brassButtons) {
    for (let i = 0; i < 3; i++) {
      p.ell(300 + 18, shY + 74 + i * 44, 9, 9, "#e6be4c", 5);
    }
  }
  p.inkRing(torsoPts, 12, 2.2);

  // --- Front arm & held props ---
  let handX = 300 - bodyW - 14 + walkSwing * 0.6;
  let handY = shY + 190;
  if (pose === "tip_hat") {
    drawArm(300 - bodyW * 0.72, shY + 26, 175, shY - 28, 224, hy - rh * 0.85);
    handX = 224; handY = hy - rh * 0.85;
  } else if (pose === "pockets") {
    drawArm(300 - bodyW * 0.72, shY + 26, 165, shY + 95, 195, shY + 145);
    // White empty turned-out pockets!
    p.ell(210, hipY - 10, 26, 34, "#f4eee0", 8, 0, 360, 22);
    p.ell(390, hipY - 10, 26, 34, "#f4eee0", 8, 0, 360, -22);
  } else if (pose === "read_paper") {
    drawArm(300 - bodyW * 0.72, shY + 26, 200, shY + 80, 265, shY + 40);
    handX = 265; handY = shY + 40;
  } else if (pose === "arms_cross") {
    p.stroke([[300 - bodyW * 0.7, shY + 35], [260, shY + 110], [355, shY + 102]], 22, INK);
    p.stroke([[300 - bodyW * 0.7, shY + 35], [260, shY + 110], [355, shY + 102]], 11, o.jacket);
    p.stroke([[300 + bodyW * 0.7, shY + 35], [340, shY + 115], [248, shY + 98]], 22, INK);
    p.stroke([[300 + bodyW * 0.7, shY + 35], [340, shY + 115], [248, shY + 98]], 11, o.jacket);
  } else if (pose === "whisper_lean") {
    drawArm(300 - bodyW * 0.72, shY + 26, 230, shY + 45, 315, hy + 42);
  } else if (pose === "stamp") {
    drawArm(300 - bodyW * 0.72, shY + 26, 210, shY + 55, 290, shY + 130);
  } else if (pose === "cover_face") {
    drawArm(300 - bodyW * 0.72, shY + 26, 210, hy + 55, 262, hy + 6);
    drawArm(300 + bodyW * 0.72, shY + 26, 390, hy + 55, 346, hy + 6);
  } else if (pose === "whistle") {
    drawArm(300 - bodyW * 0.72, shY + 26, 220, hy + 60, 326, hy + 46);
  } else if (pose === "hands_up") {
    drawArm(300 - bodyW * 0.72, shY + 26, 155, shY - 22, 128, shY - 130);
  } else if (pose === "hide_back") {
    drawArm(300 - bodyW * 0.72, shY + 26, 240, shY + 125, 285, shY + 150);
  } else if (pose === "paint_drop") {
    drawArm(300 - bodyW * 0.72, shY + 26, 180, shY + 75, 160, shY + 155);
    handX = 160; handY = shY + 155;
  } else {
    drawArm(300 - bodyW * 0.72, shY + 26, 300 - bodyW - 22, shY + 108, handX, handY);
  }

  // --- Held character props (ZERO text!) ---
  const prop = spec.prop || "none";
  if (prop === "briefcase") {
    p.poly(rrect(handX - 58, handY + 4, handX + 58, handY + 92, 12), "#5e3820", 9);
    p.poly([[handX - 18, handY - 12], [handX + 18, handY - 12], [handX + 18, handY + 6], [handX - 18, handY + 6]], null, 7);
    p.ell(handX, handY + 42, 10, 10, "#e2b84a", 5);
  } else if (prop === "satchel") {
    const sx = 468, sy = shY + 52;
    p.poly(rrect(sx - 56, sy - 38, sx + 56, sy + 52, 14), "#6e3e22", 9);
    // Green franc bills poking out the top!
    p.poly([[sx - 34, sy - 64], [sx + 8, sy - 68], [sx + 14, sy - 32], [sx - 28, sy - 30]], "#6cb86a", 6);
    p.poly([[sx - 6, sy - 70], [sx + 38, sy - 62], [sx + 32, sy - 28], [sx - 10, sy - 32]], "#7cc978", 6);
    p.ell(sx, sy + 4, 12, 12, "#e8be4a", 5);
  } else if (prop === "scroll") {
    const sx = 478, sy = shY + 28;
    p.poly([[sx - 44, sy - 22], [sx + 48, sy - 42], [sx + 58, sy + 8], [sx - 34, sy + 28]], "#f8f0dc", 8);
    p.ell(sx + 8, sy - 6, 17, 17, "#c6282c", 6);
  } else if (prop === "paper") {
    // Open newspaper with Eiffel Tower silhouette graphic + wavy lines (ZERO text!)
    p.poly([[230, shY - 45], [385, shY - 58], [412, shY + 86], [248, shY + 98]], "#f4eedc", 9);
    p.stroke([[320, shY - 30], [302, shY + 58]], 7, "#3a3236");
    p.stroke([[320, shY - 30], [338, shY + 58]], 7, "#3a3236");
    p.stroke([[302, shY + 18], [338, shY + 18]], 6, "#3a3236");
    for (let ly = shY - 18; ly <= shY + 62; ly += 22) {
      p.stroke([[258, ly], [292, ly - 3]], 5, "#686266");
      p.stroke([[348, ly - 4], [384, ly - 7]], 5, "#686266");
    }
  } else if (prop === "brush") {
    p.poly([[handX - 10, handY - 12], [handX + 12, handY - 12], [handX + 18, handY + 58], [handX - 16, handY + 58]], "#b87a46", 7);
    p.poly([[handX - 24, handY + 56], [handX + 26, handY + 56], [handX + 30, handY + 98], [handX - 28, handY + 98]], "#c96832", 7);
  } else if (prop === "whistle") {
    p.ell(354, hy + 46, 18, 12, "#e4ba48", 6);
    p.poly([[324, hy + 40], [346, hy + 40], [346, hy + 52], [324, hy + 52]], "#d6a83a", 5);
  } else if (prop === "watch") {
    const wx = 492, wy = shY + 40;
    p.stroke([[wx, wy - 44], [wx, wy - 20]], 6, "#e0b442");
    p.ell(wx, wy, 24, 24, "#f0c850", 7);
    p.ell(wx, wy, 17, 17, "#fffaf0", 4);
    p.stroke([[wx, wy], [wx, wy - 11]], 4, INK);
    p.stroke([[wx, wy], [wx + 9, wy + 3]], 4, INK);
  } else if (prop === "medal") {
    // Golden star award rosette (100% text-free!)
    const mx = 486, my = shY - 76;
    p.poly([[mx - 22, my + 24], [mx - 36, my + 82], [mx - 12, my + 66], [mx, my + 86], [mx + 12, my + 66], [mx + 36, my + 82], [mx + 22, my + 24]], "#b82c34", 7);
    p.ell(mx, my, 42, 42, "#f0c244", 8);
    p.ell(mx, my, 30, 30, "#fae07c", 4);
    const star: P2[] = [];
    for (let i = 0; i < 10; i++) {
      const a = -Math.PI / 2 + (i * Math.PI) / 5;
      const r = i % 2 === 0 ? 22 : 10;
      star.push([mx + Math.cos(a) * r, my + Math.sin(a) * r]);
    }
    p.poly(star, "#fff3a6", 5);
  }

  // --- Head ---
  const headPts = beanHead(hx, hy, rw, rh);
  p.shadedFill(headPts, skin, mul(skin, SH_SKIN), -0.65, rw * 1.1);
  // Hair cap if present
  if (o.hair) {
    p.clip(headPts, () => {
      p.ell(hx - 14, hy - rh * 0.72, rw * 1.05, rh * 0.56, o.hair!, 0);
      if (o.dress) {
        p.ell(hx - rw * 0.78, hy + 10, 34, 62, o.hair!, 0);
      }
    });
  }
  p.inkRing(headPts, 13, 2.2);

  // Face features (skip when hands cover face completely, or draw peeking eyes)
  drawFace(p, o, spec.face, hx, hy, rw);

  // Hat on top
  drawHat(p, o, hx, hy, rw, rh);

  g.restore();
}

// ---------------- Text-Free 2D Cartoon Effect Cards ----------------
export type FxKind =
  | "money_bag"
  | "banknotes"
  | "lightbulb"
  | "sparkle"
  | "rust_flakes"
  | "coin_glint"
  | "suspicion"
  | "wax_scroll"
  | "watch_broken"
  | "whistle_blast"
  | "steam_puff";

export function drawFx(g: CanvasRenderingContext2D, kind: FxKind, phase = 0) {
  g.clearRect(0, 0, 512, 512);
  const p = new Pen(g);

  if (kind === "money_bag") {
    // Plump sack overflowing with banknotes & gold coins (ZERO text / currency signs)
    const sack = ellPts(256, 300, 132, 138);
    p.shadedFill(sack, "#e0c080", "#b89454", -0.7, 150);
    p.ell(256, 300, 132, 138, null, 13);
    p.poly([[206, 152], [306, 152], [286, 198], [226, 198]], "#d4b06c", 11);
    p.poly([[212, 188], [300, 188], [300, 210], [212, 210]], "#b63434", 8);
    // Green banknotes fanning out the top
    for (const [ang, ox] of [[-24, -44], [0, 0], [26, 44]] as [number, number][]) {
      g.save();
      g.translate(256 + ox, 132);
      g.rotate(rad(ang));
      p.poly(rrect(-42, -32, 42, 32, 6), "#76c470", 8);
      p.ell(0, 0, 14, 14, "#b6e6a6", 4);
      g.restore();
    }
    // Gold coins scattered at base
    for (const [cx, cy] of [[156, 405], [358, 398], [292, 425]]) {
      p.ell(cx, cy, 26, 18, "#f2c646", 7);
    }
  } else if (kind === "banknotes") {
    for (let i = 0; i < 6; i++) {
      const a = (i / 6) * Math.PI * 2 + phase * 0.4;
      const x = 256 + Math.cos(a) * 125;
      const y = 256 + Math.sin(a) * 115;
      g.save();
      g.translate(x, y);
      g.rotate(a + 0.5);
      p.poly(rrect(-52, -28, 52, 28, 6), i % 2 ? "#74c26e" : "#8cd482", 8);
      p.ell(0, 0, 15, 15, "#c6efb8", 4);
      g.restore();
    }
  } else if (kind === "lightbulb") {
    // Golden radiating idea bulb
    for (let i = 0; i < 8; i++) {
      const a = (i / 8) * Math.PI * 2 + phase * 0.2;
      p.stroke([[256 + Math.cos(a) * 128, 224 + Math.sin(a) * 128], [256 + Math.cos(a) * 188, 224 + Math.sin(a) * 188]], 12, "#ffd954");
    }
    const bulb = ellPts(256, 224, 96, 104);
    p.shadedFill(bulb, "#fff078", "#f0b628", -0.6, 110);
    p.inkRing(bulb, 12, 2.2);
    p.poly(rrect(214, 320, 298, 384, 12), "#8c96a4", 10);
    p.stroke([[222, 344], [290, 344]], 7);
    p.stroke([[222, 366], [290, 366]], 7);
    p.stroke([[228, 250], [256, 200], [284, 250]], 8, "#c46818");
  } else if (kind === "sparkle") {
    const pts: P2[] = [];
    for (let i = 0; i < 8; i++) {
      const a = (i * Math.PI) / 4 + phase * 0.15;
      const r = i % 2 === 0 ? 180 : 46;
      pts.push([256 + Math.cos(a) * r, 256 + Math.sin(a) * r]);
    }
    p.poly(pts, "#ffe464", 11);
    p.ell(256, 256, 36, 36, "#fffbe0", 0);
  } else if (kind === "rust_flakes") {
    const seeds = [[140, 140, 28], [320, 170, 22], [220, 270, 34], [360, 310, 26], [160, 355, 24], [270, 395, 20]];
    for (const [x, y, r] of seeds) {
      const dy = ((phase * 48) % 120) - 40;
      p.poly([[x - r, y + dy], [x + r * 0.4, y - r * 0.7 + dy], [x + r, y + r * 0.3 + dy], [x - r * 0.3, y + r * 0.8 + dy]], "#c25426", 8);
    }
  } else if (kind === "coin_glint") {
    p.ell(256, 256, 108, 108, "#f2c444", 12);
    p.ell(256, 256, 78, 78, "#ffe27a", 6);
    const star: P2[] = [];
    for (let i = 0; i < 8; i++) {
      const a = (i * Math.PI) / 4;
      const r = i % 2 === 0 ? 52 : 22;
      star.push([256 + Math.cos(a) * r, 256 + Math.sin(a) * r]);
    }
    p.poly(star, "#fff7c2", 7);
    p.ell(356, 146, 24, 24, "#fff8b8", 6);
  } else if (kind === "suspicion") {
    // Magnifying glass + purple wavy squiggle (100% text-free!)
    p.stroke([[295, 295], [405, 405]], 28, INK);
    p.stroke([[295, 295], [405, 405]], 16, "#7d4c2c");
    p.ell(220, 220, 108, 108, "#b8e0f6", 14);
    p.ell(220, 220, 82, 82, "#dff4ff", 0);
    p.stroke([[175, 190], [210, 168]], 10, WHITE);
  } else if (kind === "wax_scroll") {
    p.poly(rrect(92, 140, 420, 360, 24), "#f8f0dc", 12);
    for (const ly of [195, 242, 288]) {
      p.stroke([[144, ly], [368, ly]], 9, "#a49888");
    }
    // Glossy red wax seal + ribbons
    p.poly([[232, 344], [208, 434], [256, 404], [304, 434], [280, 344]], "#c82c32", 9);
    p.ell(256, 336, 48, 48, "#d43438", 10);
    p.ell(256, 336, 30, 30, "#ea5458", 5);
  } else if (kind === "watch_broken") {
    // Cracked gold pocket watch with flying clock hands, spring & gear!
    p.ell(256, 278, 118, 118, "#f0c244", 12);
    p.ell(256, 278, 92, 92, "#fff8ea", 7);
    // Crack zigzag across watch glass
    p.stroke([[210, 212], [248, 266], [228, 298], [296, 344]], 7, INK);
    // Popping coiled spring shooting out the top-right!
    const spr: P2[] = [];
    for (let i = 0; i <= 14; i++) {
      const u = i / 14;
      spr.push([280 + u * 120 + Math.sin(u * 18) * 18, 200 - u * 125 + Math.cos(u * 18) * 12]);
    }
    p.stroke(spr, 8, "#525866");
    // Flying clock hands & tiny brass gear
    p.stroke([[132, 148], [192, 182]], 10, INK);
    p.stroke([[356, 178], [418, 152]], 9, INK);
    p.ell(142, 218, 24, 24, "#d8a434", 7);
    p.ell(142, 218, 9, 9, "#ffffff", 4);
  } else if (kind === "whistle_blast") {
    for (let i = 0; i < 3; i++) {
      const r = 80 + i * 58 + ((phase * 28) % 34);
      p.arc(160, 256, r, r * 0.85, -52, 52, 14, i % 2 ? "#ffe86c" : WHITE);
    }
  } else if (kind === "steam_puff") {
    const puffs: [number, number, number][] = [[190, 290, 82], [272, 244, 96], [346, 294, 72], [250, 326, 76]];
    for (const [x, y, r] of puffs) p.ell(x, y, r, r * 0.88, "#f6f8fc", 0);
    p.arc(190, 290, 82, 72, 110, 290, 10, "#9aa6ba");
    p.arc(272, 244, 96, 84, 200, 355, 10, "#9aa6ba");
  }
}
