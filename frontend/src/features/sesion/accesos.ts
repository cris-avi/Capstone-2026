import type { Acceso, TipoInteraccion, TipoRegistro } from '../../types';
import { LATIDO_INTERVALO_MS } from '../../config/constantes';
import { generarId } from '../../lib/ids';
import { repositorio } from '../../services/repositorio';
import { accesoActivo, appStore } from '../../store/app';
import { guardarSesion } from './sesion';

/**
 * Registro de accesos de los estudiantes: cada vez que el profesional abre la sesión
 * de un estudiante se guarda inicio, término, duración e interacciones.
 */

/* ---------- Cálculos ---------- */

export function duracionAccesoMs(acceso: Acceso, ahora: number = Date.now()): number {
  const fin = acceso.fin ? new Date(acceso.fin).getTime() : ahora;
  return Math.max(0, fin - new Date(acceso.inicio).getTime());
}

export function estadisticasEstudiante(accesos: Acceso[], estudianteId: string) {
  const propios = accesos.filter((a) => a.estudianteId === estudianteId);
  return {
    total: propios.length,
    tiempoTotalMs: propios.reduce((suma, a) => suma + duracionAccesoMs(a), 0),
    ultimoInicio: propios.length ? propios[0].inicio : null,
  };
}

export function resumenInteracciones(acceso: Acceso): string {
  const i: Partial<Acceso['interacciones']> = acceso.interacciones || {};
  return [
    i.frase ? `🗣️ ${i.frase}` : '',
    i.termometro ? `🌡️ ${i.termometro}` : '',
    i.agenda ? `📅 ${i.agenda}` : '',
  ].filter(Boolean).join(' · ');
}

/* ---------- Acciones ---------- */

function guardarAccesos(accesos: Acceso[]): void {
  const { usuario } = appStore.getState();
  appStore.setState({ accesos });
  if (usuario) repositorio.accesos.guardar(usuario.id, accesos);
}

function actualizarAcceso(id: string, cambios: Partial<Acceso>): void {
  guardarAccesos(appStore.getState().accesos.map((a) => (a.id === id ? { ...a, ...cambios } : a)));
}

export function iniciarAcceso(estudianteId: string): void {
  const ahora = new Date().toISOString();
  const acceso: Acceso = {
    id: generarId('acc'),
    estudianteId,
    inicio: ahora,
    fin: null,
    ultimaActividad: ahora,
    interacciones: { frase: 0, termometro: 0, agenda: 0 },
  };
  appStore.setState({ accesoActivoId: acceso.id });
  guardarAccesos([acceso, ...appStore.getState().accesos]);
  guardarSesion();
}

// Retorna el acceso cerrado (o null si no había uno en curso)
export function terminarAccesoActivo(): Acceso | null {
  const acceso = accesoActivo();
  let cerrado: Acceso | null = null;
  if (acceso && !acceso.fin) {
    const fin = new Date().toISOString();
    cerrado = { ...acceso, fin, ultimaActividad: fin };
    actualizarAcceso(acceso.id, { fin, ultimaActividad: fin });
  }
  appStore.setState({ accesoActivoId: null });
  guardarSesion();
  return cerrado;
}

// Accesos que quedaron abiertos (pestaña cerrada, inactividad) se cierran en su última actividad
export function cerrarAccesosHuerfanos(): void {
  const { accesos, accesoActivoId } = appStore.getState();
  const huerfanos = accesos.some((a) => !a.fin && a.id !== accesoActivoId);
  if (!huerfanos) return;
  guardarAccesos(accesos.map((a) => (!a.fin && a.id !== accesoActivoId ? { ...a, fin: a.ultimaActividad || a.inicio } : a)));
}

export function contarInteraccionEnAcceso(tipo: TipoRegistro): void {
  const acceso = accesoActivo();
  if (!acceso || !(tipo in acceso.interacciones)) return;
  const clave = tipo as TipoInteraccion;
  actualizarAcceso(acceso.id, {
    interacciones: { ...acceso.interacciones, [clave]: acceso.interacciones[clave] + 1 },
    ultimaActividad: new Date().toISOString(),
  });
}

// Guarda la última actividad para medir la duración real aunque se cierre la pestaña
let ultimoLatido = 0;

export function registrarLatido(forzar = false): void {
  if (!appStore.getState().usuario) return;
  const ahora = Date.now();
  if (!forzar && ahora - ultimoLatido < LATIDO_INTERVALO_MS) return;
  ultimoLatido = ahora;

  const acceso = accesoActivo();
  if (acceso) actualizarAcceso(acceso.id, { ultimaActividad: new Date(ahora).toISOString() });
  guardarSesion();
}
