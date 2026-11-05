import { useEffect, useRef } from 'react';
import { cx } from '../lib/cx';
import { responderConfirmacion, useUI } from '../store/ui';
import { Modal } from './Modal';

// Modal de confirmación propio: window.confirm puede estar bloqueado dentro del iframe de AI Studio
export function DialogoConfirmacion() {
  const solicitud = useUI((s) => s.confirmacion);
  const cancelarRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (solicitud) cancelarRef.current?.focus();
  }, [solicitud]);

  if (!solicitud) return null;

  return (
    <Modal
      id="modal-confirmar"
      rol="alertdialog"
      tituloId="confirmar-titulo"
      descripcionId="confirmar-mensaje"
      capa="z-[70]"
      className="max-w-sm space-y-4"
      onCerrar={() => responderConfirmacion(false)}
    >
      <h3 id="confirmar-titulo" className="text-lg font-black text-slate-900">{solicitud.titulo}</h3>
      <p id="confirmar-mensaje" className="text-sm text-slate-600">{solicitud.mensaje}</p>
      <div className="flex justify-end gap-2 pt-1">
        <button
          ref={cancelarRef}
          type="button"
          id="confirmar-cancelar"
          onClick={() => responderConfirmacion(false)}
          className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-bold text-sm cursor-pointer"
        >
          Cancelar
        </button>
        <button
          type="button"
          id="confirmar-aceptar"
          onClick={() => responderConfirmacion(true)}
          className={cx(
            solicitud.peligro ? 'bg-rose-600 hover:bg-rose-700' : 'bg-blue-600 hover:bg-blue-700',
            'text-white font-bold text-sm px-5 py-2 rounded-xl shadow-xs cursor-pointer',
          )}
        >
          {solicitud.textoConfirmar}
        </button>
      </div>
    </Modal>
  );
}
