// Unified Three.js scene controller for "The Man Who Sold the Eiffel Tower" (Paris & Vienna, 1925).
// Deterministically poses active 3D set, sky shader, clouds, fog, camera-relative sun, animated 3D props, and 2D cast.
import * as THREE from "three";
import { buildAllSets, BuiltSets } from "./build";
import { ctex, cloudHD } from "./paint";
import { LIGHTS, LOOK, LightMode } from "./lights";
import { TONE, CHAR, untone } from "./shade";
import { NOINK } from "./ink";
import { Pool, stageShot, CamInfo, limoXAt, trainXAt } from "./cast";
import {
  FPS, SHOTS, camAt, clamp01, easeOut,
  F_REPAINT, F_STAMP, F_LOCK, F_PAPERS, F_BOLTS, F_CAUGHT,
} from "./story";

const discTex = () => ctex("sunDisc", 128, 128, (g) => {
  const gr = g.createRadialGradient(64, 64, 58, 64, 64, 64);
  gr.addColorStop(0, "rgba(255,255,255,1)"); gr.addColorStop(1, "rgba(255,255,255,0)");
  g.fillStyle = gr; g.fillRect(0, 0, 128, 128);
}, false);

const haloTex = () => ctex("sunHalo", 256, 256, (g) => {
  const im = g.createImageData(256, 256);
  for (let y = 0; y < 256; y++) for (let x = 0; x < 256; x++) {
    const u = Math.hypot(x - 127.5, y - 127.5) / 128;
    const a = (0.55 * Math.exp(-((u / 0.25) ** 2)) + 0.35 * Math.exp(-((u / 0.6) ** 2))) * (1 - Math.min(1, Math.max(0, (u - 0.8) / 0.2)));
    const i = (y * 256 + x) * 4;
    im.data[i] = im.data[i + 1] = im.data[i + 2] = 255;
    im.data[i + 3] = Math.round(255 * Math.min(1, a));
  }
  g.putImageData(im, 0, 0);
}, false);

export class World {
  root = new THREE.Group();
  private sets: BuiltSets;
  private pool = new Pool();
  private hemi: THREE.HemisphereLight;
  private sun: THREE.DirectionalLight;
  private fill: THREE.DirectionalLight;
  private sky: THREE.Mesh;
  private skyMat: THREE.ShaderMaterial;
  private fog = new THREE.Fog("#b8d0ec", 25, 300);
  private sunDisc: THREE.Sprite;
  private sunHalo: THREE.Sprite;
  private sunCache = new Map<number, THREE.Vector3>();
  private clouds: THREE.Mesh[] = [];
  private cloudMaps: Record<LightMode, THREE.Texture[]>;
  private lastLight: LightMode | null = null;
  private tmpUp = new THREE.Vector3(0, 1, 0);
  private tmpTarget = new THREE.Vector3();

  constructor() {
    const R = this.root;
    this.skyMat = new THREE.ShaderMaterial({
      uniforms: {
        c0: { value: new THREE.Color() }, c1: { value: new THREE.Color() }, c2: { value: new THREE.Color() },
        c3: { value: new THREE.Color() }, c4: { value: new THREE.Color() }, e: { value: new THREE.Vector4() },
      },
      vertexShader: "varying vec3 vP; void main(){ vP = normalize(position); gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }",
      fragmentShader: `uniform vec3 c0, c1, c2, c3, c4; uniform vec4 e; varying vec3 vP;
        void main(){ float el = asin(clamp(normalize(vP).y, -1.0, 1.0));
          vec3 c = mix(c0, c1, smoothstep(0.0, e.x, el));
          c = mix(c, c2, smoothstep(e.x, e.y, el));
          c = mix(c, c3, smoothstep(e.y, e.z, el));
          c = mix(c, c4, smoothstep(e.z, e.w, el));
          gl_FragColor = vec4(c, 1.0); }`,
      side: THREE.BackSide, depthWrite: false, fog: false,
    });
    this.sky = new THREE.Mesh(new THREE.SphereGeometry(900, 48, 24), this.skyMat);
    this.sky.renderOrder = -1;
    this.sky.frustumCulled = false;
    this.sky.layers.set(NOINK);
    R.add(this.sky);

    this.sunDisc = new THREE.Sprite(new THREE.SpriteMaterial({ map: discTex(), color: new THREE.Color(6.0, 4.4, 2.4), fog: false, depthWrite: false }));
    this.sunHalo = new THREE.Sprite(new THREE.SpriteMaterial({ map: haloTex(), color: new THREE.Color(1, 1, 1), fog: false, depthWrite: false, depthTest: true, transparent: true, blending: THREE.AdditiveBlending }));
    this.sunDisc.renderOrder = -0.5;
    this.sunHalo.renderOrder = 5;
    for (const m of [this.sunDisc, this.sunHalo]) { m.frustumCulled = false; m.layers.set(NOINK); R.add(m); }

    this.hemi = new THREE.HemisphereLight("#dcecff", "#b49a78", 0.55);
    this.sun = new THREE.DirectionalLight("#fff3e0", 2.8);
    this.sun.castShadow = true;
    this.sun.shadow.mapSize.set(1024, 1024);
    this.sun.shadow.camera.near = 2;
    this.sun.shadow.camera.far = 140;
    this.sun.shadow.camera.left = -28;
    this.sun.shadow.camera.right = 28;
    this.sun.shadow.camera.top = 28;
    this.sun.shadow.camera.bottom = -28;
    this.fill = new THREE.DirectionalLight("#9fb8ff", 0.35);
    R.add(this.hemi, this.sun, this.sun.target, this.fill, this.fill.target);

    const modes: LightMode[] = ["day", "golden", "interior", "dusk", "storm"];
    this.cloudMaps = Object.fromEntries(modes.map((m) => [m, [0, 1, 2, 3].map((k) => cloudHD(k, LOOK[m].cloud))])) as unknown as Record<LightMode, THREE.Texture[]>;
    for (let i = 0; i < 8; i++) {
      const a = (i / 8) * Math.PI * 2 + 0.35, d = 520 + (i % 3) * 55;
      const m = new THREE.Mesh(
        new THREE.PlaneGeometry(1, 1),
        new THREE.MeshBasicMaterial({ map: this.cloudMaps.day[i % 4], color: new THREE.Color(1.08, 1.08, 1.08), transparent: true, depthWrite: false, fog: false })
      );
      const w = 125 + (i % 4) * 28;
      m.position.set(Math.cos(a) * d, 95 + (i % 4) * 32, Math.sin(a) * d);
      m.scale.set(w, w / 2, 1);
      m.layers.set(NOINK);
      this.clouds.push(m);
      R.add(m);
    }

    this.sets = buildAllSets(R);
    this.pool.ensure(R, 10, 8);
  }

  private sunDirFor(id: number): THREE.Vector3 {
    let dir = this.sunCache.get(id);
    if (!dir) {
      const s = SHOTS[id - 1];
      const L = LIGHTS[s.light];
      const az = ((s.sunAz ?? L.az) * Math.PI) / 180;
      const el = ((s.sunEl ?? L.el) * Math.PI) / 180;
      const c0 = camAt(id, s.a);
      const fw = new THREE.Vector3(c0.look[0] - c0.pos[0], 0, c0.look[2] - c0.pos[2]).normalize();
      if (fw.lengthSq() < 1e-4) fw.set(0, 0, -1);
      const rt = new THREE.Vector3().crossVectors(fw, this.tmpUp).normalize();
      const horiz = fw.clone().multiplyScalar(Math.cos(az)).addScaledVector(rt, Math.sin(az));
      dir = horiz.multiplyScalar(Math.cos(el)).addScaledVector(this.tmpUp, Math.sin(el)).normalize();
      this.sunCache.set(id, dir);
    }
    return dir;
  }

  private applyLight(light: LightMode, scene: THREE.Scene) {
    const L = LIGHTS[light], K = LOOK[light];
    TONE.uLitCol.value.set(...L.lit);
    TONE.uShadeCol.value.set(...L.shade);
    TONE.uShadeLift.value.set(...L.lift);
    TONE.uLambert.value = L.lambert;
    TONE.uSideK.value = L.sideK;
    TONE.uTerm.value = L.term;
    TONE.uBounce.value.set(...K.bounce);
    TONE.uSat.value = K.sat;

    CHAR.uCharTint.value.set(...L.charTint);
    CHAR.uCharShade.value = L.charShade;
    CHAR.uGrad.value = L.charGrad;
    CHAR.uBodyGrad.value = L.bodyGrad;
    CHAR.uSideTint.value.set(...L.sideTint);

    this.hemi.color.set(L.sky);
    this.hemi.groundColor.set(L.ground);
    this.hemi.intensity = L.hemiI;
    this.sun.color.set(L.sunCol);
    this.sun.intensity = L.sunI;
    this.sun.shadow.bias = L.bias;
    this.sun.shadow.normalBias = L.normalBias;

    untone(L.fog, this.fog.color);
    this.fog.near = L.fogNear;
    this.fog.far = L.fogFar;
    scene.fog = this.fog;

    const u = this.skyMat.uniforms;
    K.sky.c.forEach((hex, idx) => untone(hex, u[`c${idx}`].value));
    u.e.value.set(
      (K.sky.e[1] * Math.PI) / 180,
      (K.sky.e[2] * Math.PI) / 180,
      (K.sky.e[3] * Math.PI) / 180,
      (K.sky.e[4] * Math.PI) / 180
    );

    if (this.lastLight !== light) {
      this.clouds.forEach((m, i) => {
        const bm = m.material as THREE.MeshBasicMaterial;
        bm.map = this.cloudMaps[light][i % 4];
        bm.needsUpdate = true;
      });
      this.lastLight = light;
    }
  }

  private animateProps(id: number, f: number) {
    const d = this.sets.dyn;
    const t = f / FPS;

    // Shot 6: Limousine cruising under the Eiffel Tower arch
    d.limo.visible = id === 6;
    if (id === 6) {
      const lx = limoXAt(f);
      d.limo.position.set(lx, Math.abs(Math.sin(t * 14)) * 0.03, -4.5);
      d.limoWheels.forEach((w) => { w.rotation.y = -lx / 0.42; });
    }

    // Shot 2: Tipping paint bucket on scaffold at F_REPAINT
    if (id === 2) {
      const tip = easeOut((f - F_REPAINT) / 12);
      d.paintBucket.rotation.z = -tip * 1.45;
      d.paintBucket.position.y = 2.55 - tip * 0.08;
    } else {
      d.paintBucket.rotation.z = 0;
      d.paintBucket.position.y = 2.55;
    }

    // Shot 4 & 5: Wax stamp slam & rotating miniature brass Eiffel Tower
    if (id === 4) {
      const down = clamp01((f - (F_STAMP - 6)) / 6);
      const lift = clamp01((f - (F_STAMP + 12)) / 10);
      d.waxStamp.visible = true;
      d.waxStamp.position.y = 1.06 + (1 - down) * 0.65 + lift * 0.45;
      d.miniTower.visible = false;
    } else if (id === 5) {
      d.waxStamp.visible = false;
      d.miniTower.visible = true;
      d.miniTower.rotation.y = t * 0.55;
    } else if (id === 7) {
      d.waxStamp.visible = false;
      d.miniTower.visible = true;
      d.miniTower.rotation.y = 0.4;
    }

    // Shot 10: Vienna Express train chugging east + spinning wheels
    if (id === 10) {
      const tx = trainXAt(f);
      d.train.position.set(tx, 0.22 + Math.abs(Math.sin(t * 22)) * 0.025, -2.2);
      d.trainWheels.forEach((w) => { w.rotation.y = -tx / 0.5; });
    }

    // Shot 12: Explainer brass padlock snapping shut at F_LOCK
    if (id === 12) {
      const slam = easeOut((f - F_LOCK) / 8);
      d.padlock.scale.setScalar(0.62 + slam * 0.22);
      d.padlockShackle.position.y = 0.58 - slam * 0.24;
      d.padlock.rotation.z = Math.sin(t * 2.5) * 0.04;
    }

    // Shot 14: Vienna newspaper stack subtle flutter on F_PAPERS
    if (id === 14) {
      const u = clamp01((f - F_PAPERS) / 14);
      d.newsStack.rotation.y = u * 0.25;
    }

    // Shot 15: Ocean liner bobbing & drifting out as Lustig bolts
    if (id === 15) {
      const sail = easeOut((f - (F_BOLTS + 12)) / 42);
      d.liner.position.set(8.2 + sail * 3.8, -0.4 + Math.sin(t * 2.2) * 0.08, -8.8);
    }

    // Shot 16: Alcatraz jail bars slamming down on F_CAUGHT
    if (id === 16) {
      const drop = easeOut((f - F_CAUGHT) / 8);
      d.jailBars.position.y = (1 - drop) * 4.8;
    }
  }

  update(id: number, f: number, cam: THREE.PerspectiveCamera, scene: THREE.Scene): THREE.Vector3 {
    const s = SHOTS[id - 1];
    const cs = camAt(id, f);

    // Toggle only the active set
    for (const [k, grp] of Object.entries(this.sets.groups)) {
      grp.visible = k === s.set;
    }

    this.applyLight(s.light, scene);

    // Pose camera with roll
    cam.position.set(...cs.pos);
    this.tmpTarget.set(...cs.look);
    cam.fov = cs.fov;
    cam.up.set(0, 1, 0);
    cam.lookAt(this.tmpTarget);
    if (Math.abs(cs.roll) > 1e-4) cam.rotateZ((cs.roll * Math.PI) / 180);
    cam.updateProjectionMatrix();
    cam.updateMatrixWorld();

    // Camera-relative frozen sun per shot
    const sdir = this.sunDirFor(id);
    this.sun.position.copy(this.tmpTarget).addScaledVector(sdir, 46);
    this.sun.target.position.copy(this.tmpTarget);
    this.sun.target.updateMatrixWorld();
    this.fill.position.copy(this.tmpTarget).addScaledVector(sdir, -25).add(new THREE.Vector3(0, 18, 0));
    this.fill.target.position.copy(this.tmpTarget);
    this.fill.target.updateMatrixWorld();

    // Sky dome & sun disc follow camera
    this.sky.position.copy(cam.position);
    const L = LIGHTS[s.light];
    const hasSun = L.sunDisc !== "#000000";
    this.sunDisc.visible = hasSun;
    this.sunHalo.visible = hasSun;
    if (hasSun) {
      const sp = cam.position.clone().addScaledVector(sdir, 720);
      this.sunDisc.position.copy(sp);
      this.sunDisc.scale.set(95, 95, 1);
      this.sunHalo.position.copy(sp);
      this.sunHalo.scale.set(360, 360, 1);
      (this.sunHalo.material as THREE.SpriteMaterial).color.set(L.sunDisc);
    }

    // Billboard clouds gently drifting
    const t = f / FPS;
    this.clouds.forEach((m, i) => {
      const a = (i / 8) * Math.PI * 2 + 0.35 + t * 0.0025;
      const d = 520 + (i % 3) * 55;
      m.position.set(cam.position.x + Math.cos(a) * d, 95 + (i % 4) * 32, cam.position.z + Math.sin(a) * d);
      m.lookAt(cam.position);
    });

    this.animateProps(id, f);
    stageShot(id, f, s.light, this.pool, { pos: cam.position, look: this.tmpTarget, heightPx: 1920 });

    return this.tmpTarget;
  }
}
