import type { FiltroTipoRegistro, NuevoRegistro, RangoMetricas, Registro } from '../../types';
import { construirCSV, descargarCSV } from '../../lib/csv';
import { fechaParaArchivo, nombreParaArchivo } from '../../lib/formato';
import { generarId } from '../../lib/ids';
import { repositorio } from '../../services/repositorio';
import { sonido } from '../../services/sonido';
import { appStore, estudianteActual, idsEstudianteActual } from '../../store/app';
import { confirmar, notificar } from '../../store/ui';
import { contarInteraccionEnAcceso } from '../sesion/accesos';

/**
 * Bitácora automática PIE: todo lo que hace el estudiante y las notas docentes quedan aquí.
 */

function guardarRegistros(registros: Registro[]): void {
  appStore.setState({ registros });
  const ids = idsEstudianteActual();
  if (ids) repositorio.bitacora.guardar(ids.profesionalId, ids.estudianteId, registros);
}

export function registrarEnBitacora(datos: NuevoRegistro): void {
  // Sin estudiante seleccionado no hay a quién atribuir el registro
  const ids = idsEstudianteActual();
  if (!ids) return;

  const ahora = new Date();
  const registro: Registro = {
    id: generarId('reg'),
    estudianteId: ids.estudianteId,
    profesionalId: ids.profesionalId,
    fechaHora: ahora.toISOString(),
    fechaTexto: ahora.toLocaleDateString('es-CL', { day: '2-digit', month: '2-digit', year: 'numeric' }),
    horaTexto: ahora.toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
    tipo: datos.tipo,
    frase: datos.frase || '',
    palabrasCount: datos.palabrasCount || 0,
    contexto: datos.contexto || 'General',
    observacion: datos.observacion || '',
    nivelApoyo: datos.nivelApoyo || '',
    metaPaci: datos.metaPaci || '',
  };

  guardarRegistros([registro, ...appStore.getState().registros]);
  contarInteraccionEnAcceso(registro.tipo);
}

export function guardarNotaDocente(nota: { texto: string; contexto: string; nivelApoyo: string; metaPaci: string }): void {
  registrarEnBitacora({
    tipo: 'nota',
    frase: nota.texto,
    palabrasCount: 0,
    contexto: nota.contexto,
    observacion: 'Registro de educadora PIE',
    nivelApoyo: nota.nivelApoyo,
    metaPaci: nota.metaPaci,
  });
  sonido.exito();
}

export async function eliminarRegistro(id: string): Promise<void> {
  const ok = await confirmar({
    titulo: 'Eliminar registro',
    mensaje: '¿Deseas eliminar este registro de la bitácora?',
    textoConfirmar: 'Eliminar',
    peligro: true,
  });
  if (ok) guardarRegistros(appStore.getState().registros.filter((r) => r.id !== id));
}

export async function vaciarBitacora(): Promise<void> {
  const ok = await confirmar({
    titulo: 'Vaciar bitácora',
    mensaje: '¿Deseas vaciar toda la bitácora escolar? Esta acción reiniciará los registros.',
    textoConfirmar: 'Vaciar',
    peligro: true,
  });
  if (ok) guardarRegistros([]);
}

const ENCABEZADOS_CSV = ['ID', 'Estudiante', 'Fecha', 'Hora', 'Tipo', 'Detalle / Frase', 'Nivel de Apoyo', 'Meta PACI', 'N° Palabras', 'Contexto', 'Observaciones'];

export function exportarBitacoraCSV(): void {
  const { registros } = appStore.getState();
  if (registros.length === 0) {
    notificar('No hay registros para exportar.', 'advertencia');
    return;
  }

  const nombreEstudiante = estudianteActual()?.nombre ?? '';
  const filas = registros.map((r) => [
    r.id, nombreEstudiante, r.fechaTexto, r.horaTexto, r.tipo.toUpperCase(), r.frase,
    r.nivelApoyo, r.metaPaci, r.palabrasCount || 0, r.contexto, r.observacion,
  ]);
  descargarCSV(`TEA_yudo_Bitacora_${nombreParaArchivo(nombreEstudiante)}_${fechaParaArchivo()}.csv`, construirCSV(ENCABEZADOS_CSV, filas));
}

export function cambiarRangoMetricas(rango: RangoMetricas): void {
  sonido.clic();
  appStore.setState({ rangoMetricas: rango });
}

export function filtrarTabla(tipo: FiltroTipoRegistro): void {
  appStore.setState({ filtroTipoTabla: tipo });
}

export function cambiarContextoNota(contexto: string): void {
  appStore.setState({ contextoNota: contexto });
}
