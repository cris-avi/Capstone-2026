import type { TipoNotificacion } from '../types';
import { NOTIFICACION_DURACION_MS } from '../config/constantes';
import { createStore, useStore } from './createStore';

/**
 * Servicios de interfaz reutilizables: notificaciones (toast) y diálogo de confirmación.
 * Reemplazan a window.alert y window.confirm, que pueden estar bloqueados dentro del iframe de AI Studio.
 */

export interface Notificacion {
  id: number;
  mensaje: string;
  tipo: TipoNotificacion;
  saliendo: boolean;
}

export interface OpcionesConfirmacion {
  titulo: string;
  mensaje: string;
  textoConfirmar?: string;
  peligro?: boolean;
}

interface SolicitudConfirmacion extends Required<OpcionesConfirmacion> {
  resolver: (confirmado: boolean) => void;
}

interface EstadoUI {
  notificaciones: Notificacion[];
  confirmacion: SolicitudConfirmacion | null;
}

const uiStore = createStore<EstadoUI>({ notificaciones: [], confirmacion: null });

export function useUI<S>(selector: (estado: EstadoUI) => S): S {
  return useStore(uiStore, selector);
}

/* ---------- Notificaciones accesibles no bloqueantes ---------- */

let siguienteId = 1;

export function notificar(mensaje: string, tipo: TipoNotificacion = 'info'): void {
  const id = siguienteId++;
  uiStore.setState((s) => ({ notificaciones: [...s.notificaciones, { id, mensaje, tipo, saliendo: false }] }));
  setTimeout(() => cerrarNotificacion(id), NOTIFICACION_DURACION_MS);
}

// Primero se desvanece y luego se retira del DOM
export function cerrarNotificacion(id: number): void {
  uiStore.setState((s) => ({ notificaciones: s.notificaciones.map((n) => (n.id === id ? { ...n, saliendo: true } : n)) }));
  setTimeout(() => {
    uiStore.setState((s) => ({ notificaciones: s.notificaciones.filter((n) => n.id !== id) }));
  }, 300);
}

/* ---------- Confirmación ---------- */

export function confirmar({ titulo, mensaje, textoConfirmar = 'Confirmar', peligro = false }: OpcionesConfirmacion): Promise<boolean> {
  return new Promise((resolver) => {
    // Una confirmación pendiente se da por cancelada si se abre otra
    uiStore.getState().confirmacion?.resolver(false);
    uiStore.setState({ confirmacion: { titulo, mensaje, textoConfirmar, peligro, resolver } });
  });
}

export function responderConfirmacion(confirmado: boolean): void {
  const solicitud = uiStore.getState().confirmacion;
  if (!solicitud) return;
  uiStore.setState({ confirmacion: null });
  solicitud.resolver(confirmado);
}
