// Hand-painted HD Canvas2D textures for "The Man Who Sold the Eiffel Tower" (Paris & Vienna, 1925).
// Storybook 3D toon style: muted warm limestone, ochre cobblestones, painted riveted Eiffel iron with rust patches,
// Hôtel de Crillon cream-and-gilt wall panels, herringbone parquet, ruby velvet, brick alley, café awnings, ZERO text.
import * as THREE from "three";

export const rng = (seed: number) => {
  let s = (seed * 9301 + 49297) % 233280 || 1;
  return () => { s = (s * 16807) % 2147483647; return (s - 1) / 2147483646; };
};

const cache = new Map<string, THREE.CanvasTexture>();
export const ctex = (key: string, w: number, h: number, draw: (g: CanvasRenderingContext2D, r: () => number) => void, repeat = true) => {
  let t = cache.get(key);
  if (!t) {
    const cv = document.createElement("canvas");
    cv.width = w; cv.height = h;
    let hseed = key.length * 131;
    for (let i = 0; i < key.length; i++) hseed = (hseed * 31 + key.charCodeAt(i)) % 233280;
    draw(cv.getContext("2d")!, rng(hseed));
    t = new THREE.CanvasTexture(cv);
    t.colorSpace = THREE.SRGBColorSpace;
    t.anisotropy = 1;
    t.wrapS = t.wrapT = repeat ? THREE.RepeatWrapping : THREE.ClampToEdgeWrapping;
    cache.set(key, t);
  }
  return t;
};

export const rep = (t: THREE.Texture, x: number, y: number) => {
  const c = t.clone(); c.repeat.set(x, y); c.needsUpdate = true; return c;
};

const pick = <T,>(r: () => number, a: T[]) => a[Math.floor(r() * a.length) % a.length];
const _jc = new THREE.Color(), _hsl = { h: 0, s: 0, l: 0 };

export const jit = (r: () => number, hex: string, dv = 0.08, dh = 4, ds = 0.12) => {
  _jc.set(hex).getHSL(_hsl);
  const k = (a: number) => 1 + (r() * 2 - 1) * a;
  _jc.setHSL((_hsl.h + ((r() * 2 - 1) * dh) / 360 + 1) % 1, Math.min(1, _hsl.s * k(ds)), Math.min(0.96, _hsl.l * k(dv)));
  return "#" + _jc.getHexString();
};

export const cloudHD = (variant: number, p: { lit: string; mid: string; shade: string }) =>
  ctex(`cloud_${variant}_${p.lit}_${p.shade}`, 512, 256, (g, r) => {
    const puffs: [number, number, number, number][] = [
      [150, 152, 82, 54], [248, 126, 98, 72], [352, 152, 80, 52],
      [204, 162, 74, 46], [304, 160, 74, 46], [254, 102 + (variant % 2) * 14, 68, 52],
    ];
    for (const [cx, cy, rx, ry] of puffs) {
      g.fillStyle = p.shade;
      g.beginPath(); g.ellipse(cx + (r() - 0.5) * 14, cy + 12, rx, ry * 0.92, 0, 0, Math.PI * 2); g.fill();
    }
    for (const [cx, cy, rx, ry] of puffs) {
      g.fillStyle = p.mid;
      g.beginPath(); g.ellipse(cx, cy + 3, rx * 0.96, ry * 0.92, 0, 0, Math.PI * 2); g.fill();
    }
    for (const [cx, cy, rx, ry] of puffs) {
      g.fillStyle = p.lit;
      g.beginPath(); g.ellipse(cx - 4, cy - 6, rx * 0.84, ry * 0.78, 0, 0, Math.PI * 2); g.fill();
    }
  }, false);

/** Parisian cobblestones — warm buff/grey pavers with dark mortar seams */
export const cobbleHD = (key = "cobbleHD", cols = ["#b9ae9c", "#a79d8e", "#c3b7a4", "#9e9588"]) =>
  ctex(key, 512, 512, (g, r) => {
    g.fillStyle = "#5a534c"; g.fillRect(0, 0, 512, 512);
    const rows = 16, rh = 512 / rows;
    for (let j = 0; j < rows; j++) {
      const off = (j % 2) * 24;
      const cw = 48;
      for (let x = -cw; x < 512 + cw; x += cw) {
        const px = x + off + (r() - 0.5) * 3;
        const py = j * rh + 2;
        g.fillStyle = jit(r, pick(r, cols), 0.08, 4, 0.1);
        g.beginPath();
        g.roundRect(px + 2, py, cw - 4, rh - 4, 5);
        g.fill();
        g.fillStyle = "rgba(255,248,232,0.16)";
        g.fillRect(px + 5, py + 2, cw - 12, 4);
      }
    }
  });

/** Champ de Mars manicured gravel promenade */
export const gravelHD = (key = "gravelHD") =>
  ctex(key, 512, 512, (g, r) => {
    g.fillStyle = "#d9cba8"; g.fillRect(0, 0, 512, 512);
    for (let i = 0; i < 90; i++) {
      g.fillStyle = r() < 0.5 ? "rgba(186,168,132,0.28)" : "rgba(245,236,214,0.28)";
      g.beginPath(); g.ellipse(r() * 512, r() * 512, 40 + r() * 70, 14 + r() * 26, r() * 3, 0, Math.PI * 2); g.fill();
    }
    for (let i = 0; i < 1200; i++) {
      g.fillStyle = pick(r, ["#bba985", "#e7dbb9", "#a89775", "#cdbda0"]);
      g.beginPath(); g.arc(r() * 512, r() * 512, 1.5 + r() * 2.4, 0, Math.PI * 2); g.fill();
    }
  });

/** Park lawn grass */
export const grassHD = (key = "grassHD", base = "#5e9e4c") =>
  ctex(key, 512, 512, (g, r) => {
    g.fillStyle = base; g.fillRect(0, 0, 512, 512);
    for (let i = 0; i < 70; i++) {
      g.fillStyle = r() < 0.5 ? "rgba(62,116,46,0.24)" : "rgba(128,186,86,0.20)";
      g.beginPath(); g.ellipse(r() * 512, r() * 512, 35 + r() * 65, 22 + r() * 44, r() * 3, 0, Math.PI * 2); g.fill();
    }
    g.lineCap = "round";
    for (let i = 0; i < 1600; i++) {
      const x = r() * 512, y = r() * 512, len = 5 + r() * 9;
      g.strokeStyle = pick(r, ["#488236", "#74b656", "#589242", "#84c462"]);
      g.lineWidth = 2;
      g.beginPath(); g.moveTo(x, y); g.lineTo(x + (r() - 0.5) * 4, y - len); g.stroke();
    }
  });

/** Eiffel Tower painted bronze-brown iron with rivets & optional rust blotches */
export const eiffelIronHD = (key = "eiffelIronHD", rusty = false) =>
  ctex(key, 512, 512, (g, r) => {
    g.fillStyle = rusty ? "#6e5344" : "#6c5749";
    g.fillRect(0, 0, 512, 512);
    // Subtle girder panels & seams
    for (let y = 0; y < 512; y += 64) {
      g.fillStyle = jit(r, rusty ? "#745746" : "#6f594a", 0.07, 4, 0.08);
      g.fillRect(0, y, 512, 62);
      g.fillStyle = "#342720";
      g.fillRect(0, y, 512, 3);
      for (let x = 16; x < 512; x += 32) {
        g.fillStyle = "#41322a";
        g.beginPath(); g.arc(x, y + 12, 3.2, 0, Math.PI * 2); g.fill();
        g.fillStyle = "rgba(225,198,175,0.28)";
        g.beginPath(); g.arc(x - 1, y + 11, 1.5, 0, Math.PI * 2); g.fill();
      }
    }
    if (rusty) {
      for (let i = 0; i < 160; i++) {
        g.fillStyle = pick(r, ["#b25629", "#9c431f", "#c96a30", "#7d351b"]);
        g.globalAlpha = 0.45 + r() * 0.4;
        g.beginPath();
        g.ellipse(r() * 512, r() * 512, 10 + r() * 34, 6 + r() * 24, r() * Math.PI, 0, Math.PI * 2);
        g.fill();
      }
      g.globalAlpha = 1;
    }
  });

/** Parisian Haussmann cream limestone ashlar with subtle joints */
export const haussmannHD = (key = "haussmannHD", base = "#dfd2bc") =>
  ctex(key, 512, 512, (g, r) => {
    g.fillStyle = base; g.fillRect(0, 0, 512, 512);
    const rows = 10, rh = 512 / rows;
    for (let j = 0; j < rows; j++) {
      const y = j * rh;
      for (let i = 0; i < 4; i++) {
        const x = i * 128 + (j % 2 ? 64 : 0);
        g.fillStyle = jit(r, base, 0.04, 2, 0.06);
        g.fillRect(x - 128, y, 128, rh);
        g.fillRect(x, y, 128, rh);
      }
      g.fillStyle = "rgba(92,82,68,0.34)";
      g.fillRect(0, y, 512, 2.5);
    }
    // Tall Parisian windows with dark shuttered panes & subtle reflection
    for (const wx of [64, 208, 352]) {
      for (const wy of [48, 286]) {
        g.fillStyle = "#3a455a";
        g.fillRect(wx, wy, 84, 152);
        g.fillStyle = "rgba(182,208,236,0.28)";
        g.fillRect(wx + 8, wy + 8, 30, 62);
        g.fillRect(wx + 46, wy + 8, 30, 62);
        g.strokeStyle = "#f2ebdc"; g.lineWidth = 4;
        g.strokeRect(wx + 2, wy + 2, 80, 148);
        g.beginPath(); g.moveTo(wx + 42, wy); g.lineTo(wx + 42, wy + 152);
        g.moveTo(wx, wy + 76); g.lineTo(wx + 84, wy + 76); g.stroke();
        // Wrought-iron balcony rail silhouette at window bottom
        g.strokeStyle = "#2b282c"; g.lineWidth = 3;
        g.strokeRect(wx - 6, wy + 114, 96, 40);
        for (let bx = wx + 2; bx < wx + 88; bx += 12) {
          g.beginPath(); g.moveTo(bx, wy + 114); g.lineTo(bx, wy + 154); g.stroke();
        }
      }
    }
  });

/** Hôtel de Crillon luxury cream wall with gold trim panels */
export const crillonWallHD = (key = "crillonWallHD") =>
  ctex(key, 512, 512, (g, r) => {
    g.fillStyle = "#efe4ce"; g.fillRect(0, 0, 512, 512);
    for (let i = 0; i < 60; i++) {
      g.fillStyle = jit(r, "#ece0c8", 0.03, 2, 0.04);
      g.fillRect(r() * 512, r() * 512, 80, 40);
    }
    // Wainscot & gilded molding frames
    g.fillStyle = "#d9caa8"; g.fillRect(0, 380, 512, 132);
    g.fillStyle = "#c8a24e"; g.fillRect(0, 374, 512, 8);
    g.fillRect(0, 14, 512, 10);
    for (const x of [34, 274]) {
      g.strokeStyle = "#c9a34e"; g.lineWidth = 6;
      g.strokeRect(x, 54, 204, 290);
      g.strokeStyle = "#a68238"; g.lineWidth = 2;
      g.strokeRect(x + 12, 66, 180, 266);
      g.strokeStyle = "#b99546"; g.lineWidth = 4;
      g.strokeRect(x, 404, 204, 86);
    }
  });

/** Warm herringbone oak parquet floor */
export const parquetHD = (key = "parquetHD") =>
  ctex(key, 512, 512, (g, r) => {
    g.fillStyle = "#9e6b3c"; g.fillRect(0, 0, 512, 512);
    const cols = ["#a87442", "#946234", "#b57f4b", "#8a592e"];
    const w = 64, h = 16;
    for (let y = 0; y < 512; y += h) {
      for (let x = 0; x < 512; x += w) {
        const sh = ((y / h) % 2) * (w / 2);
        g.fillStyle = jit(r, pick(r, cols), 0.08, 3, 0.08);
        g.fillRect(x + sh - w, y, w - 2, h - 2);
        g.fillRect(x + sh, y, w - 2, h - 2);
        g.fillStyle = "#4a2c16";
        g.fillRect(0, y, 512, 1.5);
      }
    }
  });

/** Classic red-and-cream striped Parisian café awning */
export const awningHD = (key = "awningHD", stripe = "#b53634") =>
  ctex(key, 512, 512, (g) => {
    const n = 8, sw = 512 / n;
    for (let i = 0; i < n; i++) {
      g.fillStyle = i % 2 === 0 ? stripe : "#f3ead7";
      g.fillRect(i * sw, 0, sw, 512);
      g.fillStyle = "rgba(40,20,20,0.12)";
      g.fillRect(i * sw, 0, 4, 512);
    }
  });

/** Brick back-alley wall */
export const brickHD = (key = "brickHD", base = "#8f4b3c") =>
  ctex(key, 512, 512, (g, r) => {
    g.fillStyle = "#524642"; g.fillRect(0, 0, 512, 512);
    const rows = 16, rh = 512 / rows, bw = 64;
    for (let j = 0; j < rows; j++) {
      const off = (j % 2) * (bw / 2);
      for (let x = -bw; x < 512 + bw; x += bw) {
        g.fillStyle = jit(r, base, 0.12, 5, 0.12);
        g.fillRect(x + off + 2, j * rh + 2, bw - 4, rh - 4);
      }
    }
  });

/** Stylized checker floor for cool twilight explainer stage */
export const checkerHD = (key = "checkerHD") =>
  ctex(key, 512, 512, (g) => {
    const n = 8, s = 512 / n;
    for (let y = 0; y < n; y++) for (let x = 0; x < n; x++) {
      g.fillStyle = (x + y) % 2 === 0 ? "#4d6188" : "#3a4c70";
      g.fillRect(x * s, y * s, s, s);
      g.strokeStyle = "#293652"; g.lineWidth = 2;
      g.strokeRect(x * s, y * s, s, s);
    }
  });

/** Ocean / harbor water */
export const waterHD = (key = "waterHD") =>
  ctex(key, 512, 512, (g, r) => {
    g.fillStyle = "#1d5e88"; g.fillRect(0, 0, 512, 512);
    for (let i = 0; i < 120; i++) {
      const x = r() * 512, y = r() * 512, len = 35 + r() * 70;
      g.strokeStyle = r() < 0.4 ? "rgba(182,228,248,0.42)" : "#2d7ca8";
      g.lineWidth = 2.5 + r() * 3.5;
      g.beginPath(); g.moveTo(x, y); g.quadraticCurveTo(x + len * 0.5, y - 5, x + len, y); g.stroke();
    }
  });

/** Wood planks for scaffolds, crates, train, gangplank */
export const planksHD = (key = "planksHD", cols = ["#b88048", "#a8723c", "#c68d54", "#9e6936"]) =>
  ctex(key, 512, 512, (g, r) => {
    const n = 12, ph = 512 / n;
    for (let i = 0; i < n; i++) {
      const y = i * ph;
      g.fillStyle = jit(r, pick(r, cols), 0.09, 4, 0.1);
      g.fillRect(0, y, 512, ph);
      g.fillStyle = "#3b2415"; g.fillRect(0, y, 512, 3);
    }
  });
