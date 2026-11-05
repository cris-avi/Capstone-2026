import type { Vista } from '../../types';
import { sonido } from '../../services/sonido';
import { appStore } from '../../store/app';
import { notificar } from '../../store/ui';
import { establecerDesbloqueo } from './sesion';

/**
 * Enrutador entre secciones y control de acceso al área profesional.
 */

const VISTAS_ESTUDIANTE: Vista[] = ['nino', 'agenda', 'calma', 'pie'];

export function abrirModalPin(destino: Vista = 'panel'): void {
  if (!appStore.getState().usuario) return;
  appStore.setState({ modalPin: { destino } });
}

export function cerrarModalPin(): void {
  appStore.setState({ modalPin: null });
}

export function navegarA(vista: Vista, { silencioso = false } = {}): void {
  if (!silencioso) sonido.clic();
  const { desbloqueado, estudianteId, accesoActivoId } = appStore.getState();

  // La bitácora exige el área profesional desbloqueada
  if (vista === 'pie' && !desbloqueado) {
    abrirModalPin('pie');
    return;
  }

  // Las vistas del estudiante necesitan un estudiante cargado y una sesión activa o el modo profesional
  const esVistaEstudiante = VISTAS_ESTUDIANTE.includes(vista);
  if (esVistaEstudiante && (!estudianteId || (!accesoActivoId && !desbloqueado))) vista = 'panel';

  appStore.setState({ vista });
}

// Si el profesional ya está desbloqueado entra directo; si no, se pide su PIN
export function intentarAccesoProfesional(destino: Vista): void {
  if (appStore.getState().desbloqueado) {
    navegarA(destino);
    return;
  }
  sonido.clic();
  abrirModalPin(destino);
}

export function volverASesionEstudiante(): void {
  if (!appStore.getState().accesoActivoId) return;
  establecerDesbloqueo(false);
  navegarA('nino');
}

// Devuelve el dispositivo al estudiante dejando el área profesional bajo PIN
export function bloquearAreaProfesional(): void {
  if (!appStore.getState().accesoActivoId) return;
  volverASesionEstudiante();
  notificar('Área profesional bloqueada. Se requerirá tu PIN para volver a ingresar.', 'info');
}
