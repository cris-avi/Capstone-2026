import { useEffect, type ReactNode } from 'react';
import { cx } from '../lib/cx';

interface ModalProps {
  id: string;
  tituloId: string;
  descripcionId?: string;
  onCerrar?: () => void;
  rol?: 'dialog' | 'alertdialog';
  className?: string;
  fondo?: string;
  capa?: string;
  children: ReactNode;
}

// Diálogo accesible con fondo difuminado; Escape lo cierra si recibe onCerrar
export function Modal({
  id, tituloId, descripcionId, onCerrar, rol = 'dialog',
  className = 'max-w-md space-y-4', fondo = 'bg-slate-900/60', capa = 'z-50', children,
}: ModalProps) {
  useEffect(() => {
    if (!onCerrar) return;
    const alPresionar = (e: KeyboardEvent) => { if (e.key === 'Escape') onCerrar(); };
    window.addEventListener('keydown', alPresionar);
    return () => window.removeEventListener('keydown', alPresionar);
  }, [onCerrar]);

  return (
    <div
      id={id}
      className={cx('fixed inset-0 backdrop-blur-xs flex items-center justify-center p-4 no-print', fondo, capa)}
      role={rol}
      aria-modal="true"
      aria-labelledby={tituloId}
      aria-describedby={descripcionId}
    >
      <div className={cx('bg-white rounded-3xl w-full p-6 shadow-2xl border border-slate-200', className)}>
        {children}
      </div>
    </div>
  );
}

interface EncabezadoModalProps {
  id: string;
  icono: string;
  titulo: string;
  tituloTextoId?: string;
  onCerrar: () => void;
}

export function EncabezadoModal({ id, icono, titulo, tituloTextoId, onCerrar }: EncabezadoModalProps) {
  return (
    <div className="flex items-center justify-between border-b border-slate-200 pb-3">
      <h3 id={id} className="text-lg font-black text-slate-900 flex items-center gap-2">
        <span>{icono}</span>
        <span id={tituloTextoId}>{titulo}</span>
      </h3>
      <button type="button" onClick={onCerrar} className="text-slate-400 hover:text-slate-700 text-xl font-bold cursor-pointer" aria-label="Cerrar">
        ✕
      </button>
    </div>
  );
}
