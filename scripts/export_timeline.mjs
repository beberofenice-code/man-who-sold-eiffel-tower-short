#!/usr/bin/env node
// Exports story.ts timeline -> out/eiffel/timeline.json and out/eiffel/shots_qa.json
import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { buildSync } from "esbuild";

const storyPath = path.resolve(process.argv[2] || "src/videos/eiffel/story.ts");
const outDir = path.resolve(process.argv[3] || "out/eiffel");
fs.mkdirSync(outDir, { recursive: true });

const tmpJs = path.join(outDir, "_story_tmp.mjs");
buildSync({
  entryPoints: [storyPath],
  bundle: true,
  format: "esm",
  platform: "node",
  outfile: tmpJs,
});

const mod = await import(pathToFileURL(tmpJs).href);
fs.unlinkSync(tmpJs);

const timeline = {
  fps: mod.FPS,
  total_frames: mod.TOTAL,
  duration_s: mod.TOTAL / mod.FPS,
  shots: mod.SHOTS.map((s) => ({
    id: s.id,
    a: s.a,
    b: s.b,
    light: s.light,
    set: s.set,
    xfade: s.xfade || 0,
  })),
  flashes: mod.FLASHES.map((fl) => ({ f: fl.f, dur: fl.curve.length })),
  kicks: mod.KICKS,
  events: Object.fromEntries(Object.entries(mod).filter(([k, v]) => k.startsWith("F_") && typeof v === "number")),
};

fs.writeFileSync(path.join(outDir, "timeline.json"), JSON.stringify(timeline, null, 2));

const xfadeRanges = [];
for (const s of mod.SHOTS) {
  if (s.xfade) xfadeRanges.push([Math.max(0, s.a - s.xfade), Math.min(mod.TOTAL, s.a + s.xfade)]);
}
const planned = mod.FLASHES.map((fl) => [fl.f, fl.f + fl.curve.length + 1]);
for (const [kf] of mod.KICKS) planned.push([kf - 1, kf + 9]);

const qaMeta = {
  shots: mod.SHOTS.map((s) => ({ id: s.id, a: s.a, b: s.b })),
  xfade: xfadeRanges,
  planned,
};
fs.writeFileSync(path.join(outDir, "shots_qa.json"), JSON.stringify(qaMeta, null, 2));
console.log(`[export_timeline] Wrote ${outDir}/timeline.json & shots_qa.json (${mod.SHOTS.length} shots, ${mod.TOTAL} frames = ${(mod.TOTAL / mod.FPS).toFixed(2)} s)`);
