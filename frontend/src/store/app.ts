import type {
  Acceso, Estudiante, FiltroCategoria, FiltroTipoRegistro, Pictograma, RangoMetricas, Registro, Tarea, Usuario, Vista,
} from '../types';
import { CONTEXTOS_ESCOLARES } from '../config/bitacora';
import { createStore, useStore } from './createStore';

/**
 * Estado centralizado de la aplicación.
 */
export interface EstadoApp {
  // Sesión del profesional
  usuario: Usuario | null;            // Profesional con sesión iniciada
  estudiantes: Estudiante[];          // Estudiantes del profesional
  accesos: Acceso[];                  // Historial de accesos de sus estudiantes
  estudianteId: string | null;        // Estudiante cuyos datos están cargados
  accesoActivoId: string | null;      // Acceso en curso (el estudiante está usando el dispositivo)
  desbloqueado: boolean;              // Área profesional desbloqueada (login o PIN)

  // Datos del estudiante cargado
  registros: Registro[];              // Historial de bitácora
  agenda: Tarea[];                    // Tareas de la rutina diaria
  pictogramasPersonalizados: Pictograma[];
  fraseActual: Pictograma[];          // Pictogramas en la tira de frase

  // Interfaz
  vista: Vista;
  pantallaAuthVisible: boolean;
  modalPin: { destino: Vista } | null; // Modal de PIN abierto y vista a abrir tras desbloquear
  sonidoActivo: boolean;
  hablando: boolean;
  lluviaActiva: boolean;
  categoriaFiltro: FiltroCategoria;
  filtroTipoTabla: FiltroTipoRegistro;
  rangoMetricas: RangoMetricas;
  contextoNota: string;               // Contexto escolar elegido; también se aplica a las frases habladas
  filtroAccesos: string;              // 'todos' o id de estudiante
  ahora: number;                      // Reloj para refrescar las duraciones visibles
}

export const appStore = createStore<EstadoApp>({
  usuario: null,
  estudiantes: [],
  accesos: [],
  estudianteId: null,
  accesoActivoId: null,
  desbloqueado: false,

  registros: [],
  agenda: [],
  pictogramasPersonalizados: [],
  fraseActual: [],

  vista: 'panel',
  pantallaAuthVisible: false,
  modalPin: null,
  sonidoActivo: true,
  hablando: false,
  lluviaActiva: false,
  categoriaFiltro: 'todas',
  filtroTipoTabla: 'todas',
  rangoMetricas: 'historico',
  contextoNota: CONTEXTOS_ESCOLARES[0].valor,
  filtroAccesos: 'todos',
  ahora: Date.now(),
});

export function useApp<S>(selector: (estado: EstadoApp) => S): S {
  return useStore(appStore, selector);
}

/* ---------- Selectores derivados ---------- */

export function estudianteActual(estado: EstadoApp = appStore.getState()): Estudiante | null {
  return estado.estudiantes.find((e) => e.id === estado.estudianteId) ?? null;
}

export function accesoActivo(estado: EstadoApp = appStore.getState()): Acceso | null {
  return estado.accesoActivoId ? estado.accesos.find((a) => a.id === estado.accesoActivoId) ?? null : null;
}

// Ids con los que se guardan los datos del estudiante cargado (o null si no hay)
export function idsEstudianteActual(estado: EstadoApp = appStore.getState()): { profesionalId: string; estudianteId: string } | null {
  return estado.usuario && estado.estudianteId
    ? { profesionalId: estado.usuario.id, estudianteId: estado.estudianteId }
    : null;
}

// Las vistas del estudiante se muestran con un estudiante cargado y su sesión activa o el modo profesional
export function vistasEstudianteDisponibles(estado: EstadoApp): boolean {
  return !!estado.estudianteId && (!!estado.accesoActivoId || estado.desbloqueado);
}
