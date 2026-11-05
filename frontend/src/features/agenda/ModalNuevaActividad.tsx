import type { FormEvent } from 'react';
import { ICONOS_ACTIVIDAD } from '../../config/agenda';
import { EncabezadoModal, Modal } from '../../components/Modal';
import { agregarTarea } from './acciones';

// Agregar una actividad a la rutina del estudiante
export function ModalNuevaActividad({ onCerrar }: { onCerrar: () => void }) {
  function enviar(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault();
    const datos = new FormData(evento.currentTarget);
    const titulo = String(datos.get('titulo') ?? '').trim();
    if (!titulo) return;
    agregarTarea({ titulo, icono: String(datos.get('icono')), hora: String(datos.get('hora') ?? '') });
    onCerrar();
  }

  return (
    <Modal id="modal-nueva-actividad" tituloId="modal-actividad-titulo" onCerrar={onCerrar}>
      <EncabezadoModal id="modal-actividad-titulo" icono="➕" titulo="Nueva Tarea en la Rutina" onCerrar={onCerrar} />

      <form id="form-nueva-actividad" onSubmit={enviar} className="space-y-3.5">
        <div>
          <label htmlFor="input-nombre-actividad" className="block text-xs font-bold text-slate-700 mb-1">Nombre de la actividad escolar:</label>
          <input
            type="text"
            id="input-nombre-actividad"
            name="titulo"
            placeholder="Ej: Taller de Arte, Música, Educación Física..."
            required
            autoFocus
            className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:bg-white focus:border-blue-500"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label htmlFor="select-icono-actividad" className="block text-xs font-bold text-slate-700 mb-1">Ícono visual:</label>
            <select id="select-icono-actividad" name="icono" className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-medium">
              {ICONOS_ACTIVIDAD.map(({ icono, etiqueta }) => <option key={icono} value={icono}>{`${icono} ${etiqueta}`}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor="input-hora-actividad" className="block text-xs font-bold text-slate-700 mb-1">Horario (opcional):</label>
            <input type="text" id="input-hora-actividad" name="hora" placeholder="Ej: 11:30" className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm" />
          </div>
        </div>

        <div className="pt-2 flex justify-end gap-2">
          <button type="button" onClick={onCerrar} className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-bold text-sm cursor-pointer">
            Cancelar
          </button>
          <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm px-5 py-2 rounded-xl shadow-xs cursor-pointer">
            Guardar Tarea
          </button>
        </div>
      </form>
    </Modal>
  );
}
