// Camera-facing 2D cartoon cast billboards & text-free FX cards for "The Man Who Sold the Eiffel Tower".
// All cards live on NOINK layer, lit via cardShade() (no emissive), with ground contact shadows.
import * as THREE from "three";
import { NOINK } from "./ink";
import { cardShade, blobMaterial, CARD_K } from "./cardshade";
import { LIGHTS, LightMode } from "./lights";
import { ctex } from "./paint";
import {
  drawCharacter, drawFx, CharSpec, FxKind,
  LUSTIG, LUSTIG_PRISON, DAN, POISSON, MME_POISSON, PAINTER,
  MINISTER_REAL, GENDARME, HUSTLER, BUYER, AGENT, dealer,
} from "./toon";
import {
  FPS, clamp01, easeOut,
  F_SOLD, F_WITHOUT, F_BROKE, F_RUSTY, F_REPAINT,
  F_PAPER, F_PLAN, F_STAMP, F_DEALERS, F_MINISTER, F_SEVEN_K,
  F_LIMO, F_POISSON, F_WIFE, F_WHISPER, F_BRIBE, F_SEALS, F_OFFICIAL,
  F_CASH, F_TRAIN, F_RECEIPT, F_UNLUCKILY, F_CLEAN, F_SHADY, F_LOCK,
  F_WATCH, F_BREAKS, F_COPS, F_PAPERS_CUT, F_PAPERS, F_AGAIN,
  F_POLICE, F_BOLTS, F_CAUGHT, F_SALESMAN_CUT, F_SALESMAN,
} from "./story";

export type CamInfo = { pos: THREE.Vector3; look: THREE.Vector3; heightPx: number };

const blobTex = () =>
  ctex("contactBlob", 128, 128, (g) => {
    g.fillStyle = "#ffffff";
    g.fillRect(0, 0, 128, 128);
    const gr = g.createRadialGradient(64, 64, 6, 64, 64, 58);
    gr.addColorStop(0, "rgba(70,66,84,0.52)");
    gr.addColorStop(0.65, "rgba(70,66,84,0.22)");
    gr.addColorStop(1, "rgba(255,255,255,0)");
    g.fillStyle = gr;
    g.fillRect(0, 0, 128, 128);
  }, false);

function pop(f: number, f0: number, dur = 9): number {
  const u = clamp01((f - f0) / dur);
  if (u <= 0) return 0;
  if (u >= 1) return 1;
  return u < 0.6 ? (u / 0.6) * 1.15 : 1.15 - ((u - 0.6) / 0.4) * 0.15;
}

/** Deterministic blink helper: blinks for 3 frames every ~58 frames */
function maybeBlink(f: number, seed: number, face: CharSpec["face"]): CharSpec["face"] {
  if (face === "shock" || face === "wink" || face === "ashamed" || face === "starry" || face === "despair") return face;
  const period = 54 + (seed % 23);
  const m = (f + seed * 17) % period;
  return m < 3 ? "blink" : face;
}

export class Actor {
  group = new THREE.Group();
  mesh: THREE.Mesh;
  blob: THREE.Mesh;
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private tex: THREE.CanvasTexture;
  private mat: THREE.MeshLambertMaterial;

  constructor() {
    this.canvas = document.createElement("canvas");
    this.canvas.width = 600;
    this.canvas.height = 1000;
    this.ctx = this.canvas.getContext("2d")!;
    this.tex = new THREE.CanvasTexture(this.canvas);
    this.tex.colorSpace = THREE.SRGBColorSpace;
    this.tex.generateMipmaps = false;
    this.tex.minFilter = THREE.LinearFilter;
    this.mat = cardShade(new THREE.MeshLambertMaterial({
      map: this.tex, transparent: true, alphaTest: 0.42, side: THREE.DoubleSide,
    }));
    // Card height = 2.05 m (soles at y = 975 -> 2.5% above bottom edge)
    const geo = new THREE.PlaneGeometry(1.23, 2.05);
    geo.translate(0, 2.05 * 0.475, 0);
    this.mesh = new THREE.Mesh(geo, this.mat);
    this.mesh.castShadow = false;
    this.mesh.receiveShadow = true;
    this.mesh.layers.set(NOINK);

    this.blob = new THREE.Mesh(new THREE.PlaneGeometry(1.15, 0.56), blobMaterial(blobTex()));
    this.blob.rotation.x = -Math.PI / 2;
    this.blob.position.y = 0.025;
    this.blob.renderOrder = 2;
    this.blob.layers.set(NOINK);

    this.group.add(this.blob, this.mesh);
    this.group.visible = false;
  }

  place(x: number, y: number, z: number, scale: number, cam: CamInfo, spec: CharSpec, light: LightMode, showBlob = true) {
    drawCharacter(this.ctx, spec);
    this.tex.needsUpdate = true;
    this.group.visible = true;
    this.group.position.set(x, y, z);
    this.mesh.scale.setScalar(scale);
    // Cylindrical Y-billboard facing camera horizontally
    const ang = Math.atan2(cam.pos.x - x, cam.pos.z - z);
    this.mesh.rotation.set(0, ang, 0);
    this.mesh.castShadow = LIGHTS[light].actorShadow;
    this.blob.visible = showBlob && y < 0.35;
    this.blob.scale.setScalar(scale);
  }
}

export class Fx {
  mesh: THREE.Mesh;
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private tex: THREE.CanvasTexture;

  constructor() {
    this.canvas = document.createElement("canvas");
    this.canvas.width = 512;
    this.canvas.height = 512;
    this.ctx = this.canvas.getContext("2d")!;
    this.tex = new THREE.CanvasTexture(this.canvas);
    this.tex.colorSpace = THREE.SRGBColorSpace;
    this.tex.generateMipmaps = false;
    this.tex.minFilter = THREE.LinearFilter;
    const m = new THREE.MeshBasicMaterial({ map: this.tex, transparent: true, alphaTest: 0.06, side: THREE.DoubleSide, depthWrite: false });
    this.mesh = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), m);
    this.mesh.layers.set(NOINK);
    this.mesh.renderOrder = 10;
    this.mesh.visible = false;
  }

  place(x: number, y: number, z: number, scale: number, cam: CamInfo, kind: FxKind, phase = 0, rotZ = 0) {
    if (scale <= 0.01) { this.mesh.visible = false; return; }
    drawFx(this.ctx, kind, phase);
    this.tex.needsUpdate = true;
    this.mesh.visible = true;
    this.mesh.position.set(x, y, z);
    this.mesh.scale.setScalar(scale);
    const ang = Math.atan2(cam.pos.x - x, cam.pos.z - z);
    this.mesh.rotation.set(0, ang, rotZ);
  }
}

export class Pool {
  actors: Actor[] = [];
  fxs: Fx[] = [];
  private aIdx = 0;
  private fIdx = 0;

  ensure(root: THREE.Group, nA = 10, nF = 8) {
    while (this.actors.length < nA) {
      const a = new Actor();
      this.actors.push(a);
      root.add(a.group);
    }
    while (this.fxs.length < nF) {
      const fx = new Fx();
      this.fxs.push(fx);
      root.add(fx.mesh);
    }
  }

  begin() {
    this.aIdx = 0;
    this.fIdx = 0;
    for (const a of this.actors) a.group.visible = false;
    for (const fx of this.fxs) fx.mesh.visible = false;
  }

  actor() { return this.actors[this.aIdx++]; }
  fx() { return this.fxs[this.fIdx++]; }
}

/** Limo X position during Shot 6 (cruising dead-center under Eiffel Tower!) */
export const limoXAt = (f: number) => -4.0 + clamp01((f - 746) / 81) * 8.0;

/** Vienna Express train X position during Shot 10 */
export const trainXAt = (f: number) => -8.0 + clamp01((f - F_TRAIN) / 73) * 16.0;

/** Stage all 2D cartoon characters & text-free FX cards for the active shot and frame */
export function stageShot(id: number, f: number, light: LightMode, pool: Pool, cam: CamInfo) {
  CARD_K.uPx.value = cam.heightPx / 1920;
  pool.begin();
  const t = f / FPS;

  const put = (x: number, y: number, z: number, sc: number, spec: CharSpec, seed = 1, blob = true) => {
    const a = pool.actor();
    a.place(x, y, z, sc, cam, { ...spec, face: maybeBlink(f, seed, spec.face) }, light, blob);
  };
  const putFx = (x: number, y: number, z: number, sc: number, kind: FxKind, ph = t * 4, rotZ = 0) => {
    const fx = pool.fx();
    fx.place(x, y, z, sc, cam, kind, ph, rotZ);
  };

  if (id === 1) {
    // Shot 1: Hook — Lustig in front of full Eiffel Tower catching money bag, then tipping hat with sly wink!
    const isCU = f >= F_WITHOUT;
    put(0.0, 0, 0.0, 1.04, {
      outfit: LUSTIG,
      face: isCU ? "wink" : f >= F_SOLD ? "grin" : "smirk",
      pose: isCU ? "tip_hat" : f >= F_SOLD ? "present" : "idle",
      phase: t * 3,
      dir: 1,
    }, 1);

    if (f >= F_SOLD && !isCU) {
      const s = pop(f, F_SOLD, 10);
      const dropY = 1.65 + (1 - easeOut((f - F_SOLD) / 10)) * 1.4;
      putFx(1.18, dropY, 0.35, 1.1 * s, "money_bag");
      putFx(-1.0, 2.35, 0.25, 0.72 * s, "sparkle", t * 3);
    }
    if (isCU) {
      const s = pop(f, F_WITHOUT + 2, 8);
      putFx(0.62, 2.05, 0.35, 0.55 * s, "sparkle", t * 5);
    }
  } else if (id === 2) {
    // Shot 2: Broke city official on ground + dismayed painter on wooden scaffold + falling rust flakes
    put(-1.1, 0, -0.4, 0.98, {
      outfit: MINISTER_REAL,
      face: f >= F_BROKE ? "despair" : "skeptic",
      pose: f >= F_BROKE ? "pockets" : "idle",
      phase: t * 2.5,
      dir: 1,
    }, 2);
    put(0.95, 2.48, -2.55, 0.94, {
      outfit: PAINTER,
      face: f >= F_REPAINT ? "shock" : "despair",
      pose: f >= F_REPAINT ? "paint_drop" : "idle",
      phase: t * 3,
      dir: -1,
      prop: "brush",
    }, 3, false);

    if (f >= F_RUSTY) {
      const s = pop(f, F_RUSTY, 10);
      putFx(1.8, 4.1, -3.2, 1.35 * s, "rust_flakes", t * 2.2);
      putFx(-0.1, 3.6, -2.8, 1.1 * s, "rust_flakes", t * 2.2 + 1.5);
    }
  } else if (id === 3) {
    // Shot 3: Lustig at Parisian café reading newspaper -> lightbulb idea pop!
    const hasPlan = f >= F_PLAN;
    put(0.0, 0, 0.0, 1.0, {
      outfit: LUSTIG,
      face: hasPlan ? "grin" : "smirk",
      pose: hasPlan ? "present" : "read_paper",
      phase: t * 2.6,
      dir: 1,
      prop: f >= F_PAPER && !hasPlan ? "paper" : "none",
    }, 4);
    if (hasPlan) {
      const s = pop(f, F_PLAN, 9);
      putFx(0.0, 2.62, 0.15, 0.95 * s, "lightbulb", t * 4);
      putFx(0.85, 2.25, 0.2, 0.55 * s, "sparkle", t * 5);
    }
  } else if (id === 4) {
    // Shot 4: Forging ministry letters at desk -> 5 scrap dealers arriving into Hôtel de Crillon
    const stamping = f >= F_STAMP && f < F_DEALERS;
    put(-0.62, 0, -1.05, 1.0, {
      outfit: LUSTIG,
      face: stamping ? "smirk" : "grin",
      pose: stamping ? "stamp" : "present",
      phase: t * 3,
      dir: 1,
    }, 5);
    put(1.45, 0, -2.55, 0.96, {
      outfit: DAN,
      face: "smirk",
      pose: "idle",
      phase: t * 2,
      dir: -1,
      prop: "briefcase",
    }, 6);

    if (f >= F_STAMP && f < F_DEALERS + 6) {
      const s = pop(f, F_STAMP, 8);
      putFx(0.18, 1.58, -0.95, 0.72 * s, "wax_scroll");
    }
    if (f >= F_DEALERS - 8) {
      const u = easeOut((f - (F_DEALERS - 8)) / 42);
      const slots: [number, number, number][] = [
        [-2.3, 1.4, 0], [-1.15, 1.9, 1], [0.1, 2.1, 2], [1.35, 1.85, 3], [2.35, 1.35, 4],
      ];
      slots.forEach(([tx, tz, idx]) => {
        const sx = tx + (1 - u) * (idx < 2 ? -3.0 : 3.0);
        put(sx, 0, tz, 0.94, {
          outfit: idx === 2 ? POISSON : dealer(idx),
          face: idx === 2 ? "starry" : "neutral",
          pose: u < 0.92 ? "walk" : "idle",
          phase: t * 7 + idx * 1.3,
          dir: idx < 2 ? 1 : -1,
        }, 10 + idx);
      });
    }
  } else if (id === 5) {
    // Shot 5: Conference pitch — Lustig cleanly beside mini Eiffel model, 5 dealers cleanly in front of table!
    const pitched = f >= F_SEVEN_K;
    put(-0.45, 0.12, -2.6, 1.02, {
      outfit: LUSTIG,
      face: pitched ? "grin" : "smirk",
      pose: pitched ? "present" : f >= F_MINISTER ? "point_up" : "idle",
      phase: t * 2.8,
      dir: 1,
    }, 15, false);
    put(1.95, 0.05, -2.75, 0.96, {
      outfit: DAN,
      face: "smirk",
      pose: "idle",
      phase: t * 2.2,
      dir: -1,
      prop: "briefcase",
    }, 16, false);

    const dPos: [number, number, number][] = [
      [-1.95, 0.15, 0], [-0.95, 0.35, 1], [0.15, 0.50, 2], [1.2, 0.35, 3], [2.1, 0.15, 4],
    ];
    dPos.forEach(([dx, dz, idx]) => {
      put(dx, 0, dz, 0.92, {
        outfit: idx === 2 ? POISSON : dealer(idx),
        face: pitched ? "starry" : "neutral",
        pose: pitched && idx === 2 ? "hands_up" : "idle",
        phase: t * 2.4 + idx,
        dir: dx < 0 ? 1 : -1,
      }, 20 + idx);
    });
    if (pitched) {
      const s = pop(f, F_SEVEN_K, 9);
      putFx(0.95, 2.65, -1.6, 0.8 * s, "sparkle", t * 4);
      putFx(-1.25, 2.35, -1.4, 0.62 * s, "coin_glint", t * 3);
    }
  } else if (id === 6) {
    // Shot 6: Limousine gliding dead-center right under the Eiffel Tower arch with Lustig & Poisson!
    const lx = limoXAt(f);
    put(lx - 0.15, 0.96, -3.55, 0.92, {
      outfit: LUSTIG,
      face: "grin",
      pose: "point_up",
      phase: t * 3,
      dir: 1,
    }, 26, false);
    put(lx - 1.28, 0.92, -3.52, 0.90, {
      outfit: POISSON,
      face: "starry",
      pose: "idle",
      phase: t * 3,
      dir: 1,
    }, 27, false);
    if (f >= F_LIMO) {
      putFx(lx - 2.65, 1.15, -4.4, 0.78, "steam_puff", t * 5);
    }
  } else if (id === 7) {
    // Shot 7: Eager André Poisson beaming on left, suspicious Madame Poisson cleanly in front of table!
    put(-0.78, 0, 1.1, 1.0, {
      outfit: POISSON,
      face: f >= F_POISSON ? "starry" : "grin",
      pose: f >= F_POISSON ? "hands_up" : "idle",
      phase: t * 3,
      dir: 1,
    }, 28);
    put(0.95, 0, 1.1, 0.98, {
      outfit: MME_POISSON,
      face: f >= F_WIFE ? "suspicious" : "skeptic",
      pose: "arms_cross",
      phase: t * 2.5,
      dir: -1,
    }, 29);

    if (f >= F_POISSON && f < F_WIFE + 12) {
      const s = pop(f, F_POISSON, 9);
      putFx(-0.78, 2.52, 1.2, 0.68 * s, "sparkle", t * 4);
    }
    if (f >= F_WIFE) {
      const s = pop(f, F_WIFE, 8);
      putFx(1.55, 2.18, 1.25, 0.76 * s, "suspicion", t * 3);
    }
  } else if (id === 8) {
    // Shot 8: Dusk Crillon velvet alcove — Lustig whispers bribe to Poisson
    const wh = f >= F_WHISPER;
    const br = f >= F_BRIBE;
    put(-0.55 + (wh ? 0.14 : 0), 0, -0.45, 1.0, {
      outfit: LUSTIG,
      face: wh ? "whisper" : "smirk",
      pose: wh ? "whisper_lean" : "idle",
      phase: t * 2.2,
      dir: 1,
    }, 30);
    put(0.62, 0, -0.48, 1.0, {
      outfit: POISSON,
      face: br ? "shock" : "skeptic",
      pose: "idle",
      phase: t * 2.0,
      dir: -1,
    }, 31);
    if (br) {
      const s = pop(f, F_BRIBE, 9);
      putFx(0.05, 2.24, -0.2, 0.72 * s, "coin_glint", t * 4);
    }
  } else if (id === 9) {
    // Shot 9: Tight CU on Poisson realizing "only a real official would ask for a bribe!"
    const sealed = f >= F_SEALS;
    put(0.0, 0, -0.5, 1.04, {
      outfit: POISSON,
      face: sealed ? "grin" : "skeptic",
      pose: sealed ? "present" : "idle",
      phase: t * 3.5,
      dir: 1,
    }, 32);
    if (sealed) {
      const s = pop(f, F_SEALS, 9);
      putFx(-0.78, 2.12, -0.3, 0.68 * s, "sparkle", t * 4);
      putFx(0.78, 2.18, -0.3, 0.68 * s, "sparkle", t * 4 + 1.5);
    }
    if (f >= F_OFFICIAL) {
      const s = pop(f, F_OFFICIAL, 9);
      putFx(0.0, 2.65, -0.3, 0.72 * s, "coin_glint", t * 5);
    }
  } else if (id === 10) {
    // Shot 10: Cash handoff (both actors cleanly centered) -> cut to Vienna Express train escape!
    if (f < F_TRAIN) {
      const paid = f >= F_CASH;
      put(-0.62, 0, 0.0, 0.98, {
        outfit: POISSON,
        face: "grin",
        pose: paid ? "cash_give" : "idle",
        phase: t * 3,
        dir: 1,
        prop: paid ? "none" : "satchel",
      }, 33);
      put(0.62, 0, 0.0, 0.98, {
        outfit: LUSTIG,
        face: paid ? "wink" : "smirk",
        pose: paid ? "cash_take" : "idle",
        phase: t * 3,
        dir: -1,
        prop: paid ? "satchel" : "none",
      }, 34);
      if (paid) {
        const s = pop(f, F_CASH, 8);
        putFx(0.0, 2.15, 0.25, 1.05 * s, "banknotes", t * 5);
      }
    } else {
      const tx = trainXAt(f);
      // Lustig waving cheekily from the Vienna Express passenger carriage window!
      put(tx - 5.4, 1.52, -0.95, 0.92, {
        outfit: LUSTIG,
        face: "grin",
        pose: "wave",
        phase: t * 6,
        dir: 1,
        prop: "satchel",
      }, 35, false);
      // Steam puffs trailing from locomotive smokestack
      for (let i = 0; i < 3; i++) {
        const puffPhase = ((f - F_TRAIN) * 0.08 + i * 0.33) % 1;
        putFx(tx + 4.5 - puffPhase * 5.2, 4.2 + puffPhase * 2.2, -2.2, 1.2 + puffPhase * 1.1, "steam_puff", t * 3 + i);
      }
      putFx(tx - 6.1, 3.35, -0.7, 1.05, "banknotes", t * 6);
    }
  } else if (id === 11) {
    // Shot 11: Deadpan double line — Poisson proudly waving receipt -> crushed by real ministry official & gendarme!
    const bad = f >= F_UNLUCKILY;
    put(-0.52, 0, 0.0, 1.0, {
      outfit: POISSON,
      face: bad ? "shock" : "grin",
      pose: bad ? "idle" : "hold_scroll",
      phase: t * 3,
      dir: 1,
      prop: "scroll",
    }, 36);
    if (!bad && f >= F_RECEIPT) {
      const s = pop(f, F_RECEIPT, 8);
      putFx(-0.35, 2.48, 0.25, 0.84 * s, "wax_scroll");
    }
    if (bad) {
      const u = easeOut((f - F_UNLUCKILY) / 14);
      put(0.85 + (1 - u) * 2.2, 0, 0.1, 1.0, {
        outfit: MINISTER_REAL,
        face: "stern",
        pose: "shoo",
        phase: t * 5,
        dir: -1,
      }, 37);
      put(1.85 + (1 - u) * 2.6, 0, -0.5, 0.96, {
        outfit: GENDARME,
        face: "stern",
        pose: "arms_cross",
        phase: t * 3,
        dir: -1,
      }, 38);
    }
  } else if (id === 12) {
    // Shot 12: Explainer stage — tighter spacing so both figures & props fit inside 9:16 with generous margin!
    const cleanU = clamp01((f - F_CLEAN) / 36);
    put(-2.72 - cleanU * 0.22, 0, 0.2, 0.94, {
      outfit: BUYER,
      face: "skeptic",
      pose: "arms_cross",
      phase: t * 2.5,
      dir: 1,
    }, 39);
    putFx(-1.82, 1.92, -0.25, 0.92, "wax_scroll");
    if (f >= F_CLEAN + 10) {
      putFx(-2.72, 2.52, 0.25, 0.68 * pop(f, F_CLEAN + 10, 8), "suspicion");
    }

    // Right vignette (x = +2.2)
    put(1.52, 0, 0.2, 0.94, {
      outfit: LUSTIG,
      face: "wink",
      pose: "whisper_lean",
      phase: t * 2.5,
      dir: 1,
    }, 40);
    put(2.85, 0, 0.2, 0.94, {
      outfit: BUYER,
      face: f >= F_LOCK ? "sweat" : "grin",
      pose: f >= F_LOCK ? "cover_face" : "idle",
      phase: t * 3,
      dir: -1,
    }, 41);
    if (f >= F_SHADY && f < F_LOCK) {
      putFx(2.2, 2.35, 0.25, 0.65 * pop(f, F_SHADY, 8), "coin_glint", t * 4);
    }
  } else if (id === 13) {
    // Shot 13: Alley watch analogy — both hustler & buyer centered with broken watch & patrolling cop behind!
    const broken = f >= F_BREAKS;
    const copHere = f >= F_COPS - 16;
    put(-0.88, 0, -0.55, 0.96, {
      outfit: HUSTLER,
      face: "smirk",
      pose: broken ? "walk" : "flash_coat",
      phase: t * 5,
      dir: 1,
      prop: f >= F_WATCH && !broken ? "watch" : "none",
    }, 42);
    put(0.82, 0, -0.55, 0.96, {
      outfit: BUYER,
      face: broken ? "sweat" : "grin",
      pose: f >= F_COPS ? "hide_back" : "idle",
      phase: t * 3,
      dir: -1,
    }, 43);

    if (broken) {
      const s = pop(f, F_BREAKS, 8);
      putFx(0.05, 2.25, -0.15, 1.02 * s, "watch_broken", t * 5, Math.sin(t * 14) * 0.12);
    }
    if (copHere) {
      const u = clamp01((f - (F_COPS - 16)) / 52);
      put(-2.2 + u * 4.4, 0, -4.8, 0.94, {
        outfit: GENDARME,
        face: "neutral",
        pose: "walk",
        phase: t * 6.5,
        dir: 1,
      }, 44);
    }
  } else if (id === 14) {
    // Shot 14: Left (Paris bench): ashamed Poisson -> Cut to Right (Vienna cafe): Lustig tossing clean papers & bolting back!
    if (f < F_PAPERS_CUT) {
      put(-6.0, 0, 0.05, 0.96, {
        outfit: POISSON,
        face: "ashamed",
        pose: "cover_face",
        phase: t * 2,
        dir: 1,
      }, 45);
    } else {
      const boltU = easeOut((f - F_AGAIN) / 36);
      put(6.0 + boltU * 1.4, 0, 0.0, 1.0, {
        outfit: LUSTIG,
        face: f >= F_AGAIN ? "grin" : "smirk",
        pose: f >= F_AGAIN ? "run" : "read_paper",
        phase: t * 8,
        dir: 1,
        prop: f >= F_AGAIN ? "briefcase" : "paper",
      }, 46);
      if (f >= F_PAPERS && f < F_AGAIN + 10) {
        putFx(6.0, 2.48, 0.2, 0.72 * pop(f, F_PAPERS, 8), "sparkle", t * 4);
      }
    }
  } else if (id === 15) {
    // Shot 15: Second mark calls police -> gendarmes blow whistles -> Lustig vaults onto America ocean liner!
    const busted = f >= F_POLICE;
    const bolting = f >= F_BOLTS - 8;
    put(-1.65, 0, -0.35, 0.95, {
      outfit: dealer(1),
      face: "stern",
      pose: "present",
      phase: t * 3,
      dir: 1,
    }, 47);
    const copAdvance = busted ? easeOut((f - F_POLICE) / 32) * 1.6 : 0;
    put(-0.55 + copAdvance, 0, 0.2, 0.98, {
      outfit: GENDARME,
      face: "stern",
      pose: busted ? "whistle" : "walk",
      phase: t * 8,
      dir: 1,
      prop: busted ? "whistle" : "none",
    }, 48);
    put(-1.45 + copAdvance * 0.9, 0, 1.05, 0.94, {
      outfit: GENDARME,
      face: "stern",
      pose: "run",
      phase: t * 9 + 1.5,
      dir: 1,
    }, 49);
    if (busted && f < F_BOLTS + 12) {
      putFx(0.45 + copAdvance, 1.82, 0.35, 0.85 * pop(f, F_POLICE, 7), "whistle_blast", t * 6);
    }

    // Lustig dashing up the gangplank onto the ocean liner deck!
    const runU = bolting ? easeOut((f - (F_BOLTS - 8)) / 38) : 0;
    const lx = 1.15 + runU * 4.4;
    const ly = runU > 0.22 ? (runU - 0.22) * 3.1 : 0;
    const lz = 0.0 - runU * 5.8;
    put(lx, ly, lz, 1.02, {
      outfit: LUSTIG,
      face: runU > 0.72 ? "wink" : "grin",
      pose: runU > 0.78 ? "tip_hat" : "run",
      phase: t * 10,
      dir: 1,
      prop: "briefcase",
    }, 50, ly < 0.2);
    if (bolting) {
      putFx(6.2, 8.6, -8.8, 1.5, "steam_puff", t * 3);
    }
  } else if (id === 16) {
    // Shot 16: Alcatraz counterfeiting bars at x=-20 -> Golden sunset full-spire Eiffel finale ("apprentice salesman")!
    if (f < F_SALESMAN_CUT) {
      const caught = f >= F_CAUGHT;
      put(-20.0, 0, 0.0, 1.0, {
        outfit: LUSTIG_PRISON,
        face: caught ? "smirk" : "shock",
        pose: caught ? "idle" : "hands_up",
        phase: t * 2.5,
        dir: 1,
      }, 51);
      put(-18.4, 0, 0.75, 0.95, {
        outfit: AGENT,
        face: "stern",
        pose: "arms_cross",
        phase: t * 2.2,
        dir: -1,
      }, 52);
      putFx(-20.0, 2.25, 0.55, 1.0, "banknotes", t * 3.5);
    } else {
      const finalBow = f >= F_SALESMAN;
      put(0.0, 0, 2.2, 1.06, {
        outfit: LUSTIG,
        face: finalBow ? "wink" : "grin",
        pose: finalBow ? "tip_hat" : "present",
        phase: t * 2.6,
        dir: 1,
        prop: "medal",
      }, 53);
      if (finalBow) {
        const s = pop(f, F_SALESMAN, 10);
        putFx(0.88, 2.30, 2.45, 0.85 * s, "sparkle", t * 4);
        putFx(-0.88, 2.15, 2.45, 0.65 * s, "sparkle", t * 4 + 1.8);
      }
    }
  }
}
