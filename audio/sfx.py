"""Frame-accurate synthesized foley & comedic SFX for 'The Man Who Sold the Eiffel Tower'.
All cue timings read directly from out/eiffel/timeline.json events/kicks.
"""
import numpy as np
from dsp import SR, ns, place, pan, lp, hp, bp, make_ir, convolve_st, st
import instruments as I


def render_sfx(tl: dict) -> tuple[np.ndarray, list[tuple[float, str, float, float]]]:
    dur = float(tl["duration_s"])
    fps = tl["fps"]
    ev = tl["events"]
    N = ns(dur)
    out = np.zeros((2, N), dtype=np.float64)
    cues: list[tuple[float, str, float, float]] = []
    rng = np.random.default_rng(192505)

    def add(sig: np.ndarray, t_s: float, label: str, gain: float = 0.8, p: float = 0.0):
        place(out, pan(sig * gain, p), t_s)
        cues.append((t_s, label, gain, p))

    def thud(f0=110, dur_s=0.18):
        n = ns(dur_s)
        t = np.arange(n) / SR
        ph = 2 * np.pi * np.cumsum(f0 * np.exp(-t / 0.04) + 38) / SR
        return np.sin(ph) * np.exp(-t / 0.055) * 0.65

    def chime(notes, step=0.055):
        n = ns(len(notes) * step + 0.45)
        buf = np.zeros(n)
        for i, m in enumerate(notes):
            s = I.harp_pluck(m, 0.40, 0.8)
            k0 = ns(i * step)
            k1 = min(n, k0 + len(s))
            buf[k0:k1] += s[:k1 - k0]
        return buf

    def coin_clink(count=5):
        n = ns(0.45)
        buf = np.zeros(n)
        for i in range(count):
            t0 = i * 0.045
            nn = ns(0.18)
            t = np.arange(nn) / SR
            f = 3400 + i * 380
            s = (np.sin(2 * np.pi * f * t) + 0.5 * np.sin(2 * np.pi * f * 1.41 * t)) * np.exp(-t / 0.035)
            k0 = ns(t0)
            k1 = min(n, k0 + nn)
            buf[k0:k1] += s[:k1 - k0] * 0.25
        return buf

    def paper_snap(dur_s=0.16):
        n = ns(dur_s)
        t = np.arange(n) / SR
        nz = rng.standard_normal(n)
        return bp(nz, 1400, 6200) * np.sin(np.pi * t / dur_s) ** 0.7 * np.exp(-t / 0.055) * 0.55

    def whoosh(dur_s=0.26, f_lo=260, f_hi=1400):
        n = ns(dur_s)
        t = np.arange(n) / SR
        nz = rng.standard_normal(n)
        env = np.sin(np.pi * t / dur_s) ** 1.4
        return bp(nz, f_lo, f_hi) * env * 0.42

    def limo_horn():
        """Cheerful 1925 French brass bulb-horn honk-honk!"""
        n = ns(0.65)
        buf = np.zeros(n)
        for start, d in ((0.0, 0.16), (0.24, 0.22)):
            nn = ns(d)
            t = np.arange(nn) / SR
            f = 420 + 35 * np.sin(np.pi * t / d)
            ph = 2 * np.pi * np.cumsum(f) / SR
            s = (np.sin(ph) + 0.7 * np.sin(2 * ph) + 0.5 * np.sin(3 * ph) + 0.3 * np.sin(4 * ph))
            s = bp(s, 320, 2600) * np.minimum(t / 0.015, 1.0) * np.minimum((d - t) / 0.025, 1.0) * 0.34
            k0 = ns(start)
            buf[k0:k0 + nn] += s
        return buf

    def train_chug_whistle(dur_s=2.4):
        n = ns(dur_s)
        t = np.arange(n) / SR
        buf = np.zeros(n)
        # Rhythmic steam chugs
        for ct in np.arange(0.0, dur_s - 0.15, 0.17):
            nn = ns(0.12)
            tt = np.arange(nn) / SR
            ch = bp(rng.standard_normal(nn), 450, 2800) * np.exp(-tt / 0.032) * 0.35
            k0 = ns(ct)
            buf[k0:k0 + nn] += ch[:min(nn, n - k0)]
        # Dual-tone European steam whistle (two chords: B4 + D#5)
        for ws, wd in ((0.28, 0.55), (1.05, 0.65)):
            nn = ns(wd)
            tt = np.arange(nn) / SR
            s = (np.sin(2 * np.pi * 587 * tt) + 0.85 * np.sin(2 * np.pi * 740 * tt)
                 + 0.35 * np.sin(2 * np.pi * 1174 * tt))
            env = np.minimum(tt / 0.04, 1.0) * np.minimum((wd - tt) / 0.08, 1.0)
            k0 = ns(ws)
            buf[k0:k0 + nn] += lp(s * env, 2600) * 0.24
        return buf

    def padlock_snap():
        n = ns(0.24)
        t = np.arange(n) / SR
        click = bp(rng.standard_normal(n), 1800, 7000) * np.exp(-t / 0.014) * 0.65
        ring = (np.sin(2 * np.pi * 1680 * t) + 0.6 * np.sin(2 * np.pi * 2440 * t)) * np.exp(-t / 0.05) * 0.35
        th = thud(150, 0.12)
        return click + ring + np.pad(th, (0, max(0, n - len(th))))[:n] * 0.55

    def watch_sprong():
        """Comedic cartoon spring BOING + scattering tiny gears!"""
        n = ns(0.65)
        t = np.arange(n) / SR
        f = 220 + 520 * (1 - np.exp(-t / 0.18)) + 75 * np.sin(2 * np.pi * 26 * t) * np.exp(-t / 0.35)
        ph = 2 * np.pi * np.cumsum(f) / SR
        boing = bp(np.sin(ph) + 0.4 * np.sin(2 * ph), 180, 3200) * np.exp(-t / 0.24) * 0.45
        gears = coin_clink(6)
        buf = boing.copy()
        buf[:len(gears)] += gears * 0.65
        return buf

    def gendarme_whistle(dur_s=0.95):
        """Piercing 1925 French police pea-whistle with rapid trill modulation."""
        n = ns(dur_s)
        t = np.arange(n) / SR
        trill = 1.0 + 0.065 * np.sin(2 * np.pi * 34 * t)
        f = 2780 * trill
        ph = 2 * np.pi * np.cumsum(f) / SR
        sig = (np.sin(ph) + 0.35 * np.sin(2 * ph)) * (0.7 + 0.3 * np.sin(2 * np.pi * 34 * t))
        env = np.minimum(t / 0.025, 1.0) * np.minimum((dur_s - t) / 0.05, 1.0)
        return bp(sig * env, 1800, 6200) * 0.28

    def foghorn(dur_s=1.2):
        """Deep transatlantic ocean liner steam horn."""
        n = ns(dur_s)
        t = np.arange(n) / SR
        s = (np.sin(2 * np.pi * 116 * t) + 0.8 * np.sin(2 * np.pi * 174 * t)
             + 0.45 * np.sin(2 * np.pi * 232 * t) + 0.25 * np.sin(2 * np.pi * 348 * t))
        env = np.minimum(t / 0.12, 1.0) * np.minimum((dur_s - t) / 0.22, 1.0)
        return lp(s * env, 950) * 0.42

    def jail_clang():
        """Heavy Alcatraz iron bars slamming shut!"""
        n = ns(0.65)
        t = np.arange(n) / SR
        s = np.zeros(n)
        for f, a, dec in ((310, 0.5, 0.24), (582, 0.45, 0.20), (890, 0.38, 0.16), (1420, 0.28, 0.11), (2180, 0.2, 0.07)):
            s += a * np.sin(2 * np.pi * f * t) * np.exp(-t / dec)
        impact = thud(130, 0.18)
        s[:len(impact)] += impact * 0.75
        ir = make_ir(rt60=0.65, seed=1935, hf=0.75)
        wet = convolve_st(st(s * 0.55), ir)[0, :n]
        return s * 0.42 + wet * 0.26

    # --- Place every frame-locked SFX cue ---
    tf = lambda key: ev[key] / fps

    add(thud(115) , tf("F_SOLD"), "money_bag_thud", 0.85, 0.2)
    add(coin_clink(6), tf("F_SOLD") + 0.04, "francs_clink", 0.75, 0.22)
    add(whoosh(0.22), tf("F_WITHOUT"), "hat_tip_whoosh", 0.65, 0.0)
    add(chime([79, 86]), tf("F_WITHOUT") + 0.08, "wink_chime", 0.55, 0.15)

    add(paper_snap(0.18), tf("F_BROKE"), "empty_pockets", 0.65, -0.2)
    add(bp(rng.standard_normal(ns(0.35)), 400, 2200) * np.exp(-np.arange(ns(0.35)) / SR / 0.14) * 0.35, tf("F_RUSTY"), "rust_flakes_rattle", 0.65, 0.15)
    add(jail_clang()[:ns(0.28)] * 0.55, tf("F_REPAINT"), "paint_bucket_drop", 0.72, 0.2)

    add(paper_snap(0.18), tf("F_PAPER"), "morning_newspaper_snap", 0.8, 0.0)
    add(chime([74, 78, 81, 86], 0.045), tf("F_PLAN"), "lightbulb_ding", 0.85, 0.0)

    add(thud(135, 0.16), tf("F_STAMP"), "wax_seal_stamp_thump", 0.92, 0.0)
    add(paper_snap(0.14), tf("F_STAMP") + 0.06, "parchment_seal", 0.65, 0.05)
    add(coin_clink(4), tf("F_SEVEN_K"), "seven_thousand_tons_glint", 0.72, 0.0)

    add(limo_horn(), tf("F_LIMO"), "limousine_bulb_horn", 0.82, 0.1)
    add(chime([79, 83, 86], 0.05), tf("F_POISSON"), "poisson_ambition_sparkle", 0.6, -0.2)
    add(I.pizz_bass(64, 0.2, 0.8), tf("F_WIFE"), "wife_suspicious_pluck", 0.72, 0.25)

    add(whoosh(0.35, 500, 2400), tf("F_WHISPER"), "bribe_whisper_hush", 0.55, -0.1)
    add(coin_clink(5), tf("F_BRIBE"), "bribe_coin_glint", 0.82, 0.0)
    add(chime([72, 76, 79, 84], 0.05), tf("F_SEALS"), "realization_gliss", 0.82, 0.0)

    add(thud(125, 0.18), tf("F_CASH"), "satchel_cash_handoff", 0.88, 0.0)
    add(paper_snap(0.22), tf("F_CASH") + 0.05, "banknotes_ruffle", 0.8, 0.12)
    add(train_chug_whistle(2.35), tf("F_TRAIN"), "vienna_express_train_whistle", 0.85, 0.0)

    add(paper_snap(0.18), tf("F_RECEIPT"), "receipt_unfurl", 0.75, -0.1)
    add(thud(95, 0.22), tf("F_UNLUCKILY"), "unluckily_drop", 0.9, 0.0)

    add(chime([76, 81], 0.06), tf("F_CLEAN"), "clean_deal_chime", 0.6, -0.3)
    add(padlock_snap(), tf("F_LOCK"), "padlock_slam_shut", 0.95, 0.2)

    add(coin_clink(3), tf("F_WATCH"), "pocket_watch_flash", 0.7, -0.15)
    add(watch_sprong(), tf("F_BREAKS"), "watch_breaks_sprong", 0.92, 0.1)

    add(paper_snap(0.16), tf("F_PAPERS"), "vienna_papers_flip_1", 0.75, 0.15)
    add(paper_snap(0.14), tf("F_PAPERS") + 0.32, "vienna_papers_flip_2", 0.68, 0.15)
    add(whoosh(0.26), tf("F_AGAIN"), "dash_back_to_paris", 0.72, 0.1)

    add(gendarme_whistle(0.95), tf("F_POLICE"), "gendarme_whistle_blast", 0.85, -0.15)
    add(foghorn(1.15), tf("F_BOLTS") + 0.12, "ocean_liner_foghorn", 0.82, 0.25)

    add(jail_clang(), tf("F_CAUGHT"), "alcatraz_bars_clang", 0.92, 0.0)
    add(chime([74, 79, 83, 86, 91], 0.055), tf("F_SALESMAN"), "apprentice_salesman_sparkle", 0.85, 0.0)

    return out, cues
