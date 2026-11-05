import type { Tarea } from '../../types';
import { crearRutinaPredeterminada } from '../../config/agenda';
import { repositorio } from '../../services/repositorio';
import { appStore, idsEstudianteActual } from '../../store/app';

/**
 * Sesión persistente del profesional y carga de los datos del estudiante seleccionado.
 */

export function guardarSesion(): void {
  const { usuario, estudianteId, accesoActivoId } = appStore.getState();
  if (!usuario) return;
  repositorio.sesion.guardar({
    usuarioId: usuario.id,
    estudianteId,
    accesoId: accesoActivoId,
    ultimaActividad: Date.now(),
  });
}

// Activa o desactiva el modo profesional; los controles que dependen de él se refrescan solos
export function establecerDesbloqueo(desbloqueado: boolean): void {
  appStore.setState({ desbloqueado });
}

// Un estudiante sin agenda guardada parte con la rutina escolar predefinida
function cargarAgenda(profesionalId: string, estudianteId: string): Tarea[] {
  const guardada = repositorio.agenda.cargar(profesionalId, estudianteId);
  if (guardada) return guardada;
  const rutina = crearRutinaPredeterminada();
  repositorio.agenda.guardar(profesionalId, estudianteId, rutina);
  return rutina;
}

// Recarga comunicador, agenda y bitácora con los datos del estudiante seleccionado
export function cargarDatosEstudiante(): void {
  const ids = idsEstudianteActual();
  if (!ids) {
    appStore.setState({ fraseActual: [], pictogramasPersonalizados: [], registros: [], agenda: [] });
    return;
  }
  appStore.setState({
    fraseActual: [],
    pictogramasPersonalizados: repositorio.pictogramas.cargar(ids.profesionalId, ids.estudianteId) ?? [],
    registros: repositorio.bitacora.cargar(ids.profesionalId, ids.estudianteId) ?? [],
    agenda: cargarAgenda(ids.profesionalId, ids.estudianteId),
  });
}

export function seleccionarEstudiante(id: string): boolean {
  const { estudiantes, estudianteId } = appStore.getState();
  if (!estudiantes.some((e) => e.id === id)) return false;
  if (estudianteId !== id) {
    appStore.setState({ estudianteId: id });
    cargarDatosEstudiante();
  }
  guardarSesion();
  return true;
}
