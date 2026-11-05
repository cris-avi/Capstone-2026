import { useEffect } from 'react';
import { appStore } from '../store/app';
import { borrarUltimoPictograma, hablarFrase } from '../features/comunicador/acciones';

const CAMPOS_DE_TEXTO = ['INPUT', 'TEXTAREA', 'SELECT'];

// Atajos de teclado accesibles del comunicador: Espacio habla y Retroceso borra el último pictograma
export function useAtajosTeclado(): void {
  useEffect(() => {
    const alPresionar = (e: KeyboardEvent) => {
      const activo = document.activeElement;
      if (activo && CAMPOS_DE_TEXTO.includes(activo.tagName)) return;

      const { estudianteId, pantallaAuthVisible, vista, fraseActual } = appStore.getState();
      if (!estudianteId || pantallaAuthVisible || vista !== 'nino') return;

      if (e.code === 'Space') {
        e.preventDefault();
        hablarFrase();
      } else if (e.code === 'Backspace' && fraseActual.length > 0) {
        e.preventDefault();
        borrarUltimoPictograma();
      }
    };
    window.addEventListener('keydown', alPresionar);
    return () => window.removeEventListener('keydown', alPresionar);
  }, []);
}
