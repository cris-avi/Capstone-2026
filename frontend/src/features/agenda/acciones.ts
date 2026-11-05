import type { Tarea } from '../../types';
import { DESCRIPCION_TAREA_NUEVA } from '../../config/agenda';
import { generarId } from '../../lib/ids';
import { repositorio } from '../../services/repositorio';
import { hablar, sonido } from '../../services/sonido';
import { appStore, idsEstudianteActual } from '../../store/app';
import { confirmar } from '../../store/ui';
import { registrarEnBitacora } from '../bitacora/acciones';

/**
 * Agenda visual: rutina escolar diaria con logros.
 */

function guardarAgenda(agenda: Tarea[]): void {
  appStore.setState({ agenda });
  const ids = idsEstudianteActual();
  if (ids) repositorio.agenda.guardar(ids.profesionalId, ids.estudianteId, agenda);
}

export function alternarTarea(id: string): void {
  const tarea = appStore.getState().agenda.find((t) => t.id === id);
  if (!tarea) return;

  const terminada = !tarea.terminada;
  guardarAgenda(appStore.getState().agenda.map((t) => (t.id === id ? { ...t, terminada } : t)));

  if (!terminada) {
    sonido.clic();
    return;
  }
  sonido.exito();
  hablar(`¡Muy bien! Actividad ${tarea.titulo} terminada.`);
  registrarEnBitacora({
    tipo: 'agenda',
    frase: `Rutina escolar: Completó la actividad "${tarea.titulo.toUpperCase()}"`,
    palabrasCount: 0,
    contexto: 'Agenda Visual',
  });
}

export function escucharTarea(tarea: Tarea): void {
  hablar(`Actividad: ${tarea.titulo}. ${tarea.desc}`);
}

export async function reiniciarRutinaDia(): Promise<void> {
  const ok = await confirmar({
    titulo: 'Nuevo día escolar',
    mensaje: '¿Deseas reiniciar las tareas de la rutina para un nuevo día escolar?',
    textoConfirmar: 'Reiniciar',
  });
  if (!ok) return;
  guardarAgenda(appStore.getState().agenda.map((t) => ({ ...t, terminada: false })));
  sonido.clic();
}

export function agregarTarea(datos: { titulo: string; icono: string; hora: string }): void {
  const titulo = datos.titulo.trim();
  if (!titulo) return;

  guardarAgenda([
    ...appStore.getState().agenda,
    { id: generarId('act'), titulo, desc: DESCRIPCION_TAREA_NUEVA, icono: datos.icono, hora: datos.hora.trim(), terminada: false },
  ]);
  registrarEnBitacora({
    tipo: 'nota',
    frase: `Se agregó nueva tarea a la rutina escolar: "${titulo}"`,
    palabrasCount: 0,
    contexto: 'Agenda Visual',
    observacion: 'Adecuación de rutina por educadora',
  });
}
