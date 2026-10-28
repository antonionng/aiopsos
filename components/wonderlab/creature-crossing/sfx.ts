/** Tiny synthesised sound effects. No audio files, and nothing plays until the player has tapped. */
type Tone = { freq: number; at?: number; length?: number; type?: OscillatorType; gain?: number; slide?: number };

let context: AudioContext | null = null;
let muted = false;

export function setMuted(value: boolean) {
  muted = value;
}

function ctx() {
  if (typeof window === "undefined") return null;
  try {
    context ??= new AudioContext();
    if (context.state === "suspended") void context.resume();
    return context;
  } catch {
    return null;
  }
}

function play(tones: Tone[]) {
  if (muted) return;
  const audio = ctx();
  if (!audio) return;
  const now = audio.currentTime;
  for (const tone of tones) {
    const start = now + (tone.at ?? 0);
    const end = start + (tone.length ?? 0.15);
    const osc = audio.createOscillator();
    const gain = audio.createGain();
    osc.type = tone.type ?? "sine";
    osc.frequency.setValueAtTime(tone.freq, start);
    if (tone.slide) osc.frequency.exponentialRampToValueAtTime(tone.slide, end);
    gain.gain.setValueAtTime(0.0001, start);
    gain.gain.exponentialRampToValueAtTime(tone.gain ?? 0.12, start + 0.015);
    gain.gain.exponentialRampToValueAtTime(0.0001, end);
    osc.connect(gain).connect(audio.destination);
    osc.start(start);
    osc.stop(end + 0.02);
  }
}

export const sfx = {
  pick: () => play([{ freq: 660, length: 0.09, type: "triangle" }, { freq: 990, at: 0.07, length: 0.12, type: "triangle" }]),
  unpick: () => play([{ freq: 520, length: 0.12, type: "triangle", slide: 330 }]),
  gate: () => play([{ freq: 392, length: 0.5, type: "sine", gain: 0.08 }, { freq: 587, at: 0.1, length: 0.5, gain: 0.07 }, { freq: 784, at: 0.2, length: 0.6, gain: 0.06 }]),
  scan: () => play([{ freq: 880, length: 0.06, type: "square", gain: 0.03 }]),
  home: () => play([{ freq: 784, length: 0.08, type: "triangle" }, { freq: 1175, at: 0.06, length: 0.14, type: "triangle" }]),
  lost: () => play([{ freq: 300, length: 0.25, type: "sawtooth", gain: 0.05, slide: 180 }]),
  unsure: () => play([{ freq: 520, length: 0.12, type: "sine", gain: 0.07 }, { freq: 440, at: 0.14, length: 0.18, type: "sine", gain: 0.07 }]),
  win: () =>
    play([523, 659, 784, 1047].map((freq, index) => ({ freq, at: index * 0.11, length: 0.35, type: "triangle" as const, gain: 0.09 }))),
  star: (index: number) => play([{ freq: 880 + index * 220, length: 0.25, type: "triangle", gain: 0.09 }]),
};
