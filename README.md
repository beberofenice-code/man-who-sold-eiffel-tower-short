# The Man Who Sold the Eiffel Tower

A 77-second 2K vertical animated story short (`1440×2560`, 30 fps) telling the true 1925 story of con artist **Victor Lustig** selling the Eiffel Tower for scrap metal in Paris — built in Three.js + Remotion with flat 2D bean-head cartoon characters in hand-painted 3D 1925 Paris & Vienna sets, world ink outlines, depth-aware bokeh, ElevenLabs `eleven_v4` narration, and BS.1770-4 mastered procedural Parisian musette-waltz caper music and foley.

## Watch / Download 2K Master
- **Direct Download (Release Asset):** [the-man-who-sold-the-eiffel-tower-2k.mp4](https://github.com/beberofenice-code/man-who-sold-eiffel-tower-short/raw/v1.0.0/the-man-who-sold-the-eiffel-tower-2k.mp4) (`105 MB`)
- **GitHub Release:** [`v1.0.0`](https://github.com/beberofenice-code/man-who-sold-eiffel-tower-short/releases/tag/v1.0.0)
- **Video:** `1440×2560` (9:16 2K vertical), `30 fps`, `2,310` frames (`77.00 s`), H.264 `yuv420p` CRF 16 `+faststart`
- **Audio:** AAC `48 kHz` stereo `256 kbps`, ElevenLabs `eleven_v4` narration + original Parisian musette accordion & caper score + 34 frame-locked SFX cues mastered to `-15.1 LUFS` / `LRA 2.2 LU` / `-0.9 dBFS` true peak (zero silences)
- **Captions:** None (clean, text-free visuals across all 16 shots)

## QA Summary
Verified frame-by-frame with `scripts/short_qa.py` (see [`QA_REPORT.md`](QA_REPORT.md)):
- `0` black frames
- `0` unplanned white frames
- `0` frozen spans (`>= 12` frames)
- `0` silent audio gaps (`I = -15.1 LUFS`, `LRA = 2.2 LU`)
- `5` flagged frame-diff spikes — all 5 verified as planned hard cuts / choreography beats (`f132`, `f974`, `f1262`, `f1876`, `f2186`)

## Project Structure
- [`SCRIPT.md`](SCRIPT.md) — Researched 224-word historical narration script with sources
- [`src/videos/eiffel/`](src/videos/eiffel/) — 11 modular painted 3D sets including curved-lattice 3D Eiffel Tower, Hôtel de Crillon salon & alcove, Parisian café, 1925 touring limousine, Vienna Express steam train, alley watch analogy, transatlantic ocean liner, and Alcatraz cell (`build.ts`, `paint.ts`), 1925 bean-head cast & text-free FX cards (`toon.ts`, `cast.ts`), lighting/grade presets (`lights.ts`, `grade.ts`), post-processing (`ink.ts`, `lensblur.ts`), and 16-shot timeline (`story.ts`, `world.ts`, `EiffelShort.tsx`)
- [`audio/`](audio/) — Original synthesized Parisian musette-waltz & caper score (`music.py`, `instruments.py`), 34 frame-locked foley cues (`sfx.py`), BS.1770-4 master mixer (`mix.py`, `dsp.py`), and cue sheet (`cues.md`)
- [`scripts/`](scripts/) — ElevenLabs `eleven_v4` voice generator (`gen_voice_v4.py`), timeline exporter (`export_timeline.mjs`), per-shot resumable Remotion renderer & FFmpeg 2K stitcher (`render.mjs`), visual review grid builder (`make_review_grid.py`), and frame-by-frame QA (`short_qa.py`)

## Reproduce Locally
```bash
npm install
# 1. Generate voice narration (requires ELEVENLABS_API_KEY and ELEVENLABS_VOICE_ID)
python3 scripts/gen_voice_v4.py --script SCRIPT.md --out-dir voice --model eleven_v4 --speed 1.18
# 2. Export master timeline & mix audio
node scripts/export_timeline.mjs
python3 audio/mix.py
# 3. Render all 16 shots & stitch 2K vertical master
node scripts/render.mjs bundle --rebundle
node scripts/render.mjs render-shots --comp EiffelShort --timeline out/eiffel/timeline.json --audio audio/mix.wav --out out/eiffel/the-man-who-sold-the-eiffel-tower-2k.mp4 --scale 2/3
# 4. Run frame-by-frame QA
python3 scripts/short_qa.py out/eiffel/the-man-who-sold-the-eiffel-tower-2k.mp4 out/eiffel/qa out/eiffel/shots_qa.json
```
