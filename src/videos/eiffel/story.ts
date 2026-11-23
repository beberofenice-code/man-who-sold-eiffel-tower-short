// Master timeline, camera choreography, kicks, flashes, and DOF for "The Man Who Sold the Eiffel Tower" (Paris, 1925).
// Locked to voice/words.json (eleven_v4 narration, 76.46 s -> 2310 frames @ 30 fps = 77.00 s).
// Every visual reaction lands 0-3 frames before its spoken word. Zero static holds (every hold creeps).
import type { LightMode } from "./lights";

export const FPS = 30;
export const TOTAL = 2310; // 77.00 s

// Exact frame constants locked to voice/words.json (2-3 f lead before word onset)
export const F_SOLD = 68;           // "sold" (f=70)
export const F_EIFFEL = 80;         // "Eiffel" (f=82)
export const F_SCRAP = 108;         // "scrap," (f=110)
export const F_WITHOUT = 132;       // "without" (f=134) — reverse cut
export const F_BROKE = 196;         // "broke," (f=198)
export const F_RUSTY = 225;         // "rusty" (f=227)
export const F_REPAINT = 287;       // "repaint." (f=290)
export const F_PAPER = 327;         // "paper" (f=329)
export const F_LUSTIG = 364;        // "Victor Lustig" (f=366)
export const F_PLAN = 404;          // "plan." (f=407)
export const F_STAMP = 439;         // "ministry" (f=441)
export const F_DEALERS = 482;       // "five scrap dealers" (f=484)
export const F_MINISTER = 599;      // "minister," (f=602)
export const F_SEVEN_K = 685;       // "seven thousand" (f=687)
export const F_LIMO = 774;          // "limousine" (f=776)
export const F_POISSON = 861;       // "Poisson" (f=863)
export const F_WIFE = 923;          // "wife" (f=925)
export const F_WHISPER = 974;       // "whispers" (f=976)
export const F_BRIBE = 1008;        // "bribe" (f=1010)
export const F_SEALS = 1094;        // "seals" (f=1096)
export const F_OFFICIAL = 1133;     // "official" (f=1135)
export const F_CASH = 1209;         // "seventy" (f=1211)
export const F_TRAIN = 1262;        // "Lustig catches the next train" (f=1264) — reverse cut to Vienna Express
export const F_RECEIPT = 1373;      // "fancy receipt" (f=1375)
export const F_UNLUCKILY = 1405;    // "Unluckily," (f=1407)
export const F_CLEAN = 1504;        // "clean deal" (f=1506)
export const F_SHADY = 1575;        // "shady shortcut" (f=1577)
export const F_LOCK = 1603;         // "traps" (f=1605)
export const F_WATCH = 1693;        // "watch" (f=1695)
export const F_BREAKS = 1738;       // "breaks," (f=1740)
export const F_COPS = 1762;         // "call the cops" (f=1764)
export const F_PAPERS_CUT = 1876;   // "Seeing nothing in the papers" (f=1879) — cut to Vienna cafe
export const F_PAPERS = 1898;       // "papers," (f=1900)
export const F_AGAIN = 1937;        // "rides back" (f=1939)
export const F_POLICE = 2029;       // "police," (f=2031)
export const F_BOLTS = 2069;        // "bolts" (f=2071)
export const F_CAUGHT = 2145;       // "caught" (f=2147)
export const F_SALESMAN_CUT = 2186; // "and his death certificate" (f=2188) — cut to golden Eiffel finale
export const F_SALESMAN = 2252;     // "apprentice salesman" (f=2254)

export type SetId =
  | "plaza"
  | "tower_close"
  | "cafe"
  | "hotel_salon"
  | "hotel_alcove"
  | "train_escape"
  | "explainer"
  | "alley"
  | "vienna_cafe"
  | "hotel_bust"
  | "finale";

export type Shot = {
  id: number;
  a: number;
  b: number;
  light: LightMode;
  set: SetId;
  xfade?: number;
  sunAz?: number;
  sunEl?: number;
};

export const SHOTS: Shot[] = [
  { id: 1,  a: 0,    b: 159,  light: "day",      set: "plaza",        sunAz: 68,  sunEl: 46 },
  { id: 2,  a: 159,  b: 306,  light: "day",      set: "tower_close",  sunAz: 72,  sunEl: 44 },
  { id: 3,  a: 306,  b: 421,  light: "day",      set: "cafe",         xfade: 6, sunAz: 62, sunEl: 48 },
  { id: 4,  a: 421,  b: 570,  light: "interior", set: "hotel_salon",  xfade: 6, sunAz: 55, sunEl: 38 },
  { id: 5,  a: 570,  b: 746,  light: "interior", set: "hotel_salon",  sunAz: 58,  sunEl: 36 },
  { id: 6,  a: 746,  b: 827,  light: "day",      set: "plaza",        xfade: 6, sunAz: 78, sunEl: 48 },
  { id: 7,  a: 827,  b: 959,  light: "interior", set: "hotel_salon",  xfade: 6, sunAz: 52, sunEl: 38 },
  { id: 8,  a: 959,  b: 1066, light: "dusk",     set: "hotel_alcove", sunAz: 24,  sunEl: 16 },
  { id: 9,  a: 1066, b: 1185, light: "interior", set: "hotel_alcove", sunAz: 50,  sunEl: 34 },
  { id: 10, a: 1185, b: 1335, light: "golden",   set: "train_escape", xfade: 6, sunAz: 10, sunEl: 9 },
  { id: 11, a: 1335, b: 1484, light: "day",      set: "plaza",        xfade: 6, sunAz: 74, sunEl: 46 },
  { id: 12, a: 1484, b: 1658, light: "storm",    set: "explainer",    xfade: 6, sunAz: 45, sunEl: 32 },
  { id: 13, a: 1658, b: 1788, light: "dusk",     set: "alley",        xfade: 6, sunAz: 22, sunEl: 16 },
  { id: 14, a: 1788, b: 1982, light: "day",      set: "vienna_cafe",  xfade: 6, sunAz: 68, sunEl: 45 },
  { id: 15, a: 1982, b: 2107, light: "dusk",     set: "hotel_bust",   xfade: 6, sunAz: 20, sunEl: 14 },
  { id: 16, a: 2107, b: 2310, light: "golden",   set: "finale",       xfade: 6, sunAz: 8,  sunEl: 8 },
];

export type V3 = [number, number, number];
export type CamState = { pos: V3; look: V3; fov: number; roll: number };
export type CamKey = { f: number; dur?: number; cut?: boolean; s: (f: number) => CamState };

export const clamp01 = (x: number) => Math.max(0, Math.min(1, x));
export const smoother = (x: number) => {
  const t = clamp01(x);
  return t * t * t * (t * (t * 6 - 15) + 10);
};
export const easeOut = (x: number) => {
  const t = clamp01(x);
  return 1 - (1 - t) * (1 - t) * (1 - t);
};
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const lerp3 = (a: V3, b: V3, t: number): V3 => [lerp(a[0], b[0], t), lerp(a[1], b[1], t), lerp(a[2], b[2], t)];

const CAMS: Record<number, CamKey[]> = {
  // Shot 1: Hook on Champ de Mars with FULL Eiffel Tower spire towering behind Lustig; cut to sly hat-tip CU at F_WITHOUT
  1: [
    { f: 0, s: (f) => {
      const p = clamp01(f / 68);
      return { pos: [0.5 - p * 0.35, 2.1 + p * 0.25, 13.4 - p * 1.2], look: [0, 7.6 + p * 2.4, -24], fov: 49 - p * 1.5, roll: -1.4 + p * 2.2 };
    }},
    { f: F_SOLD, dur: 22, s: (f) => {
      const p = clamp01((f - F_SOLD) / 64);
      return { pos: [-0.3 + p * 0.4, 1.85 - p * 0.1, 11.8 - p * 0.7], look: [0.0, 9.6 + p * 3.8, -26], fov: 50, roll: 2.0 - p * 1.2 };
    }},
    { f: F_WITHOUT, cut: true, s: (f) => {
      const p = clamp01((f - F_WITHOUT) / 28);
      return { pos: [0.15 - p * 0.1, 1.72, 4.45 - p * 0.55], look: [0.0, 1.62, 0.0], fov: 34 - p * 2.5, roll: -3.2 + p * 1.2 };
    }},
  ],

  // Shot 2: Rusty Eiffel Tower base + broke city painter on scaffold
  2: [
    { f: 159, s: (f) => {
      const p = clamp01((f - 159) / 66);
      return { pos: [-2.6 + p * 0.8, 1.9 + p * 0.4, 8.5 - p * 1.1], look: [-0.4, 2.4 + p * 1.2, -3.0], fov: 40, roll: 1.5 - p * 1.0 };
    }},
    { f: F_RUSTY, dur: 24, s: (f) => {
      const p = clamp01((f - F_RUSTY) / 80);
      return { pos: [1.6 - p * 0.6, 2.6 + p * 1.6, 7.2 - p * 1.0], look: [0.3, 4.4 + p * 1.6, -2.5], fov: 39 - p * 2.5, roll: -2.0 + p * 3.2 };
    }},
  ],

  // Shot 3: Paris sidewalk cafe terrace — Lustig reads paper and hatches plan
  3: [
    { f: 306, s: (f) => {
      const p = clamp01((f - 306) / 76);
      return { pos: [-1.4 + p * 0.5, 1.85, 6.2 - p * 1.0], look: [0.0, 1.65, -4.0], fov: 38, roll: 1.2 - p * 0.8 };
    }},
    { f: F_PLAN - 14, dur: 18, s: (f) => {
      const p = clamp01((f - (F_PLAN - 14)) / 36);
      return { pos: [0.25 - p * 0.15, 1.68, 3.85 - p * 0.55], look: [0.0, 1.58, 0.0], fov: 33 - p * 2, roll: -2.8 + p * 1.0 };
    }},
  ],

  // Shot 4: Hôtel de Crillon — wax-seal forgery desk pulling back to 5 arriving scrap dealers
  4: [
    { f: 421, s: (f) => {
      const p = clamp01((f - 421) / 56);
      return { pos: [0.45 - p * 0.25, 2.0 - p * 0.12, 3.6 - p * 0.55], look: [-0.1, 1.35, -1.2], fov: 36, roll: -1.8 + p * 1.0 };
    }},
    { f: F_DEALERS - 4, dur: 28, s: (f) => {
      const p = clamp01((f - (F_DEALERS - 4)) / 92);
      return { pos: [-1.4 + p * 1.2, 2.25, 9.6 - p * 1.0], look: [0.0, 1.65, -2.0], fov: 42 - p * 1.5, roll: 1.8 - p * 1.4 };
    }},
  ],

  // Shot 5: Crillon conference table — Lustig beside brass mini Eiffel model, 5 dealers cleanly in front
  5: [
    { f: 570, s: (f) => {
      const p = clamp01((f - 570) / 108);
      return { pos: [1.2 - p * 0.9, 2.25, 7.8 - p * 0.9], look: [0.1, 1.65, -1.5], fov: 40, roll: -1.4 + p * 1.6 };
    }},
    { f: F_SEVEN_K - 6, dur: 22, s: (f) => {
      const p = clamp01((f - (F_SEVEN_K - 6)) / 68);
      return { pos: [-0.9 + p * 0.6, 2.05, 6.6 - p * 0.7], look: [0.15, 1.65, -1.4], fov: 38 - p * 1.8, roll: 2.2 - p * 1.0 };
    }},
  ],

  // Shot 6: Limousine cruising dead-center right under the giant Eiffel Tower arch!
  6: [
    { f: 746, s: (f) => {
      const p = clamp01((f - 746) / 81);
      const lx = -4.0 + p * 8.0;
      return { pos: [lx - 1.2, 2.05 + p * 0.35, 9.8 - p * 1.2], look: [lx * 0.6, 4.6 + p * 3.2, -14], fov: 48 - p * 1.8, roll: -2.2 + p * 3.4 };
    }},
  ],

  // Shot 7: Eager André Poisson & suspicious Madame Poisson cleanly in front of the Crillon salon table
  7: [
    { f: 827, s: (f) => {
      const p = clamp01((f - 827) / 86);
      return { pos: [-1.1 + p * 0.3, 1.75, 6.4 - p * 0.7], look: [-0.75, 1.55, 1.1], fov: 35, roll: 1.5 - p * 1.1 };
    }},
    { f: F_WIFE - 8, dur: 18, s: (f) => {
      const p = clamp01((f - (F_WIFE - 8)) / 44);
      return { pos: [1.05 - p * 0.2, 1.74, 5.9 - p * 0.5], look: [0.95, 1.55, 1.1], fov: 34 - p * 1.5, roll: -2.8 + p * 1.1 };
    }},
  ],

  // Shot 8: Dusk-lit Crillon velvet alcove — Lustig whispers the bribe
  8: [
    { f: 959, s: (f) => {
      const p = clamp01((f - 959) / 107);
      return { pos: [0.85 - p * 0.65, 1.70, 5.4 - p * 0.9], look: [0.05, 1.58, -0.5], fov: 36 - p * 2.2, roll: -2.2 + p * 3.8 };
    }},
  ],

  // Shot 9: Tight CU on Poisson realizing "only a real official would ask for a bribe"
  9: [
    { f: 1066, s: (f) => {
      const p = clamp01((f - 1066) / 119);
      return { pos: [-0.25 + p * 0.35, 1.66, 3.9 - p * 0.65], look: [0.0, 1.56, -0.5], fov: 32 - p * 2.2, roll: 2.2 - p * 3.8 };
    }},
  ],

  // Shot 10: Golden cash handoff (both actors cleanly inside 9:16!) -> cut to full Vienna Express locomotive + waving Lustig!
  10: [
    { f: 1185, s: (f) => {
      const p = clamp01((f - 1185) / 76);
      return { pos: [-0.45 + p * 0.4, 1.82, 6.4 - p * 0.8], look: [0.0, 1.60, 0.0], fov: 39 - p * 1.8, roll: -1.6 + p * 2.0 };
    }},
    { f: F_TRAIN, cut: true, s: (f) => {
      const p = clamp01((f - F_TRAIN) / 73);
      const tx = -8.0 + p * 16.0;
      return { pos: [tx - 3.6, 2.85 + p * 0.3, 15.6 - p * 1.4], look: [tx - 2.6, 2.35, -2.2], fov: 46 - p * 1.5, roll: 2.4 - p * 1.6 };
    }},
  ],

  // Shot 11: Deadpan double line — Poisson's proud receipt under Eiffel Tower -> crushed by French officials
  11: [
    { f: 1335, s: (f) => {
      const p = clamp01((f - 1335) / 68);
      return { pos: [-0.4 + p * 0.25, 1.80, 7.2 - p * 0.8], look: [-0.15, 2.8, -14.0], fov: 42 - p * 2, roll: 1.5 - p * 1.0 };
    }},
    { f: F_UNLUCKILY - 2, dur: 16, s: (f) => {
      const p = clamp01((f - (F_UNLUCKILY - 2)) / 80);
      return { pos: [0.95 - p * 0.45, 1.90, 8.4 - p * 0.8], look: [0.3, 2.1, -6.0], fov: 43 - p * 1.5, roll: -3.4 + p * 1.8 };
    }},
  ],

  // Shot 12: Cool blue explainer stage — wider framing so both characters & props stay comfortably inside 9:16
  12: [
    { f: 1484, s: (f) => {
      const p = clamp01((f - 1484) / 86);
      return { pos: [-2.3 + p * 0.35, 1.92, 7.5 - p * 0.7], look: [-2.2, 1.55, 0.0], fov: 40, roll: 1.4 - p * 0.9 };
    }},
    { f: F_SHADY - 8, dur: 22, s: (f) => {
      const p = clamp01((f - (F_SHADY - 8)) / 92);
      return { pos: [2.2 - p * 0.2, 1.90, 7.4 - p * 0.75], look: [2.2, 1.60, 0.0], fov: 39 - p * 1.8, roll: -2.2 + p * 1.2 };
    }},
  ],

  // Shot 13: Back alley watch analogy — centered so hustler, buyer, broken watch, AND patrolling cop all read cleanly
  13: [
    { f: 1658, s: (f) => {
      const p = clamp01((f - 1658) / 76);
      return { pos: [-0.45 + p * 0.45, 1.85, 7.1 - p * 0.85], look: [0.0, 1.62, -1.2], fov: 40, roll: -1.6 + p * 1.4 };
    }},
    { f: F_BREAKS - 2, dur: 16, s: (f) => {
      const p = clamp01((f - (F_BREAKS - 2)) / 52);
      return { pos: [0.25 - p * 0.25, 1.88, 6.7 - p * 0.65], look: [0.0, 1.65, -2.2], fov: 39 - p * 1.5, roll: 2.8 - p * 1.6 };
    }},
  ],

  // Shot 14: Poisson blushing silently on bench -> cut to Lustig checking clean papers at Vienna cafe & dashing back
  14: [
    { f: 1788, s: (f) => {
      const p = clamp01((f - 1788) / 88);
      return { pos: [-5.8 + p * 0.4, 1.68, 4.9 - p * 0.7], look: [-6.0, 1.48, 0.0], fov: 35 - p * 1.5, roll: 2.0 - p * 1.0 };
    }},
    { f: F_PAPERS_CUT, cut: true, s: (f) => {
      const p = clamp01((f - F_PAPERS_CUT) / 106);
      return { pos: [5.4 + p * 0.8, 1.82, 5.8 - p * 1.0], look: [6.0 + p * 0.4, 1.62, -1.0], fov: 38 - p * 2, roll: -2.2 + p * 3.4 };
    }},
  ],

  // Shot 15: Second attempt busted — wide confrontation -> dynamic framing of Lustig leaping onto transatlantic liner with red stacks!
  15: [
    { f: 1982, s: (f) => {
      const p = clamp01((f - 1982) / 62);
      return { pos: [-0.6 + p * 0.7, 2.0, 9.6 - p * 0.8], look: [-0.3, 1.72, -0.8], fov: 43, roll: -2.0 + p * 2.2 };
    }},
    { f: F_BOLTS - 8, dur: 20, s: (f) => {
      const p = clamp01((f - (F_BOLTS - 8)) / 46);
      return { pos: [2.4 + p * 1.4, 2.4 + p * 0.45, 5.6 - p * 0.8], look: [6.0 + p * 0.8, 3.6, -7.8], fov: 48 - p * 1.5, roll: 3.0 - p * 1.8 };
    }},
  ],

  // Shot 16: Alcatraz cell at x=-20 (clear central face gap!) -> cut to breathtaking full-spire golden sunset Eiffel finale!
  16: [
    { f: 2107, s: (f) => {
      const p = clamp01((f - 2107) / 79);
      return { pos: [-20.0 + p * 0.15, 1.72, 5.3 - p * 0.7], look: [-20.0, 1.60, 0.0], fov: 36 - p * 1.8, roll: -2.2 + p * 1.4 };
    }},
    { f: F_SALESMAN_CUT, cut: true, s: (f) => {
      const p = clamp01((f - F_SALESMAN_CUT) / 124);
      return { pos: [0.35 - p * 0.7, 2.05 + p * 0.45, 13.0 - p * 1.4], look: [0.0, 8.8 + p * 3.0, -25.0], fov: 49 - p * 2.5, roll: 1.6 - p * 2.2 };
    }},
  ],
};

// Impact flip-shakes: [frame, amplitudeDeg] decaying over 7 frames
export const KICKS: [number, number][] = [
  [F_SOLD, 2.8],
  [F_STAMP, 3.4],
  [F_CASH, 3.0],
  [F_UNLUCKILY, 4.0],
  [F_LOCK, 3.4],
  [F_BREAKS, 3.8],
  [F_POLICE, 3.6],
  [F_CAUGHT, 3.8],
  [F_SALESMAN, 2.4],
];

// White flash after hook
export const FLASHES: { f: number; color: string; curve: number[] }[] = [
  { f: 156, color: "#fff8eb", curve: [0.48, 0.94, 0.42] },
];

export function camAt(id: number, f: number): CamState {
  const keys = CAMS[id];
  if (!keys || !keys.length) return { pos: [0, 2, 8], look: [0, 1.5, 0], fov: 40, roll: 0 };
  let idx = 0;
  for (let i = 0; i < keys.length; i++) {
    if (f >= keys[i].f) idx = i;
  }
  const cur = keys[idx];
  let state = cur.s(f);
  if (idx > 0 && !cur.cut && cur.dur && f < cur.f + cur.dur) {
    const prev = keys[idx - 1].s(f);
    const t = smoother((f - cur.f) / cur.dur);
    state = {
      pos: lerp3(prev.pos, state.pos, t),
      look: lerp3(prev.look, state.look, t),
      fov: lerp(prev.fov, state.fov, t),
      roll: lerp(prev.roll, state.roll, t),
    };
  }
  // Apply decaying flip-shake impact kicks
  let kickRoll = 0;
  let kickY = 0;
  for (const [kf, amp] of KICKS) {
    const dt = f - kf;
    if (dt >= 0 && dt < 7) {
      const sign = dt % 2 === 0 ? 1 : -1;
      const decay = Math.pow(1 - dt / 7, 1.7);
      kickRoll += sign * amp * decay;
      kickY += sign * amp * 0.018 * decay;
    }
  }
  return {
    pos: [state.pos[0], state.pos[1] + kickY, state.pos[2]],
    look: state.look,
    fov: state.fov,
    roll: state.roll + kickRoll,
  };
}

export function layersAt(f: number): { id: number; alpha: number }[] {
  for (let i = 0; i < SHOTS.length; i++) {
    const s = SHOTS[i];
    if (f >= s.a && f < s.b) {
      if (s.xfade && i > 0 && f < s.a + s.xfade) {
        const u = clamp01((f - s.a) / s.xfade);
        return [{ id: SHOTS[i - 1].id, alpha: 1 }, { id: s.id, alpha: u }];
      }
      return [{ id: s.id, alpha: 1 }];
    }
  }
  return [{ id: SHOTS[SHOTS.length - 1].id, alpha: 1 }];
}

export function flashAt(f: number): { color: string; opacity: number } {
  for (const fl of FLASHES) {
    const k = f - fl.f;
    if (k >= 0 && k < fl.curve.length) return { color: fl.color, opacity: fl.curve[k] };
  }
  return { color: "#ffffff", opacity: 0 };
}

export function dofAt(f: number): { cInf: number; focus?: (f: number) => V3 } {
  const s = SHOTS.find((x) => f >= x.a && f < x.b) || SHOTS[SHOTS.length - 1];
  switch (s.id) {
    case 1:
      return f >= F_WITHOUT ? { cInf: 14, focus: () => [0, 1.58, 0] } : { cInf: 0 };
    case 2:
      return { cInf: 8, focus: () => [-0.2, 2.5, -1.5] };
    case 3:
      return { cInf: 12, focus: () => [0, 1.55, 0] };
    case 4:
      return f < F_DEALERS ? { cInf: 12, focus: () => [0, 1.4, -0.4] } : { cInf: 0 };
    case 5:
      return { cInf: 8, focus: () => [0, 1.55, -1.2] };
    case 6:
      return { cInf: 0 };
    case 7:
      return { cInf: 12, focus: () => (f < F_WIFE - 6 ? [-0.75, 1.55, 1.1] : [0.95, 1.55, 1.1]) };
    case 8:
      return { cInf: 13, focus: () => [0, 1.56, -0.5] };
    case 9:
      return { cInf: 15, focus: () => [0, 1.56, -0.5] };
    case 10:
      return f < F_TRAIN ? { cInf: 10, focus: () => [0, 1.55, 0] } : { cInf: 0 };
    case 11:
      return { cInf: 7, focus: () => [0, 1.55, 0] };
    case 12:
      return { cInf: 10, focus: () => (f < F_SHADY - 4 ? [-2.2, 1.55, 0] : [2.2, 1.55, 0]) };
    case 13:
      return { cInf: 11, focus: () => [0, 1.56, -0.8] };
    case 14:
      return { cInf: 11, focus: () => (f < F_PAPERS_CUT ? [-6.0, 1.48, 0] : [6.0, 1.55, 0]) };
    case 15:
      return { cInf: 0 };
    case 16:
      return f < F_SALESMAN_CUT ? { cInf: 12, focus: () => [-20.0, 1.58, 0] } : { cInf: 5, focus: () => [0, 1.58, 2.2] };
    default:
      return { cInf: 0 };
  }
}
