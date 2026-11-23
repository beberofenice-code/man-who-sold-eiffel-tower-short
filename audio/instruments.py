"""Synthesized 1925 Parisian caper instruments (48 kHz float64 mono).
Musette accordion, upright pizzicato bass, French clarinet, brass horn stab, harp/celesta sparkle, brushed percussion.
"""
import numpy as np
from scipy import signal
from dsp import SR, ns, lp, hp, bp

def m2f(midi: float) -> float:
    return 440.0 * (2.0 ** ((midi - 69.0) / 12.0))

def _adsr(n: int, a: float, d: float, s: float, r: float) -> np.ndarray:
    na, nd, nr = max(1, ns(a)), max(1, ns(d)), max(1, ns(r))
    env = np.full(n, s, dtype=np.float64)
    na = min(na, n)
    env[:na] = np.linspace(0.0, 1.0, na)
    nd_end = min(n, na + nd)
    if nd_end > na:
        env[na:nd_end] = np.linspace(1.0, s, nd_end - na)
    nr = min(nr, n)
    if nr > 0:
        env[-nr:] *= np.linspace(1.0, 0.0, nr)
    return env

def accordion(midi: float, dur: float, vel: float = 0.8) -> np.ndarray:
    """Authentic Parisian musette accordion with dual detuned reeds (+4.5 / -4.5 cents)."""
    n = ns(dur + 0.08)
    t = np.arange(n) / SR
    f0 = m2f(midi)
    out = np.zeros(n)
    for det in (1.0, 2.0 ** (4.5 / 1200.0), 2.0 ** (-4.2 / 1200.0)):
        f = f0 * det
        sig = np.zeros(n)
        for h, amp in ((1, 1.0), (2, 0.58), (3, 0.42), (4, 0.22), (5, 0.16), (6, 0.08)):
            if f * h < SR * 0.42:
                sig += amp * np.sin(2 * np.pi * f * h * t)
        out += sig * (0.45 if det == 1.0 else 0.28)
    out = bp(out, max(120, f0 * 0.65), min(6500, f0 * 7.5))
    env = _adsr(n, 0.025, 0.08, 0.78, 0.07)
    return out * env * vel * 0.26

def pizz_bass(midi: float, dur: float, vel: float = 0.85) -> np.ndarray:
    """Plucky sneaky upright pizzicato double-bass."""
    n = ns(dur + 0.05)
    t = np.arange(n) / SR
    f0 = m2f(midi)
    # Pitch drops slightly right after finger pluck
    ph = 2 * np.pi * np.cumsum(f0 * (1.0 + 0.025 * np.exp(-t / 0.015))) / SR
    sig = 1.0 * np.sin(ph) + 0.45 * np.sin(2 * ph) * np.exp(-t / 0.16) + 0.18 * np.sin(3 * ph) * np.exp(-t / 0.08)
    env = np.minimum(t / 0.006, 1.0) * np.exp(-t / max(0.14, dur * 0.65))
    return lp(sig * env, 950) * vel * 0.42

def clarinet(midi: float, dur: float, vel: float = 0.75) -> np.ndarray:
    """Warm French clarinet (odd-harmonic rich woodwind with gentle vibrato)."""
    n = ns(dur + 0.06)
    t = np.arange(n) / SR
    f0 = m2f(midi)
    vib = 1.0 + 0.004 * np.sin(2 * np.pi * 5.2 * t) * np.minimum(t / 0.15, 1.0)
    ph = 2 * np.pi * np.cumsum(f0 * vib) / SR
    sig = (1.0 * np.sin(ph) + 0.12 * np.sin(2 * ph) + 0.55 * np.sin(3 * ph)
           + 0.08 * np.sin(4 * ph) + 0.24 * np.sin(5 * ph) + 0.10 * np.sin(7 * ph))
    env = _adsr(n, 0.02, 0.06, 0.82, 0.06)
    return lp(sig * env, 3800) * vel * 0.24

def brass_stab(midi: float, dur: float, vel: float = 0.8) -> np.ndarray:
    """Punchy cabaret muted trumpet/trombone stab."""
    n = ns(dur + 0.06)
    t = np.arange(n) / SR
    f0 = m2f(midi)
    sig = np.zeros(n)
    for h in range(1, 9):
        if f0 * h < SR * 0.42:
            sig += (1.0 / (h ** 0.78)) * np.sin(2 * np.pi * f0 * h * t)
    env = _adsr(n, 0.015, 0.07, 0.72, 0.05)
    return bp(sig * env, 180, 3400) * vel * 0.26

def harp_pluck(midi: float, dur: float = 0.55, vel: float = 0.7) -> np.ndarray:
    """Bright Parisian salon harp / celesta pluck."""
    n = ns(dur)
    t = np.arange(n) / SR
    f0 = m2f(midi)
    sig = (np.sin(2 * np.pi * f0 * t)
           + 0.40 * np.sin(4 * np.pi * f0 * t) * np.exp(-t / 0.14)
           + 0.16 * np.sin(6 * np.pi * f0 * t) * np.exp(-t / 0.07))
    env = np.minimum(t / 0.004, 1.0) * np.exp(-t / max(0.16, dur * 0.42))
    return sig * env * vel * 0.24

def brush_snare(vel: float = 0.6, rng: np.random.Generator | None = None) -> np.ndarray:
    r = rng or np.random.default_rng(7)
    n = ns(0.11)
    t = np.arange(n) / SR
    nz = r.standard_normal(n)
    return bp(nz, 1800, 7500) * np.exp(-t / 0.028) * vel * 0.28

def kick_drum(vel: float = 0.75) -> np.ndarray:
    n = ns(0.18)
    t = np.arange(n) / SR
    f = 135 * np.exp(-t / 0.028) + 46
    ph = 2 * np.pi * np.cumsum(f) / SR
    return np.sin(ph) * np.exp(-t / 0.065) * vel * 0.44

def woodblock(midi: float = 78, vel: float = 0.65) -> np.ndarray:
    n = ns(0.06)
    t = np.arange(n) / SR
    f0 = m2f(midi)
    sig = np.sin(2 * np.pi * f0 * t) + 0.35 * np.sin(2 * np.pi * f0 * 1.48 * t)
    return sig * np.exp(-t / 0.012) * vel * 0.30
