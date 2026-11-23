// Modular hand-painted 3D sets for "The Man Who Sold the Eiffel Tower" (Paris & Vienna, 1925).
// All world materials use twoTone() for crisp cel-shaded sunlight + cool violet-blue shadows,
// with zero readable text anywhere in the 3D world.
import * as THREE from "three";
import { twoTone } from "./shade";
import { NOINK } from "./ink";
import type { SetId } from "./story";
import {
  cobbleHD, gravelHD, grassHD, eiffelIronHD, haussmannHD,
  crillonWallHD, parquetHD, awningHD, brickHD, checkerHD, waterHD, planksHD, rep,
} from "./paint";

export type DynProps = {
  limo: THREE.Group;
  limoWheels: THREE.Mesh[];
  paintBucket: THREE.Group;
  waxStamp: THREE.Group;
  miniTower: THREE.Group;
  train: THREE.Group;
  trainWheels: THREE.Mesh[];
  padlock: THREE.Group;
  padlockShackle: THREE.Mesh;
  newsStack: THREE.Group;
  liner: THREE.Group;
  jailBars: THREE.Group;
};

export type BuiltSets = {
  groups: Record<SetId, THREE.Group>;
  dyn: DynProps;
};

const mat = (col: THREE.ColorRepresentation, map?: THREE.Texture, liftK = 1) =>
  twoTone(new THREE.MeshLambertMaterial({ color: col, map: map || null }), liftK);

const unlit = (col: THREE.ColorRepresentation) =>
  new THREE.MeshBasicMaterial({ color: col });

function box(w: number, h: number, d: number, m: THREE.Material, x = 0, y = 0, z = 0) {
  const mesh = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), m);
  mesh.position.set(x, y, z);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  return mesh;
}

function cyl(rt: number, rb: number, h: number, segs: number, m: THREE.Material, x = 0, y = 0, z = 0) {
  const mesh = new THREE.Mesh(new THREE.CylinderGeometry(rt, rb, h, segs), m);
  mesh.position.set(x, y, z);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  return mesh;
}

/** Add a straight iron strut between two 3D points */
function strut(a: THREE.Vector3, b: THREE.Vector3, thick: number, m: THREE.Material) {
  const dir = new THREE.Vector3().subVectors(b, a);
  const len = dir.length();
  const mesh = new THREE.Mesh(new THREE.BoxGeometry(thick, len, thick), m);
  mesh.position.copy(a).add(b).multiplyScalar(0.5);
  mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir.normalize());
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  return mesh;
}

/**
 * Iconic 3D Eiffel Tower builder — unmistakable curved 4-leg silhouette,
 * riveted semicircular base arches, 3 observation decks, X-braced lattice, and spire.
 * Total height ~37.5 * scale units.
 */
function buildEiffelTower(scale = 1, rusty = false, goldMini = false): THREE.Group {
  const g = new THREE.Group();
  const ironTex = eiffelIronHD(rusty ? "eiffelRust" : "eiffelClean", rusty);
  const mMain = goldMini
    ? mat("#c89b42", undefined, 0.9)
    : mat("#ffffff", rep(ironTex, 2, 4), 0.95);
  const mDark = goldMini
    ? mat("#9a7228", undefined, 0.8)
    : mat(rusty ? "#593b2e" : "#4a3b32", undefined, 0.85);
  const mDeck = goldMini
    ? mat("#ddb358", undefined, 0.95)
    : mat(rusty ? "#7d5b49" : "#786254", undefined, 0.95);
  const mRust = mat("#b45528", undefined, 0.9);

  // Leg spine profile: [height y, half-span r, leg thickness]
  const levels: [number, number, number][] = [
    [0.0, 6.2, 1.45],
    [3.8, 4.9, 1.25],
    [7.8, 3.6, 1.05],
    [11.8, 2.55, 0.85],
    [15.6, 1.85, 0.70],
    [21.0, 1.25, 0.54],
    [26.5, 0.88, 0.42],
    [31.8, 0.62, 0.34],
  ];
  const corners: [number, number][] = [[-1, -1], [1, -1], [1, 1], [-1, 1]];

  // 4 curved tapered legs + horizontal collars + diagonal X-bracing
  for (let i = 0; i < levels.length - 1; i++) {
    const [y0, r0, t0] = levels[i];
    const [y1, r1, t1] = levels[i + 1];
    const tm = (t0 + t1) * 0.5;
    for (let c = 0; c < 4; c++) {
      const [sx, sz] = corners[c];
      const p0 = new THREE.Vector3(sx * r0, y0, sz * r0);
      const p1 = new THREE.Vector3(sx * r1, y1, sz * r1);
      g.add(strut(p0, p1, tm, mMain));

      // Masonry pedestal feet at ground level
      if (i === 0 && !goldMini) {
        g.add(box(2.2, 0.75, 2.2, mat("#c6ba9e"), sx * r0, 0.37, sz * r0));
      }

      // Cross-bracing above 1st deck (i >= 2)
      if (i >= 2) {
        const [nx, nz] = corners[(c + 1) % 4];
        const q0 = new THREE.Vector3(nx * r0, y0, nz * r0);
        const q1 = new THREE.Vector3(nx * r1, y1, nz * r1);
        const bt = Math.max(0.14, tm * 0.34);
        g.add(strut(p0, q1, bt, mDark));
        g.add(strut(q0, p1, bt, mDark));
        g.add(strut(p1, q1, bt * 1.15, mDark));
      }
    }
  }

  // Semicircular ornamental arches anchored cleanly into the 4 curved piers (y=1.2..6.2)
  for (let side = 0; side < 4; side++) {
    const archGroup = new THREE.Group();
    const segs = 12;
    const rad = 5.15;
    const cy = 1.65;
    for (let k = 0; k < segs; k++) {
      const a0 = (k / segs) * Math.PI;
      const a1 = ((k + 1) / segs) * Math.PI;
      const p0 = new THREE.Vector3(Math.cos(a0) * rad, cy + Math.sin(a0) * 4.35, 0);
      const p1 = new THREE.Vector3(Math.cos(a1) * rad, cy + Math.sin(a1) * 4.35, 0);
      archGroup.add(strut(p0, p1, 0.44, mDark));
    }
    const ang = (side * Math.PI) / 2;
    archGroup.rotation.y = ang;
    archGroup.position.set(Math.sin(ang) * 4.85, 0, Math.cos(ang) * 4.85);
    g.add(archGroup);
  }

  // First observation deck (y = 7.9)
  g.add(box(9.0, 0.85, 9.0, mDeck, 0, 7.9, 0));
  g.add(box(9.5, 0.35, 9.5, mDark, 0, 8.5, 0));
  g.add(box(7.8, 0.45, 7.8, mMain, 0, 7.35, 0));

  // Second observation deck (y = 15.7)
  g.add(box(5.0, 0.75, 5.0, mDeck, 0, 15.7, 0));
  g.add(box(5.4, 0.30, 5.4, mDark, 0, 16.22, 0));

  // Third observation cupola + spire (y = 31.8..38.0)
  g.add(box(2.15, 0.85, 2.15, mDeck, 0, 32.0, 0));
  g.add(cyl(0.55, 0.95, 1.3, 8, mMain, 0, 33.1, 0));
  g.add(cyl(0.28, 0.55, 1.0, 8, mDark, 0, 34.2, 0));
  g.add(cyl(0.06, 0.22, 3.4, 8, mDark, 0, 36.3, 0));

  // Optional extra rust accents for Shot 2 / plaza realism
  if (rusty) {
    const spots: [number, number, number, number][] = [
      [-5.1, 2.8, 5.1, 0.9], [4.9, 3.6, 4.9, 0.8], [-4.2, 5.6, 4.2, 0.85],
      [3.8, 6.2, 3.8, 0.75], [-3.2, 8.2, 3.2, 0.95], [2.8, 10.5, 2.8, 0.7],
    ];
    for (const [rx, ry, rz, rs] of spots) {
      g.add(box(rs, rs * 0.75, rs, mRust, rx, ry, rz));
    }
  }

  g.scale.setScalar(scale);
  return g;
}

/** Parisian Haussmann apartment building with slate mansard roof & chimneys */
function buildHaussmann(w: number, h: number, d: number, tint = "#dfd2bc"): THREE.Group {
  const g = new THREE.Group();
  const facTex = rep(haussmannHD(`hauss_${tint}`, tint), Math.max(1, Math.round(w / 6)), Math.max(1, Math.round(h / 7)));
  g.add(box(w, h, d, mat("#ffffff", facTex), 0, h * 0.5, 0));
  // Ground floor stone plinth + cornice
  g.add(box(w + 0.3, 0.55, d + 0.3, mat("#c4b69e"), 0, 0.27, 0));
  g.add(box(w + 0.5, 0.45, d + 0.5, mat("#d6cab4"), 0, h, 0));
  // Mansard slate roof (tapered frustum)
  const mansard = new THREE.Mesh(
    new THREE.CylinderGeometry(Math.min(w, d) * 0.56, Math.min(w, d) * 0.72, 2.4, 4),
    mat("#465063")
  );
  mansard.rotation.y = Math.PI / 4;
  mansard.scale.set(w / Math.min(w, d), 1, d / Math.min(w, d));
  mansard.position.y = h + 1.25;
  mansard.castShadow = true;
  g.add(mansard);
  // Chimneys + terracotta pots
  for (const cx of [-w * 0.28, w * 0.28]) {
    g.add(box(0.85, 1.5, 0.75, mat("#c9b59c"), cx, h + 2.4, 0));
    g.add(cyl(0.14, 0.17, 0.48, 8, mat("#b55c42"), cx - 0.18, h + 3.3, 0));
    g.add(cyl(0.14, 0.17, 0.48, 8, mat("#b55c42"), cx + 0.18, h + 3.3, 0));
  }
  return g;
}

/** Stylized Parisian cast-iron streetlamp with optional warm bloom globe */
function buildStreetLamp(lit = false): THREE.Group {
  const g = new THREE.Group();
  const mIron = mat("#2b3834");
  g.add(cyl(0.14, 0.22, 0.75, 8, mIron, 0, 0.37, 0));
  g.add(cyl(0.06, 0.10, 3.2, 8, mIron, 0, 2.3, 0));
  g.add(cyl(0.26, 0.14, 0.18, 8, mIron, 0, 3.92, 0));
  const globe = new THREE.Mesh(
    new THREE.SphereGeometry(0.24, 12, 10),
    lit ? unlit(new THREE.Color(2.4, 1.9, 1.0)) : mat("#f4eed8")
  );
  globe.position.y = 4.18;
  if (lit) globe.layers.set(NOINK);
  g.add(globe);
  g.add(cyl(0.05, 0.28, 0.24, 8, mIron, 0, 4.48, 0));
  return g;
}

/** Stylized Parisian park bench */
function buildBench(): THREE.Group {
  const g = new THREE.Group();
  const mWood = mat("#8a5834");
  const mIron = mat("#2c3832");
  g.add(box(2.1, 0.10, 0.55, mWood, 0, 0.48, 0));
  g.add(box(2.1, 0.46, 0.08, mWood, 0, 0.82, -0.24));
  for (const sx of [-0.85, 0.85]) {
    g.add(box(0.09, 0.52, 0.54, mIron, sx, 0.26, 0));
    g.add(box(0.09, 0.45, 0.08, mIron, sx, 0.74, -0.24));
  }
  return g;
}

/** Stylized leafy Parisian chestnut tree */
function buildTree(scale = 1, tint = "#4e8c44"): THREE.Group {
  const g = new THREE.Group();
  g.add(cyl(0.18, 0.28, 2.6, 8, mat("#6b4c35"), 0, 1.3, 0));
  const mLeaf = mat(tint);
  const blobs: [number, number, number, number][] = [
    [0, 3.4, 0, 1.35], [-0.85, 2.95, 0.3, 0.95], [0.85, 3.0, -0.25, 0.98],
    [0.2, 3.9, 0.45, 0.88], [-0.35, 3.85, -0.5, 0.9],
  ];
  for (const [x, y, z, r] of blobs) {
    const sp = new THREE.Mesh(new THREE.IcosahedronGeometry(r, 1), mLeaf);
    sp.position.set(x, y, z);
    sp.castShadow = true;
    sp.receiveShadow = true;
    g.add(sp);
  }
  g.scale.setScalar(scale);
  return g;
}

/** Round Parisian marble bistro table + espresso cup */
function buildBistroTable(): THREE.Group {
  const g = new THREE.Group();
  g.add(cyl(0.32, 0.42, 0.08, 12, mat("#2d3236"), 0, 0.04, 0));
  g.add(cyl(0.055, 0.075, 0.78, 10, mat("#2d3236"), 0, 0.44, 0));
  g.add(cyl(0.58, 0.58, 0.06, 18, mat("#f2ece0"), 0, 0.85, 0));
  g.add(cyl(0.60, 0.60, 0.03, 18, mat("#c9a24c"), 0, 0.835, 0));
  // Espresso saucer & cup
  g.add(cyl(0.11, 0.08, 0.02, 12, mat("#ffffff"), 0.22, 0.89, 0.14));
  g.add(cyl(0.065, 0.05, 0.09, 12, mat("#ffffff"), 0.22, 0.94, 0.14));
  g.add(cyl(0.055, 0.055, 0.01, 10, mat("#3a2214"), 0.22, 0.985, 0.14));
  return g;
}

/** 1925 black touring limousine with brass headlamps & rotating wheels */
function buildLimo(): { group: THREE.Group; wheels: THREE.Mesh[] } {
  const g = new THREE.Group();
  const mBody = mat("#232732");
  const mTrim = mat("#c9a042");
  const mRoof = mat("#363b48");
  const mGlass = mat("#9dc3e6");
  const mTire = mat("#1f2024");
  const mHub = mat("#e3d6ba");

  // Chassis + hood + passenger cabin
  g.add(box(4.8, 0.45, 1.75, mBody, 0, 0.58, 0));
  g.add(box(1.7, 0.68, 1.38, mBody, 1.35, 1.05, 0)); // long hood
  g.add(box(0.12, 0.72, 1.16, mTrim, 2.24, 1.05, 0)); // brass radiator grille
  g.add(box(2.55, 1.25, 1.66, mBody, -0.68, 1.38, 0)); // cabin
  g.add(box(2.68, 0.14, 1.74, mRoof, -0.68, 2.04, 0)); // roof
  // Side windows
  g.add(box(2.05, 0.52, 1.70, mGlass, -0.68, 1.56, 0));
  g.add(box(0.08, 0.52, 1.45, mGlass, 0.56, 1.56, 0));
  // Fenders & running boards
  g.add(box(2.2, 0.10, 2.02, mBody, 0, 0.44, 0));
  // Brass headlamps
  for (const lz of [-0.52, 0.52]) {
    const lamp = cyl(0.13, 0.11, 0.18, 10, mTrim, 2.32, 0.96, lz);
    lamp.rotation.z = Math.PI / 2;
    g.add(lamp);
  }
  const wheels: THREE.Mesh[] = [];
  for (const [wx, wz] of [[-1.55, 0.92], [-1.55, -0.92], [1.55, 0.92], [1.55, -0.92]]) {
    const w = new THREE.Mesh(new THREE.CylinderGeometry(0.42, 0.42, 0.22, 16), mTire);
    w.rotation.x = Math.PI / 2;
    w.position.set(wx, 0.42, wz);
    w.castShadow = true;
    const hub = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.24, 0.25, 12), mHub);
    w.add(hub);
    g.add(w);
    wheels.push(w);
  }
  return { group: g, wheels };
}

/** 1925 Vienna Express forest-green & gold steam locomotive + passenger coach */
function buildTrain(): { group: THREE.Group; wheels: THREE.Mesh[] } {
  const g = new THREE.Group();
  const mGreen = mat("#26523c");
  const mDark = mat("#252830");
  const mBrass = mat("#d4a846");
  const mRed = mat("#9e2c2a");
  const mCoach = mat("#325874");
  const mWood = mat("#8c5a32");
  const mWin = unlit(new THREE.Color(1.4, 1.15, 0.65));

  // Locomotive chassis & boiler
  g.add(box(6.4, 0.55, 2.2, mDark, 2.2, 0.95, 0));
  const boiler = cyl(0.95, 0.95, 4.2, 16, mGreen, 3.2, 2.05, 0);
  boiler.rotation.z = Math.PI / 2;
  g.add(boiler);
  // Brass boiler bands & smokestack & dome
  for (const bx of [1.8, 3.0, 4.2]) {
    const band = cyl(0.98, 0.98, 0.14, 16, mBrass, bx, 2.05, 0);
    band.rotation.z = Math.PI / 2;
    g.add(band);
  }
  g.add(cyl(0.32, 0.24, 1.15, 12, mDark, 4.65, 3.35, 0)); // smokestack
  g.add(cyl(0.42, 0.46, 0.55, 12, mBrass, 3.1, 3.1, 0)); // steam dome
  // Cab
  g.add(box(2.1, 2.55, 2.28, mGreen, 0.15, 2.42, 0));
  g.add(box(2.35, 0.18, 2.45, mDark, 0.15, 3.74, 0));
  // Cowcatcher + front headlamp
  const cow = new THREE.Mesh(new THREE.ConeGeometry(0.9, 1.2, 4), mRed);
  cow.rotation.z = -Math.PI / 2;
  cow.rotation.x = Math.PI / 4;
  cow.position.set(5.75, 0.72, 0);
  g.add(cow);
  const hl = cyl(0.24, 0.24, 0.2, 12, mWin, 5.42, 2.45, 0);
  hl.rotation.z = Math.PI / 2;
  hl.layers.set(NOINK);
  g.add(hl);

  // Passenger coach behind locomotive (x = -5.6)
  g.add(box(8.2, 0.45, 2.2, mDark, -5.8, 0.85, 0));
  g.add(box(8.0, 2.35, 2.26, mCoach, -5.8, 2.22, 0));
  g.add(box(8.25, 0.16, 2.34, mBrass, -5.8, 1.32, 0));
  g.add(box(8.25, 0.26, 2.44, mDark, -5.8, 3.48, 0));
  // Glowing coach windows (center open window for Lustig waving!)
  for (let i = 0; i < 5; i++) {
    const wx = -8.6 + i * 1.4;
    const win = box(0.92, 0.86, 2.32, i === 2 ? mWood : mWin, wx, 2.48, 0);
    if (i !== 2) win.layers.set(NOINK);
    g.add(win);
  }

  const wheels: THREE.Mesh[] = [];
  const wheelXs = [-8.6, -7.2, -4.4, -3.0, 0.2, 1.7, 3.2, 4.7];
  for (const wx of wheelXs) {
    const r = wx > 0 ? 0.58 : 0.44;
    for (const wz of [-1.14, 1.14]) {
      const w = new THREE.Mesh(new THREE.CylinderGeometry(r, r, 0.18, 14), mRed);
      w.rotation.x = Math.PI / 2;
      w.position.set(wx, r + 0.08, wz);
      const rim = new THREE.Mesh(new THREE.CylinderGeometry(r * 0.55, r * 0.55, 0.21, 10), mBrass);
      w.add(rim);
      g.add(w);
      wheels.push(w);
    }
  }
  return { group: g, wheels };
}

/** Build all modular 3D sets and return visibility groups + animated prop handles */
export function buildAllSets(root: THREE.Group): BuiltSets {
  const groups = {} as Record<SetId, THREE.Group>;
  const makeSet = (id: SetId) => {
    const g = new THREE.Group();
    g.visible = false;
    groups[id] = g;
    root.add(g);
    return g;
  };

  const gravTex = gravelHD();
  const grassTex = grassHD();
  const cobTex = cobbleHD();
  const parqTex = parquetHD();
  const crilTex = crillonWallHD();
  const brickTex = brickHD();
  const woodTex = planksHD();

  // ---------------- 1. PLAZA (Champ de Mars & Hero Eiffel Tower — Shots 1, 6, 11) ----------------
  const plaza = makeSet("plaza");
  plaza.add(box(140, 0.4, 140, mat("#ffffff", rep(gravTex, 26, 26)), 0, -0.2, -16));
  // Flanking manicured green lawns
  for (const sx of [-1, 1]) {
    plaza.add(box(24, 0.12, 80, mat("#ffffff", rep(grassTex, 6, 18)), sx * 19.5, 0.04, -14));
    // Low stone curb bordering promenade
    plaza.add(box(0.45, 0.26, 80, mat("#d0c6b2"), sx * 7.6, 0.13, -14));
    // Streetlamps & chestnut trees lining the avenue
    for (const tz of [-34, -22, -10, 2, 14]) {
      const lamp = buildStreetLamp(false);
      lamp.position.set(sx * 7.9, 0, tz);
      plaza.add(lamp);
      const tr = buildTree(1.05, tz % 4 === 0 ? "#539447" : "#498440");
      tr.position.set(sx * 11.4, 0, tz + 3);
      plaza.add(tr);
    }
    // Haussmann Parisian buildings framing left & right skyline
    const b1 = buildHaussmann(12, 13, 10, sx < 0 ? "#e2d4bc" : "#d8cab0");
    b1.position.set(sx * 26, 0, -18);
    plaza.add(b1);
    const b2 = buildHaussmann(14, 15, 11, sx < 0 ? "#d9c8ae" : "#e4d7c2");
    b2.position.set(sx * 28, 0, -34);
    plaza.add(b2);
  }
  // Distant Paris skyline behind the tower
  for (let i = -3; i <= 3; i++) {
    const bg = buildHaussmann(13, 10 + (Math.abs(i) % 3) * 2.5, 9, i % 2 ? "#d9ccb8" : "#e3d8c4");
    bg.position.set(i * 15, 0, -56);
    plaza.add(bg);
  }
  // Hero 3D Eiffel Tower centered on the Champ de Mars (positioned so full spire frames in 9:16!)
  const heroTower = buildEiffelTower(0.96, false, false);
  heroTower.position.set(0, 0, -27.5);
  plaza.add(heroTower);
  // Dynamic limousine (shown in Shot 6)
  const limoObj = buildLimo();
  limoObj.group.position.set(-10, 0, -4.5);
  limoObj.group.visible = false;
  plaza.add(limoObj.group);

  // ---------------- 2. TOWER_CLOSE (Rusty Eiffel base + scaffold — Shot 2) ----------------
  const tclose = makeSet("tower_close");
  tclose.add(box(120, 0.4, 120, mat("#ffffff", rep(cobTex, 26, 26)), 0, -0.2, -10));
  const rustyTower = buildEiffelTower(1.25, true, false);
  rustyTower.position.set(3.8, 0, -9.2); // one massive riveted leg right in front of camera!
  tclose.add(rustyTower);
  // Wooden painter's scaffold beside the leg
  const scaff = new THREE.Group();
  scaff.position.set(1.0, 0, -2.5);
  const mScaff = mat("#ffffff", rep(woodTex, 2, 1));
  const mPole = mat("#5a4430");
  for (const [px, pz] of [[-1.1, -0.5], [1.1, -0.5], [-1.1, 0.5], [1.1, 0.5]]) {
    scaff.add(cyl(0.06, 0.06, 4.2, 8, mPole, px, 2.1, pz));
  }
  scaff.add(box(2.5, 0.14, 1.25, mScaff, 0, 2.4, 0));
  scaff.add(box(2.5, 0.10, 0.08, mPole, 0, 3.25, -0.5));
  // Ladder rungs
  for (let ly = 0.4; ly <= 2.3; ly += 0.42) {
    scaff.add(box(0.55, 0.06, 0.06, mPole, -1.1, ly, 0));
  }
  tclose.add(scaff);
  // Tipping paint bucket + spilled orange-brown paint puddle
  const paintBucket = new THREE.Group();
  paintBucket.position.set(1.4, 2.55, -2.2);
  paintBucket.add(cyl(0.24, 0.20, 0.42, 12, mat("#9ca6b0"), 0, 0.21, 0));
  paintBucket.add(cyl(0.22, 0.22, 0.05, 12, mat("#c96c38"), 0, 0.42, 0));
  tclose.add(paintBucket);
  // Background buildings
  for (const sx of [-1, 1]) {
    const b = buildHaussmann(14, 13, 10, "#dfd2bc");
    b.position.set(sx * 20, 0, -26);
    tclose.add(b);
  }

  // ---------------- 3. CAFE (Parisian sidewalk café terrace — Shot 3) ----------------
  const cafe = makeSet("cafe");
  cafe.add(box(120, 0.4, 120, mat("#ffffff", rep(cobTex, 28, 28)), 0, -0.2, -10));
  // Café storefront on the left-back (clear of camera!)
  const store = buildHaussmann(12, 12, 8, "#e6d8be");
  store.position.set(-7.8, 0, -5.5);
  cafe.add(store);
  // Red-and-cream striped café awning jutting out over the terrace
  const awn = box(8.2, 0.14, 3.4, mat("#ffffff", rep(awningHD("awnRed", "#b53634"), 2, 1)), -3.6, 3.5, -2.2);
  awn.rotation.x = 0.28;
  cafe.add(awn);
  // Bistro table right in front of Lustig
  const bTable = buildBistroTable();
  bTable.position.set(0.0, 0, 0.95);
  cafe.add(bTable);
  const bTable2 = buildBistroTable();
  bTable2.position.set(-2.5, 0, -1.0);
  cafe.add(bTable2);
  // Cast-iron lamp & trees along the street
  const cLamp = buildStreetLamp(false);
  cLamp.position.set(3.1, 0, -3.4);
  cafe.add(cLamp);
  const cTree = buildTree(1.0, "#509044");
  cTree.position.set(6.8, 0, -8.5);
  cafe.add(cTree);
  // Eiffel Tower rising unmistakably in the sunny Paris distance!
  const cafeTower = buildEiffelTower(0.95, false, false);
  cafeTower.position.set(2.2, 0, -36);
  cafe.add(cafeTower);
  const bgHouse = buildHaussmann(13, 11, 9, "#dcd0bc");
  bgHouse.position.set(13.5, 0, -22);
  cafe.add(bgHouse);

  // ---------------- 4. HOTEL_SALON (Hôtel de Crillon Luxury Suite — Shots 4, 5, 7) ----------------
  const salon = makeSet("hotel_salon");
  // Floor & walls (open on +Z side so cameras never clip walls!)
  salon.add(box(20, 0.3, 18, mat("#ffffff", rep(parqTex, 6, 6)), 0, -0.15, -2));
  // Rich ruby-and-gold Persian carpet in center
  salon.add(box(8.8, 0.04, 7.6, mat("#8e2a30"), 0, 0.02, -1.2));
  salon.add(box(8.2, 0.045, 7.0, mat("#c9a24b"), 0, 0.022, -1.2));
  salon.add(box(7.8, 0.05, 6.6, mat("#9e3238"), 0, 0.025, -1.2));
  // Back wall with tall central window opening revealing Paris sky + distant Eiffel Tower!
  const wallMat = mat("#ffffff", rep(crilTex, 2, 1));
  salon.add(box(6.5, 7.2, 0.45, wallMat, -6.2, 3.6, -7.4));
  salon.add(box(6.5, 7.2, 0.45, wallMat, 6.2, 3.6, -7.4));
  salon.add(box(6.2, 1.5, 0.45, wallMat, 0, 6.45, -7.4));
  salon.add(box(6.2, 1.0, 0.45, wallMat, 0, 0.5, -7.4));
  // Side walls
  salon.add(box(0.45, 7.2, 18, mat("#ffffff", rep(crilTex, 4, 1)), -9.2, 3.6, -1));
  salon.add(box(0.45, 7.2, 18, mat("#ffffff", rep(crilTex, 4, 1)), 9.2, 3.6, -1));
  // Ceiling + gilded crown molding
  salon.add(box(19, 0.3, 18, mat("#f2eadc"), 0, 7.25, -1));
  // Ruby velvet curtains framing the grand window
  const mVelvet = mat("#8b222c");
  for (const cx of [-3.1, 3.1]) {
    salon.add(cyl(0.42, 0.48, 5.8, 12, mVelvet, cx, 3.2, -7.05));
  }
  salon.add(box(6.9, 0.55, 0.5, mVelvet, 0, 5.85, -7.0));
  salon.add(box(7.1, 0.14, 0.55, mat("#d4ae4e"), 0, 6.1, -6.95));
  // Distant Eiffel Tower framed nicely outside the Crillon window!
  const winTower = buildEiffelTower(0.85, false, false);
  winTower.position.set(0.4, -3.0, -44);
  salon.add(winTower);
  // Crystal-and-gold chandelier overhead
  const chand = new THREE.Group();
  chand.position.set(0, 5.4, -1.6);
  chand.add(cyl(0.06, 0.06, 1.8, 8, mat("#d4a846"), 0, 0.9, 0));
  chand.add(cyl(0.95, 0.55, 0.35, 14, mat("#d4a846"), 0, 0, 0));
  for (let i = 0; i < 6; i++) {
    const a = (i / 6) * Math.PI * 2;
    const bulb = new THREE.Mesh(new THREE.SphereGeometry(0.14, 10, 8), unlit(new THREE.Color(2.2, 1.85, 1.1)));
    bulb.position.set(Math.cos(a) * 0.88, 0.25, Math.sin(a) * 0.88);
    bulb.layers.set(NOINK);
    chand.add(bulb);
  }
  salon.add(chand);
  // Grand mahogany conference table (cleanly back at z=-1.65 so front characters never clip it!)
  const mMahog = mat("#592c1c");
  salon.add(box(4.8, 0.16, 1.35, mMahog, 0, 0.92, -1.65));
  for (const [lx, lz] of [[-2.0, -0.5], [2.0, -0.5], [-2.0, 0.5], [2.0, 0.5]]) {
    salon.add(box(0.18, 0.9, 0.18, mMahog, lx, 0.45, -1.65 + lz));
  }
  // Cream stationery sheet + red wax seal + dynamic brass stamp (Shot 4)
  salon.add(box(0.75, 0.02, 0.55, mat("#f8f0dc"), 0.0, 1.01, -1.22));
  salon.add(cyl(0.11, 0.11, 0.025, 14, mat("#b82428"), 0.08, 1.025, -1.18));
  const waxStamp = new THREE.Group();
  waxStamp.position.set(0.08, 1.06, -1.18);
  waxStamp.add(cyl(0.12, 0.14, 0.10, 12, mat("#d4a842"), 0, 0.05, 0));
  waxStamp.add(cyl(0.06, 0.09, 0.34, 10, mat("#6b2a1c"), 0, 0.27, 0));
  salon.add(waxStamp);
  // Miniature gleaming brass Eiffel Tower model offset cleanly to x=+0.95 beside Lustig (Shot 5)
  const miniTower = buildEiffelTower(0.038, false, true);
  miniTower.position.set(0.95, 1.0, -1.65);
  salon.add(miniTower);

  // ---------------- 5. HOTEL_ALCOVE (Dusk velvet bribe alcove — Shots 8, 9) ----------------
  const alcove = makeSet("hotel_alcove");
  alcove.add(box(14, 0.3, 12, mat("#ffffff", rep(parqTex, 4, 4)), 0, -0.15, -1));
  alcove.add(box(6.4, 0.04, 5.4, mat("#7a222b"), 0, 0.02, -0.6));
  alcove.add(box(4.6, 6.8, 0.4, wallMat, -4.4, 3.4, -4.5));
  alcove.add(box(4.6, 6.8, 0.4, wallMat, 4.4, 3.4, -4.5));
  alcove.add(box(4.6, 1.2, 0.4, wallMat, 0, 6.2, -4.5));
  alcove.add(box(4.6, 0.9, 0.4, wallMat, 0, 0.45, -4.5));
  alcove.add(box(0.4, 6.8, 12, wallMat, -6.5, 3.4, -1));
  alcove.add(box(0.4, 6.8, 12, wallMat, 6.5, 3.4, -1));
  alcove.add(box(13.5, 0.3, 12, mat("#ece2d0"), 0, 6.85, -1));
  // Heavy velvet drapes framing twilight Eiffel outside
  for (const cx of [-2.2, 2.2]) alcove.add(cyl(0.44, 0.50, 5.5, 12, mVelvet, cx, 3.0, -4.15));
  alcove.add(box(5.0, 0.55, 0.5, mVelvet, 0, 5.65, -4.1));
  const alcTower = buildEiffelTower(0.75, false, false);
  alcTower.position.set(0.0, -2.5, -36);
  alcove.add(alcTower);
  // Warm glowing brass floor lamp on left
  alcove.add(cyl(0.28, 0.32, 0.08, 12, mat("#c9a042"), -2.1, 0.04, -2.2));
  alcove.add(cyl(0.04, 0.05, 2.2, 10, mat("#c9a042"), -2.1, 1.15, -2.2));
  const shadeGlow = cyl(0.26, 0.42, 0.45, 14, unlit(new THREE.Color(1.9, 1.45, 0.82)), -2.1, 2.35, -2.2);
  shadeGlow.layers.set(NOINK);
  alcove.add(shadeGlow);

  // ---------------- 6. TRAIN_ESCAPE (Golden Paris station & Vienna Express — Shot 10) ----------------
  const trainSet = makeSet("train_escape");
  // Rolling golden meadow ground + ballast rail bed
  trainSet.add(box(160, 0.4, 120, mat("#ffffff", rep(grassTex, 30, 22)), 0, -0.2, -16));
  trainSet.add(box(140, 0.16, 4.6, mat("#8b7f70"), 0, 0.06, -2.2));
  // Platform apron in foreground for cash handoff (z = 0..4)
  trainSet.add(box(16, 0.34, 4.2, mat("#ffffff", rep(cobTex, 4, 2)), 0, 0.17, 1.8));
  // Steel rails & wooden sleepers
  for (let rx = -34; rx <= 38; rx += 1.15) {
    trainSet.add(box(0.24, 0.08, 2.6, mat("#5e422a"), rx, 0.15, -2.2));
  }
  trainSet.add(box(80, 0.10, 0.12, mat("#525864"), 0, 0.22, -3.15));
  trainSet.add(box(80, 0.10, 0.12, mat("#525864"), 0, 0.22, -1.25));
  // Trees & hills in background
  for (let i = -5; i <= 6; i++) {
    const t = buildTree(1.1 + (Math.abs(i) % 3) * 0.22, i % 2 ? "#4c843c" : "#5c9244");
    t.position.set(i * 7.5, 0, -11.5 - (Math.abs(i) % 3) * 3.5);
    trainSet.add(t);
  }
  // Distant Eiffel silhouette left behind as Lustig escapes east!
  const byeTower = buildEiffelTower(0.75, false, false);
  byeTower.position.set(-18, 0, -42);
  trainSet.add(byeTower);
  // Dynamic Vienna Express train
  const trainObj = buildTrain();
  trainObj.group.position.set(-14, 0.22, -2.2);
  trainSet.add(trainObj.group);

  // ---------------- 7. EXPLAINER (Cool blue theatrical stage — Shot 12) ----------------
  const explainer = makeSet("explainer");
  explainer.add(box(60, 0.4, 60, mat("#ffffff", rep(checkerHD(), 10, 10)), 0, -0.2, 0));
  // Backdrop colonnade pillars
  for (let i = -3; i <= 3; i++) {
    explainer.add(cyl(0.45, 0.52, 8.5, 12, mat("#36486e"), i * 3.8, 4.25, -7.2));
  }
  explainer.add(box(28, 0.8, 1.2, mat("#2e3e62"), 0, 8.6, -7.2));
  // Left velvet pedestal (clean deal)
  explainer.add(cyl(0.65, 0.78, 1.15, 14, mat("#465d8c"), -2.2, 0.57, -0.35));
  explainer.add(cyl(0.62, 0.62, 0.08, 14, mat("#a8343a"), -2.2, 1.18, -0.35));
  // Right velvet pedestal + animated brass padlock (shady shortcut)
  explainer.add(cyl(0.65, 0.78, 1.15, 14, mat("#465d8c"), 2.2, 0.57, -0.35));
  const padlock = new THREE.Group();
  padlock.position.set(2.2, 2.25, 0.55);
  padlock.add(box(0.85, 0.74, 0.26, mat("#d4a43e"), 0, 0, 0));
  padlock.add(cyl(0.11, 0.11, 0.28, 10, mat("#241b26"), 0, 0.06, 0));
  padlock.add(box(0.10, 0.22, 0.28, mat("#241b26"), 0, -0.10, 0));
  const padlockShackle = new THREE.Mesh(new THREE.TorusGeometry(0.28, 0.075, 10, 18, Math.PI), mat("#b8c2cc"));
  padlockShackle.position.set(0, 0.36, 0);
  padlock.add(padlockShackle);
  explainer.add(padlock);

  // ---------------- 8. ALLEY (Brick back-alley watch analogy — Shot 13) ----------------
  const alley = makeSet("alley");
  alley.add(box(40, 0.4, 50, mat("#ffffff", rep(cobTex, 12, 14)), 0, -0.2, -6));
  const mBrick = mat("#ffffff", rep(brickTex, 4, 3));
  // Left & right brick alley walls (wide enough so camera stays cleanly inside)
  alley.add(box(1.0, 9.5, 28, mBrick, -3.9, 4.75, -5));
  alley.add(box(1.0, 9.5, 28, mBrick, 3.9, 4.75, -5));
  // Distant building across the street outside alley exit
  const farAlleyB = buildHaussmann(16, 12, 8, "#c7b9a6");
  farAlleyB.position.set(0, 0, -24);
  alley.add(farAlleyB);
  // Wooden crates + warm glowing cast-iron streetlamp
  alley.add(box(1.05, 0.95, 1.05, mat("#ffffff", rep(woodTex, 1, 1)), -2.6, 0.48, -2.5));
  alley.add(box(0.75, 0.72, 0.75, mat("#ffffff", rep(woodTex, 1, 1)), -2.4, 1.32, -2.6));
  const aLamp = buildStreetLamp(true);
  aLamp.position.set(2.8, 0, -5.8);
  alley.add(aLamp);

  // ---------------- 9. VIENNA_CAFE (Left: Paris bench for Poisson; Right: sunny Vienna terrace for Lustig — Shot 14) ----------------
  const vienna = makeSet("vienna_cafe");
  vienna.add(box(120, 0.4, 100, mat("#ffffff", rep(cobTex, 26, 22)), 0, -0.2, -10));
  // Left zone (x = -6): quiet Paris park bench + leafy hedge
  const pBench = buildBench();
  pBench.position.set(-6.0, 0, -0.4);
  vienna.add(pBench);
  vienna.add(box(6.5, 1.65, 1.2, mat("#4c8840"), -6.0, 0.82, -2.4));
  const pTree = buildTree(1.05, "#4f8d42");
  pTree.position.set(-9.2, 0, -3.5);
  vienna.add(pTree);
  const pLamp = buildStreetLamp(false);
  pLamp.position.set(-3.2, 0, -2.0);
  vienna.add(pLamp);
  // Right zone (x = +6): sunny Vienna café terrace with emerald-green awning + newspaper stack
  const vHouse = buildHaussmann(12, 12, 8, "#ecdab4");
  vHouse.position.set(11.8, 0, -6.5);
  vienna.add(vHouse);
  const vAwn = box(7.4, 0.14, 3.2, mat("#ffffff", rep(awningHD("awnGreen", "#2a6e4c"), 2, 1)), 7.2, 3.55, -2.4);
  vAwn.rotation.x = 0.26;
  vienna.add(vAwn);
  const vTable = buildBistroTable();
  vTable.position.set(6.0, 0, 0.9);
  vienna.add(vTable);
  // Neat stack of blank-scandal newspapers on Vienna table
  const newsStack = new THREE.Group();
  newsStack.position.set(5.78, 0.89, 0.92);
  for (let i = 0; i < 4; i++) {
    const sh = box(0.42, 0.04, 0.30, mat(i % 2 ? "#f2ebda" : "#e5ddc8"), 0, i * 0.042, 0);
    sh.rotation.y = (i - 1.5) * 0.09;
    newsStack.add(sh);
  }
  vienna.add(newsStack);
  const vTree = buildTree(1.0, "#559546");
  vTree.position.set(2.2, 0, -6.0);
  vienna.add(vTree);
  // Distant baroque Vienna spire
  vienna.add(cyl(1.6, 1.8, 6.0, 12, mat("#e3d6be"), 5.5, 3.0, -32));
  const dome = new THREE.Mesh(new THREE.SphereGeometry(1.75, 14, 10, 0, Math.PI * 2, 0, Math.PI / 2), mat("#4d8c78"));
  dome.position.set(5.5, 6.0, -32);
  vienna.add(dome);

  // ---------------- 10. HOTEL_BUST (Crillon doorway bust + America-bound ocean liner — Shot 15) ----------------
  const bust = makeSet("hotel_bust");
  bust.add(box(120, 0.4, 60, mat("#ffffff", rep(cobTex, 26, 14)), -10, -0.2, 4));
  // Harbor water behind quay (z < -6)
  bust.add(box(140, 0.3, 90, mat("#ffffff", rep(waterHD(), 16, 12)), 10, -0.75, -50));
  bust.add(box(60, 1.1, 1.2, mat("#aba08e"), 4, -0.1, -5.8)); // stone quay wall
  // Left: Hôtel de Crillon stone entrance portico & red carpet
  const crilFront = buildHaussmann(10, 11, 7, "#dfd2bc");
  crilFront.position.set(-4.5, 0, -4.2);
  bust.add(crilFront);
  bust.add(box(2.6, 0.05, 4.2, mat("#9e242c"), -1.8, 0.03, 0.6));
  const bLamp = buildStreetLamp(true);
  bLamp.position.set(-3.4, 0, 1.6);
  bust.add(bLamp);
  // Wooden gangplank leading right onto the ocean liner
  const plank = box(4.6, 0.14, 1.25, mat("#ffffff", rep(woodTex, 2, 1)), 3.6, 0.85, -4.4);
  plank.rotation.z = 0.32;
  bust.add(plank);
  // Dynamic 1925 Transatlantic Ocean Liner (framed close so red-and-black stacks soar in Shot 15!)
  const liner = new THREE.Group();
  liner.position.set(8.2, -0.4, -8.8);
  liner.add(box(14.5, 2.8, 4.2, mat("#232833"), 0, 1.3, 0)); // dark hull
  liner.add(box(14.7, 0.45, 4.3, mat("#9e2c2a"), 0, 0.05, 0)); // red waterline
  liner.add(box(11.0, 2.2, 3.5, mat("#f0eadc"), -0.5, 3.7, 0)); // white superstructure
  liner.add(box(8.2, 1.2, 2.8, mat("#f5f0e4"), -0.5, 5.3, 0)); // upper bridge deck
  // Two iconic red-and-black smokestacks
  for (const fx of [-2.4, 1.2]) {
    liner.add(cyl(0.62, 0.72, 2.9, 14, mat("#bd362c"), fx, 7.1, 0));
    liner.add(cyl(0.64, 0.64, 0.65, 14, mat("#1e2128"), fx, 8.3, 0));
  }
  // Glowing warm portholes
  for (let i = -5; i <= 5; i++) {
    const ph = cyl(0.18, 0.18, 4.3, 10, unlit(new THREE.Color(2.0, 1.6, 0.85)), i * 1.12, 1.85, 0);
    ph.rotation.x = Math.PI / 2;
    ph.layers.set(NOINK);
    liner.add(ph);
  }
  bust.add(liner);

  // ---------------- 11. FINALE (Far-left x=-20: Alcatraz cell bars; Center: Golden Sunset Eiffel Finale — Shot 16) ----------------
  const finale = makeSet("finale");
  // Left zone moved far to x = -20 so zero cell wall ever peeks into the golden Paris finale!
  finale.add(box(7.5, 0.3, 7.5, mat("#787d86"), -20.0, -0.15, 0));
  finale.add(box(7.5, 6.0, 0.5, mat("#686e78"), -20.0, 3.0, -2.8));
  finale.add(box(0.5, 6.0, 7.5, mat("#5e646e"), -23.4, 3.0, 0));
  finale.add(box(0.5, 6.0, 7.5, mat("#5e646e"), -16.6, 3.0, 0));
  finale.add(box(1.5, 0.9, 0.55, unlit("#ffcf98"), -20.0, 4.1, -2.8));
  const jailBars = new THREE.Group();
  jailBars.position.set(-20.0, 5.2, 1.55); // drops down to y = 0 at F_CAUGHT!
  const mBar = mat("#262b34");
  jailBars.add(box(5.6, 0.22, 0.22, mBar, 0, 4.2, 0));
  jailBars.add(box(5.6, 0.22, 0.22, mBar, 0, 0.15, 0));
  // Symmetric bars leaving a clean central gap (-0.36..+0.36) so Lustig's face is NEVER blocked!
  for (const bx of [-2.15, -1.55, -0.95, -0.38, 0.38, 0.95, 1.55, 2.15]) {
    jailBars.add(cyl(0.055, 0.055, 4.2, 10, mBar, bx, 2.15, 0));
  }
  finale.add(jailBars);

  // Center/Right zone (x = 0): Golden sunset Champ de Mars & majestic full-spire Eiffel Tower!
  finale.add(box(140, 0.4, 120, mat("#ffffff", rep(gravTex, 26, 22)), 6, -0.2, -18));
  for (const sx of [-1, 1]) {
    finale.add(box(22, 0.12, 70, mat("#ffffff", rep(grassTex, 5, 16)), sx * 19, 0.04, -18));
    for (const lz of [-28, -14, 0]) {
      const flamp = buildStreetLamp(true);
      flamp.position.set(sx * 7.2, 0, lz);
      finale.add(flamp);
    }
    const fb = buildHaussmann(14, 14, 10, "#dfd2bc");
    fb.position.set(sx * 26, 0, -28);
    finale.add(fb);
  }
  const finTower = buildEiffelTower(0.96, false, false);
  finTower.position.set(0, 0, -27.5);
  finale.add(finTower);

  return {
    groups,
    dyn: {
      limo: limoObj.group,
      limoWheels: limoObj.wheels,
      paintBucket,
      waxStamp,
      miniTower,
      train: trainObj.group,
      trainWheels: trainObj.wheels,
      padlock,
      padlockShackle,
      newsStack,
      liner,
      jailBars,
    },
  };
}
