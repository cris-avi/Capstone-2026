import { useEffect } from 'react';
import { RELOJ_INTERVALO_MS } from '../config/constantes';
import { appStore } from '../store/app';
import { registrarLatido } from '../features/sesion/accesos';

// Registra la actividad para medir la duración real de cada acceso y refresca las duraciones visibles
export function useRegistroActividad(): void {
  useEffect(() => {
    const latido = () => registrarLatido();
    const alCambiarVisibilidad = () => {
      if (document.visibilityState === 'hidden') registrarLatido(true);
    };
    const reloj = setInterval(() => {
      if (appStore.getState().usuario) appStore.setState({ ahora: Date.now() });
    }, RELOJ_INTERVALO_MS);

    document.addEventListener('pointerdown', latido, { passive: true });
    document.addEventListener('keydown', latido);
    document.addEventListener('visibilitychange', alCambiarVisibilidad);
    return () => {
      clearInterval(reloj);
      document.removeEventListener('pointerdown', latido);
      document.removeEventListener('keydown', latido);
      document.removeEventListener('visibilitychange', alCambiarVisibilidad);
    };
  }, []);
}
