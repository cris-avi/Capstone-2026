/**
 * Voz (Web Speech API) y efectos de sonido (Web Audio API).
 * No conoce el estado de la app: quien llama decide si el sonido está activado.
 */

type ConstructorAudio = typeof AudioContext;

function obtenerConstructorAudio(): ConstructorAudio | undefined {
  return window.AudioContext || (window as unknown as { webkitAudioContext?: ConstructorAudio }).webkitAudioContext;
}

// Un único contexto compartido para los efectos cortos (clic, logro, error)
let contextoEfectos: AudioContext | null = null;

function obtenerContextoEfectos(): AudioContext | null {
  const Ctor = obtenerConstructorAudio();
  if (!Ctor) return null;
  if (!contextoEfectos || contextoEfectos.state === 'closed') contextoEfectos = new Ctor();
  if (contextoEfectos.state === 'suspended') contextoEfectos.resume().catch(() => {});
  return contextoEfectos;
}

/* ---------- Voz ---------- */

let voces: SpeechSynthesisVoice[] = [];
let turnoVoz = 0;

export function iniciarVoces(): void {
  const sintetizador = window.speechSynthesis;
  if (!sintetizador) return;
  const cargarVoces = () => { voces = sintetizador.getVoices(); };
  cargarVoces();
  if (sintetizador.onvoiceschanged !== undefined) sintetizador.onvoiceschanged = cargarVoces;
}

interface EventosVoz {
  alIniciar?: () => void;
  alTerminar?: () => void;
}

// Sintetiza texto en español con velocidad adecuada; alTerminar solo se avisa para el último mensaje
export function hablar(texto: string, eventos: EventosVoz = {}): void {
  const sintetizador = window.speechSynthesis;
  if (!sintetizador) return;
  sintetizador.cancel();

  const mensaje = new SpeechSynthesisUtterance(texto);
  mensaje.lang = 'es-ES';
  mensaje.rate = 0.88;
  mensaje.pitch = 1.05;

  const vozEs = voces.find((v) => v.lang.startsWith('es') && ['Natural', 'Google', 'Sabina', 'Jorge'].some((n) => v.name.includes(n)));
  if (vozEs) mensaje.voice = vozEs;

  const turno = ++turnoVoz;
  const terminar = () => { if (turno === turnoVoz) eventos.alTerminar?.(); };
  mensaje.onend = terminar;
  mensaje.onerror = terminar;

  eventos.alIniciar?.();
  sintetizador.speak(mensaje);
}

/* ---------- Efectos ---------- */

// Sonido tipo "pop" suave para clics
export function tonoClic(): void {
  try {
    const ctx = obtenerContextoEfectos();
    if (!ctx) return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(520, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(440, ctx.currentTime + 0.08);
    gain.gain.setValueAtTime(0.12, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.08);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.08);
  } catch (e) {}
}

// Arpegio armónico de 3 notas (acorde Do Mayor) para celebrar un logro
export function tonoExito(): void {
  try {
    const ctx = obtenerContextoEfectos();
    if (!ctx) return;
    [523.25, 659.25, 783.99].forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const inicio = ctx.currentTime + idx * 0.09;
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, inicio);
      gain.gain.setValueAtTime(0.15, inicio);
      gain.gain.exponentialRampToValueAtTime(0.001, inicio + 0.25);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(inicio);
      osc.stop(inicio + 0.25);
    });
  } catch (e) {}
}

// Tono grave y corto para un PIN incorrecto
export function tonoError(): void {
  try {
    const ctx = obtenerContextoEfectos();
    if (!ctx) return;
    const osc = ctx.createOscillator();
    osc.frequency.setValueAtTime(200, ctx.currentTime);
    osc.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.15);
  } catch (e) {}
}

/* ---------- Lluvia relajante ---------- */

// Ruido rosa con filtro paso bajo para que suene como lluvia lejana. Retorna la función para detenerlo.
export function iniciarLluvia(): () => void {
  const Ctor = obtenerConstructorAudio();
  if (!Ctor) throw new Error('Web Audio no disponible');
  const ctx = new Ctor();
  const bufferSize = ctx.sampleRate * 2;
  const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const output = noiseBuffer.getChannelData(0);

  let b0 = 0, b1 = 0, b2 = 0;
  for (let i = 0; i < bufferSize; i++) {
    const blanco = Math.random() * 2 - 1;
    b0 = 0.99886 * b0 + blanco * 0.0555179;
    b1 = 0.99332 * b1 + blanco * 0.0750759;
    b2 = 0.969 * b2 + blanco * 0.153852;
    output[i] = (b0 + b1 + b2) * 0.04;
  }

  const ruido = ctx.createBufferSource();
  ruido.buffer = noiseBuffer;
  ruido.loop = true;

  const filtro = ctx.createBiquadFilter();
  filtro.type = 'lowpass';
  filtro.frequency.setValueAtTime(800, ctx.currentTime);

  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0.08, ctx.currentTime);

  ruido.connect(filtro);
  filtro.connect(gain);
  gain.connect(ctx.destination);
  ruido.start();

  return () => { ctx.close().catch(() => {}); };
}
