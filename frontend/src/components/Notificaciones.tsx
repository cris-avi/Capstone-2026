import { useEffect, useState } from 'react';
import type { TipoNotificacion } from '../types';
import { cx } from '../lib/cx';
import { cerrarNotificacion, useUI, type Notificacion } from '../store/ui';

const ESTILOS: Record<TipoNotificacion, { icono: string; clases: string }> = {
  info: { icono: 'ℹ️', clases: 'bg-blue-50 text-blue-900 border-blue-300' },
  exito: { icono: '✅', clases: 'bg-emerald-50 text-emerald-900 border-emerald-300' },
  advertencia: { icono: '⚠️', clases: 'bg-amber-50 text-amber-900 border-amber-300' },
  error: { icono: '❌', clases: 'bg-rose-50 text-rose-900 border-rose-300' },
};

// Contenedor de notificaciones toast accesibles (WCAG 2.2 AAA)
export function Notificaciones() {
  const notificaciones = useUI((s) => s.notificaciones);
  return (
    <div
      id="contenedor-notificaciones"
      className="fixed top-4 right-4 z-[80] flex flex-col gap-2 max-w-sm w-full pointer-events-none px-3"
      role="region"
      aria-live="polite"
      aria-label="Notificaciones del sistema"
    >
      {notificaciones.map((n) => <Toast key={n.id} notificacion={n} />)}
    </div>
  );
}

function Toast({ notificacion }: { notificacion: Notificacion }) {
  // Entra con una transición suave en el cuadro siguiente al montaje
  const [montada, setMontada] = useState(false);
  useEffect(() => {
    const cuadro = requestAnimationFrame(() => setMontada(true));
    return () => cancelAnimationFrame(cuadro);
  }, []);

  const { icono, clases } = ESTILOS[notificacion.tipo];
  return (
    <div
      className={cx(
        'pointer-events-auto flex items-center gap-3 p-3.5 rounded-2xl shadow-xl border text-sm font-bold transition-all duration-300',
        (!montada || notificacion.saliendo) && 'opacity-0 -translate-y-2',
        clases,
      )}
    >
      <span className="text-xl shrink-0" aria-hidden="true">{icono}</span>
      <span className="flex-1 leading-snug">{notificacion.mensaje}</span>
      <button
        type="button"
        onClick={() => cerrarNotificacion(notificacion.id)}
        aria-label="Cerrar notificación"
        className="text-slate-400 hover:text-slate-700 text-lg font-bold px-1 rounded-lg cursor-pointer"
      >
        &times;
      </button>
    </div>
  );
}
