"""Original 1925 Parisian musette-waltz & cheeky caper score for 'The Man Who Sold the Eiffel Tower'.
Synced directly to out/eiffel/timeline.json shot boundaries and story beats.
"""
import numpy as np
from dsp import SR, ns, place, pan, lp, make_ir, convolve_st
import instruments as I


def build_sections(tl: dict) -> list[tuple[str, float, float]]:
    fps = tl["fps"]
    shots = {s["id"]: s for s in tl["shots"]}
    t0 = lambda sid: shots[sid]["a"] / fps
    t1 = lambda sid: shots[sid]["b"] / fps
    return [
        ("hook",        t0(1),  t1(1)),
        ("paris_broke", t0(2),  t1(2)),
        ("cafe_plan",   t0(3),  t1(3)),
        ("crillon",     t0(4),  t1(5)),
        ("limo_tour",   t0(6),  t1(6)),
        ("bribe",       t0(7),  t1(9)),
        ("train_esc",   t0(10), t1(10)),
        ("deadpan",     t0(11), t1(11)),
        ("explainer",   t0(12), t1(12)),
        ("alley",       t0(13), t1(13)),
        ("vienna",      t0(14), t1(14)),
        ("police",      t0(15), t1(15)),
        ("finale",      t0(16), t1(16)),
    ]


def render_music(tl: dict) -> np.ndarray:
    dur = float(tl["duration_s"])
    N = ns(dur)
    out = np.zeros((2, N), dtype=np.float64)
    rng = np.random.default_rng(1925)
    secs = dict((name, (a, b)) for name, a, b in build_sections(tl))

    def add_note(buf, sig, t_s, p=0.0, gain=1.0):
        place(buf, pan(sig * gain, p), t_s)

    def waltz_bar(t_bar, beat, root, chord, mel_notes, mode="waltz"):
        """Render one 3/4 Parisian musette waltz bar."""
        add_note(out, I.pizz_bass(root - 12, beat * 0.9, 0.9), t_bar, -0.15)
        add_note(out, I.kick_drum(0.55), t_bar, 0.0)
        for b_off in (1, 2):
            for c_midi in chord:
                add_note(out, I.accordion(c_midi, beat * 0.55, 0.42), t_bar + b_off * beat, 0.25)
            add_note(out, I.brush_snare(0.45, rng), t_bar + b_off * beat, 0.2)
        for idx, m_note in enumerate(mel_notes):
            if m_note is not None:
                inst = I.accordion(m_note, beat * 0.82, 0.72) if mode == "waltz" else I.clarinet(m_note, beat * 0.8, 0.7)
                add_note(out, inst, t_bar + idx * beat, -0.22)

    def caper_bar(t_bar, beat, bass_seq, mel_seq, snare=True):
        """Render one 4/4 sneaky Parisian heist bar."""
        for i, bn in enumerate(bass_seq):
            if bn is not None:
                add_note(out, I.pizz_bass(bn, beat * 0.85, 0.88), t_bar + i * beat, -0.12)
                if i % 2 == 0:
                    add_note(out, I.kick_drum(0.42), t_bar + i * beat, 0.0)
                elif snare:
                    add_note(out, I.brush_snare(0.42, rng), t_bar + i * beat, 0.22)
        for i, mn in enumerate(mel_seq):
            if mn is not None:
                add_note(out, I.clarinet(mn, beat * 0.65, 0.68), t_bar + i * (beat * 0.5), 0.18)

    # 1. HOOK (jaunty Paris musette waltz in G major -> cheeky stab!)
    a, b = secs["hook"]
    beat = 0.36
    prog = [
        (55, [62, 67, 71], [74, 76, 79]),
        (50, [62, 66, 69], [78, 74, 71]),
        (52, [64, 67, 71], [76, 74, 72]),
        (50, [62, 66, 69], [74, 71, 67]),
        (55, [62, 67, 71], [79, None, 83]),
    ]
    t = a
    k = 0
    while t < b - 0.1:
        r, ch, mel = prog[k % len(prog)]
        waltz_bar(t, beat, r, ch, mel, "waltz")
        t += beat * 3
        k += 1

    # 2. PARIS BROKE (quirky minor pizzicato + melancholy accordion sigh)
    a, b = secs["paris_broke"]
    beat = 0.38
    t = a
    k = 0
    while t < b - 0.1:
        bseq = ([45, 48, 52, 48] if k % 2 == 0 else [43, 47, 50, 47])
        mseq = ([69, None, 68, None, 67, None, 64, None] if k % 2 == 0 else [64, None, 62, None, 60, None, 59, None])
        caper_bar(t, beat, bseq, mseq)
        t += beat * 4
        k += 1

    # 3. CAFE PLAN (sunny café musette waltz rising to bright plan chord!)
    a, b = secs["cafe_plan"]
    beat = 0.35
    cprog = [
        (57, [64, 69, 72], [76, 79, 81]),
        (50, [62, 66, 69], [78, 76, 74]),
        (55, [62, 67, 71], [79, 81, 83]),
        (60, [64, 67, 72], [84, 79, 76]),
    ]
    t = a
    k = 0
    while t < b - 0.08:
        r, ch, mel = cprog[k % len(cprog)]
        waltz_bar(t, beat, r, ch, mel, "waltz")
        t += beat * 3
        k += 1

    # 4. CRILLON HEIST (sleek sneaky pizzicato + clarinet heist groove + salon harp)
    a, b = secs["crillon"]
    beat = 0.36
    t = a
    k = 0
    while t < b - 0.1:
        if k % 4 < 2:
            bseq = [50, 53, 57, 55]
            mseq = [74, None, 77, 76, 74, None, 72, None]
        else:
            bseq = [48, 52, 55, 52]
            mseq = [72, None, 76, 74, 72, None, 69, None]
        caper_bar(t, beat, bseq, mseq)
        add_note(out, I.harp_pluck(69 + (k % 3) * 3, 0.5, 0.55), t, -0.35)
        add_note(out, I.harp_pluck(74 + (k % 2) * 3, 0.45, 0.5), t + beat * 2, 0.35)
        t += beat * 4
        k += 1

    # 5. LIMO TOUR (jaunty Champs-Élysées promenade brass + accordion!)
    a, b = secs["limo_tour"]
    beat = 0.33
    t = a
    k = 0
    while t < b - 0.08:
        waltz_bar(t, beat, 55 if k % 2 == 0 else 50, [62, 67, 71], [79, 81, 83] if k % 2 == 0 else [78, 74, 79], "waltz")
        add_note(out, I.brass_stab(67 if k % 2 == 0 else 62, 0.25, 0.65), t, 0.25)
        t += beat * 3
        k += 1

    # 6. POISSON & BRIBE (suspenseful tiptoe pizzicato -> comedic triumph on bribe realization!)
    a, b = secs["bribe"]
    ev = tl["events"]
    fps = tl["fps"]
    t_seals = ev["F_SEALS"] / fps
    beat = 0.38
    t = a
    k = 0
    while t < b - 0.1:
        if t < t_seals:
            bseq = [45, None, 48, 51] if k % 2 == 0 else [44, None, 47, 50]
            mseq = [None, 69, None, 68, None, 67, None, None]
            caper_bar(t, beat, bseq, mseq, snare=False)
            add_note(out, I.woodblock(80, 0.45), t + beat, 0.3)
        else:
            waltz_bar(t, 0.34, 55, [62, 67, 71], [79, 83, 86], "waltz")
            add_note(out, I.harp_pluck(83, 0.55, 0.65), t, -0.3)
        t += beat * 4 if t < t_seals else 0.34 * 3
        k += 1

    # 7. TRAIN ESCAPE (galloping 2/4 train-rhythm accordion & clarinet!)
    a, b = secs["train_esc"]
    beat = 0.28
    t = a
    k = 0
    while t < b - 0.08:
        bseq = [55, 62, 55, 62] if k % 2 == 0 else [50, 57, 50, 57]
        mseq = [79, 81, 83, 79, 81, 79, 76, 74] if k % 2 == 0 else [78, 76, 74, 78, 81, 78, 74, None]
        caper_bar(t, beat, bseq, mseq)
        add_note(out, I.accordion(67 if k % 2 == 0 else 66, beat * 0.6, 0.55), t + beat, -0.25)
        t += beat * 4
        k += 1

    # 8. DEADPAN ("Luckily..." bright chord -> "Unluckily..." comedic wah-wah stagger!)
    a, b = secs["deadpan"]
    t_unl = ev["F_UNLUCKILY"] / fps
    waltz_bar(a, 0.34, 55, [62, 67, 71], [79, 83, 86], "waltz")
    waltz_bar(a + 1.02, 0.34, 60, [64, 67, 72], [84, 79, 76], "waltz")
    for idx, mn in enumerate([67, 66, 65, 64]):
        add_note(out, I.brass_stab(mn, 0.42, 0.78), t_unl + idx * 0.44, 0.0)
        add_note(out, I.pizz_bass(mn - 12, 0.35, 0.75), t_unl + idx * 0.44, -0.2)

    # 9. EXPLAINER (crisp inquisitive pizzicato + harp marimba pulse)
    a, b = secs["explainer"]
    beat = 0.35
    t = a
    k = 0
    while t < b - 0.08:
        bseq = [48, 55, 52, 55] if k % 2 == 0 else [45, 52, 48, 52]
        mseq = [72, None, 76, None, 79, None, 76, None]
        caper_bar(t, beat, bseq, mseq)
        add_note(out, I.harp_pluck(76 if k % 2 == 0 else 72, 0.45, 0.6), t, 0.3)
        t += beat * 4
        k += 1

    # 10. ALLEY WATCH (sneaky noir walking bass + playful tick-tock woodblock)
    a, b = secs["alley"]
    beat = 0.36
    t = a
    k = 0
    while t < b - 0.08:
        bseq = [45, 48, 50, 51] if k % 2 == 0 else [52, 50, 48, 45]
        mseq = [69, None, 72, None, 74, None, 75, None]
        caper_bar(t, beat, bseq, mseq, snare=False)
        for w_i in range(4):
            add_note(out, I.woodblock(82 if w_i % 2 == 0 else 78, 0.5), t + w_i * beat, 0.28)
        t += beat * 4
        k += 1

    # 11. VIENNA RETURN (sunny Viennese waltz -> eager Paris return gallop)
    a, b = secs["vienna"]
    beat = 0.34
    t = a
    k = 0
    while t < b - 0.08:
        r = [53, 57, 55, 60][k % 4]
        ch = [[65, 69, 72], [69, 72, 76], [67, 71, 74], [64, 67, 72]][k % 4]
        mel = [[77, 81, 84], [81, 79, 77], [79, 77, 74], [76, 79, 84]][k % 4]
        waltz_bar(t, beat, r, ch, mel, "waltz")
        t += beat * 3
        k += 1

    # 12. POLICE BUST (fast Keystone chase galop + brass chase stabs!)
    a, b = secs["police"]
    beat = 0.25
    t = a
    k = 0
    while t < b - 0.06:
        bseq = [50, 57, 50, 57] if k % 2 == 0 else [52, 59, 52, 59]
        mseq = [74, 77, 81, 77, 74, 77, 81, 86] if k % 2 == 0 else [76, 79, 83, 79, 76, 74, 72, 71]
        caper_bar(t, beat, bseq, mseq)
        add_note(out, I.brass_stab(69 if k % 2 == 0 else 71, 0.18, 0.72), t, -0.25)
        t += beat * 4
        k += 1

    # 13. FINALE (Alcatraz minor brass -> golden Paris triumphant musette finale + button!)
    a, b = secs["finale"]
    t_sal = ev["F_SALESMAN_CUT"] / fps
    add_note(out, I.brass_stab(50, 0.75, 0.8), a + 0.1, -0.15)
    add_note(out, I.brass_stab(53, 0.75, 0.8), a + 0.1, 0.15)
    add_note(out, I.pizz_bass(38, 1.0, 0.9), a + 0.1, 0.0)
    add_note(out, I.pizz_bass(45, 0.9, 0.85), a + 1.15, 0.0)
    add_note(out, I.clarinet(69, 0.8, 0.65), a + 1.15, 0.2)

    beat = 0.35
    fprog = [
        (55, [62, 67, 71], [74, 79, 83]),
        (60, [64, 67, 72], [84, 83, 79]),
        (50, [62, 66, 69], [81, 78, 74]),
        (55, [62, 67, 71], [79, 83, 86]),
    ]
    t = t_sal
    k = 0
    while t < b - 0.65:
        r, ch, mel = fprog[k % len(fprog)]
        waltz_bar(t, beat, r, ch, mel, "waltz")
        t += beat * 3
        k += 1
    # Final triumphant Parisian major button chord right at the end!
    t_end = max(t_sal + 1.0, b - 0.55)
    for m_n in (55, 62, 67, 71, 79):
        add_note(out, I.accordion(m_n, 0.50, 0.82), t_end, 0.0)
    add_note(out, I.brass_stab(67, 0.48, 0.85), t_end, 0.1)
    add_note(out, I.harp_pluck(91, 0.55, 0.75), t_end + 0.05, -0.25)

    # Gentle studio room glue & warm high-shelf rolloff
    ir = make_ir(rt60=0.45, seed=1925, hf=0.7)
    wet = out * 0.86 + convolve_st(out, ir)[:, :N] * 0.14
    return np.vstack([lp(wet[0], 11500), lp(wet[1], 11500)])
