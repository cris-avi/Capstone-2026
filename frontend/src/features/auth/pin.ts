import { PIN_BLOQUEO_MS, PIN_MAX_INTENTOS } from '../../config/constantes';
import { verificarSecreto } from '../../lib/cripto';
import { sonido } from '../../services/sonido';
import { appStore } from '../../store/app';
import { cerrarModalPin, navegarA } from '../sesion/navegacion';
import { establecerDesbloqueo } from '../sesion/sesion';

/**
 * Control de acceso con el PIN personal del profesional.
 * Tras varios intentos fallidos se pausa el teclado para evitar que se adivine el PIN.
 */

let pinFallos = 0;
let pinBloqueadoHasta = 0;

export type ResultadoPin = 'ok' | 'incorrecto' | 'bloqueado';

export function segundosBloqueoPin(): number {
  const restante = pinBloqueadoHasta - Date.now();
  return restante > 0 ? Math.ceil(restante / 1000) : 0;
}

function desbloquearAreaProfesional(): void {
  pinFallos = 0;
  pinBloqueadoHasta = 0;
  const destino = appStore.getState().modalPin?.destino ?? 'panel';
  cerrarModalPin();
  establecerDesbloqueo(true);
  navegarA(destino);
}

export async function verificarPin(pin: string): Promise<ResultadoPin> {
  const { usuario } = appStore.getState();
  if (!usuario) return 'incorrecto';

  if (await verificarSecreto(pin, usuario.pinSal, usuario.pinHash, usuario.iteraciones)) {
    desbloquearAreaProfesional();
    return 'ok';
  }

  sonido.error();
  pinFallos++;
  if (pinFallos >= PIN_MAX_INTENTOS) {
    pinFallos = 0;
    pinBloqueadoHasta = Date.now() + PIN_BLOQUEO_MS;
    return 'bloqueado';
  }
  return 'incorrecto';
}

// Alternativa al PIN: la contraseña de la cuenta también desbloquea (y levanta el bloqueo temporal)
export async function verificarContrasena(contrasena: string): Promise<boolean> {
  const { usuario } = appStore.getState();
  if (!usuario) return false;
  const correcta = await verificarSecreto(contrasena, usuario.passSal, usuario.passHash, usuario.iteraciones);
  if (correcta) desbloquearAreaProfesional();
  return correcta;
}
