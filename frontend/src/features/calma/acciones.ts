import type { NivelTermometro } from '../../config/calma';
import { iniciarLluvia } from '../../lib/audio';
import { hablar, sonido } from '../../services/sonido';
import { appStore } from '../../store/app';
import { notificar } from '../../store/ui';
import { registrarEnBitacora } from '../bitacora/acciones';

/**
 * Zona calma / SOS: termómetro emocional, peticiones sensoriales y sonido relajante.
 */

// El registro emocional siempre queda en la bitácora con la hora exacta
export function registrarNivelTermometro(nivel: NivelTermometro): void {
  sonido.clic();
  hablar(nivel.fraseVoz);
  registrarEnBitacora({
    tipo: 'termometro',
    frase: nivel.fraseBitacora,
    palabrasCount: 0,
    contexto: nivel.contexto,
    observacion: `Registro táctil directo del estudiante. Nivel: ${nivel.id.toUpperCase()}`,
  });
}

export function pedirApoyoRapido(fraseVoz: string, titulo: string): void {
  hablar(fraseVoz);
  registrarEnBitacora({
    tipo: 'termometro',
    frase: `Petición sensorial de calma: ${titulo}`,
    palabrasCount: 0,
    contexto: 'Zona Calma',
    observacion: 'El estudiante solicitó apoyo de autorregulación.',
  });
}

let detenerLluvia: (() => void) | null = null;

export function alternarLluvia(): void {
  if (detenerLluvia) {
    detenerLluvia();
    detenerLluvia = null;
    appStore.setState({ lluviaActiva: false });
    return;
  }
  try {
    detenerLluvia = iniciarLluvia();
    appStore.setState({ lluviaActiva: true });
  } catch (e) {
    notificar('No se pudo activar el audio en este dispositivo.', 'error');
  }
}
