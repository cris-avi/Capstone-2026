import * as audio from '../lib/audio';
import { appStore } from '../store/app';

/**
 * Sonidos táctiles (respetan el botón de sonido) y voz del comunicador.
 */

const activo = () => appStore.getState().sonidoActivo;

export const sonido = {
  clic: () => { if (activo()) audio.tonoClic(); },
  exito: () => { if (activo()) audio.tonoExito(); },
  error: () => { if (activo()) audio.tonoError(); },
};

// La voz siempre suena: es la forma en que el estudiante se comunica
export function hablar(texto: string): void {
  audio.hablar(texto, {
    alIniciar: () => appStore.setState({ hablando: true }),
    alTerminar: () => appStore.setState({ hablando: false }),
  });
}

export function alternarSonido(): void {
  const sonidoActivo = !activo();
  appStore.setState({ sonidoActivo });
  if (sonidoActivo) audio.tonoClic();
}
