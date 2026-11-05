import type { Acceso } from '../../types';
import { construirCSV, descargarCSV } from '../../lib/csv';
import { fechaParaArchivo, formatearDuracion, formatearFecha, formatearHora } from '../../lib/formato';
import { generarId } from '../../lib/ids';
import { repositorio } from '../../services/repositorio';
import { hablar, sonido } from '../../services/sonido';
import { accesoActivo, appStore, estudianteActual, type EstadoApp } from '../../store/app';
import { confirmar, notificar } from '../../store/ui';
import { duracionAccesoMs, iniciarAcceso, terminarAccesoActivo } from '../sesion/accesos';
import { navegarA, volverASesionEstudiante } from '../sesion/navegacion';
import { cargarDatosEstudiante, establecerDesbloqueo, guardarSesion, seleccionarEstudiante } from '../sesion/sesion';

/**
 * Panel del profesional: gestión de estudiantes, sus sesiones y el historial de accesos.
 */

function nombreEstudiante(id: string, porDefecto = 'otro estudiante'): string {
  return appStore.getState().estudiantes.find((e) => e.id === id)?.nombre ?? porDefecto;
}

/* ---------- Flujo de sesión del estudiante ---------- */

export async function iniciarSesionEstudiante(id: string): Promise<void> {
  const activo = accesoActivo();
  if (activo && activo.estudianteId === id) {
    volverASesionEstudiante();
    return;
  }
  if (activo) {
    const ok = await confirmar({
      titulo: 'Cambiar de estudiante',
      mensaje: `Se terminará la sesión en curso de ${nombreEstudiante(activo.estudianteId)}.`,
      textoConfirmar: 'Terminar y cambiar',
    });
    if (!ok) return;
    terminarAccesoActivo();
  }

  if (!seleccionarEstudiante(id)) return;
  iniciarAcceso(id);
  establecerDesbloqueo(false);
  navegarA('nino');

  const estudiante = estudianteActual();
  if (!estudiante) return;
  hablar(`Hola, ${estudiante.nombre}`);
  notificar(`Sesión de ${estudiante.nombre} iniciada. El área profesional quedó bloqueada.`, 'exito');
}

export function terminarSesionEstudiante(): void {
  const activo = accesoActivo();
  if (!activo) return;
  const nombre = nombreEstudiante(activo.estudianteId, 'estudiante');
  const cerrado = terminarAccesoActivo() ?? activo;
  sonido.clic();
  notificar(`Sesión de ${nombre} terminada (${formatearDuracion(duracionAccesoMs(cerrado))}).`, 'info');
}

export async function verBitacoraEstudiante(id: string): Promise<void> {
  const activo = accesoActivo();
  if (activo && activo.estudianteId !== id) {
    const ok = await confirmar({
      titulo: 'Sesión en curso',
      mensaje: `Para revisar otro estudiante se terminará la sesión en curso de ${nombreEstudiante(activo.estudianteId)}.`,
      textoConfirmar: 'Terminar y continuar',
    });
    if (!ok) return;
    terminarAccesoActivo();
  }
  if (seleccionarEstudiante(id)) navegarA('pie');
}

/* ---------- Gestión de estudiantes ---------- */

export function guardarEstudiante(datos: { id: string | null; nombre: string; curso: string; avatar: string }): boolean {
  const { usuario, estudiantes, estudianteId } = appStore.getState();
  const nombre = datos.nombre.trim();
  if (!usuario || !nombre) return false;

  let lista;
  if (datos.id) {
    if (!estudiantes.some((e) => e.id === datos.id)) return false;
    lista = estudiantes.map((e) => (e.id === datos.id ? { ...e, nombre, curso: datos.curso, avatar: datos.avatar } : e));
  } else {
    lista = [...estudiantes, { id: generarId('est'), nombre, curso: datos.curso, avatar: datos.avatar, creadoEn: new Date().toISOString() }];
  }
  appStore.setState({ estudiantes: lista });
  repositorio.estudiantes.guardar(usuario.id, lista);

  // El primer estudiante queda seleccionado automáticamente
  if (!estudianteId) seleccionarEstudiante(lista[lista.length - 1].id);

  sonido.exito();
  notificar(`Estudiante ${nombre} guardado.`, 'exito');
  return true;
}

export async function eliminarEstudiante(id: string): Promise<void> {
  const estudiante = appStore.getState().estudiantes.find((e) => e.id === id);
  if (!estudiante) return;

  const ok = await confirmar({
    titulo: `Eliminar a ${estudiante.nombre}`,
    mensaje: 'Se borrarán su bitácora, agenda, fotos personalizadas e historial de accesos de este dispositivo. Esta acción no se puede deshacer.',
    textoConfirmar: 'Eliminar',
    peligro: true,
  });
  const { usuario } = appStore.getState();
  if (!ok || !usuario) return;

  const s = appStore.getState();
  const estudiantes = s.estudiantes.filter((e) => e.id !== id);
  const accesos = s.accesos.filter((a) => a.estudianteId !== id);
  repositorio.borrarDatosEstudiante(usuario.id, id);
  repositorio.estudiantes.guardar(usuario.id, estudiantes);
  repositorio.accesos.guardar(usuario.id, accesos);

  const eraActual = s.estudianteId === id;
  appStore.setState({
    estudiantes,
    accesos,
    accesoActivoId: accesoActivo(s)?.estudianteId === id ? null : s.accesoActivoId,
    estudianteId: eraActual ? null : s.estudianteId,
  });
  if (eraActual) cargarDatosEstudiante();
  guardarSesion();
  notificar(`${estudiante.nombre} fue eliminado/a.`, 'info');
}

/* ---------- Historial de accesos ---------- */

type EstadoAppAccesos = Pick<EstadoApp, 'filtroAccesos' | 'estudiantes' | 'accesos'>;

export function cambiarFiltroAccesos(filtro: string): void {
  appStore.setState({ filtroAccesos: filtro });
}

// El filtro vuelve a "todos" si el estudiante elegido ya no existe
export function filtroAccesosVigente({ filtroAccesos, estudiantes }: EstadoAppAccesos): string {
  return estudiantes.some((e) => e.id === filtroAccesos) ? filtroAccesos : 'todos';
}

export function filtrarAccesos(estado: EstadoAppAccesos): Acceso[] {
  const filtro = filtroAccesosVigente(estado);
  return filtro === 'todos' ? estado.accesos : estado.accesos.filter((a) => a.estudianteId === filtro);
}

const ENCABEZADOS_ACCESOS = ['Estudiante', 'Curso', 'Fecha', 'Inicio', 'Término', 'Duración (min)', 'Frases SAAC', 'Eventos emocionales', 'Rutinas completadas'];

export function exportarAccesosCSV(): void {
  const estado = appStore.getState();
  const accesos = filtrarAccesos(estado);
  if (accesos.length === 0) {
    notificar('No hay accesos para exportar.', 'advertencia');
    return;
  }

  const filas = accesos.map((a) => {
    const est = estado.estudiantes.find((e) => e.id === a.estudianteId);
    const i: Partial<Acceso['interacciones']> = a.interacciones || {};
    return [
      est?.nombre, est?.curso,
      formatearFecha(a.inicio),
      formatearHora(a.inicio),
      a.fin ? formatearHora(a.fin) : 'En curso',
      Math.round(duracionAccesoMs(a) / 60000),
      i.frase || 0, i.termometro || 0, i.agenda || 0,
    ];
  });
  descargarCSV(`TEA_yudo_Accesos_${fechaParaArchivo()}.csv`, construirCSV(ENCABEZADOS_ACCESOS, filas));
}
