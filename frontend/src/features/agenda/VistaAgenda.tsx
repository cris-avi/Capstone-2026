import { useMemo, useState } from 'react';
import { cx } from '../../lib/cx';
import { sonido } from '../../services/sonido';
import { useApp } from '../../store/app';
import { reiniciarRutinaDia } from './acciones';
import { ModalNuevaActividad } from './ModalNuevaActividad';
import { progresoAgenda } from './progreso';
import { TarjetaTarea } from './TarjetaTarea';

// Vista 2: agenda visual (rutina escolar con logros)
export function VistaAgenda() {
  const visible = useApp((s) => s.vista === 'agenda');
  const desbloqueado = useApp((s) => s.desbloqueado);
  const agenda = useApp((s) => s.agenda);
  const [modalAbierto, setModalAbierto] = useState(false);

  const { total, terminadas, porcentaje, mensaje } = useMemo(() => progresoAgenda(agenda), [agenda]);

  return (
    <section id="vista-agenda" className={cx('space-y-5', !visible && 'hidden')} aria-label="Agenda de rutina escolar">
      <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-200">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2">
              <span>📅</span>
              <span>Mi Rutina Escolar Diaria</span>
            </h2>
            <p className="text-sm text-slate-600 mt-0.5">Anticipación visual estructurada para reducir la ansiedad y celebrar logros.</p>
          </div>

          {desbloqueado && (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => { sonido.clic(); setModalAbierto(true); }}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm px-4 py-2.5 rounded-xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <span>➕</span>
                <span>Agregar Tarea</span>
              </button>
              <button
                type="button"
                onClick={reiniciarRutinaDia}
                className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-slate-300 transition-all flex items-center gap-1.5 cursor-pointer"
                title="Comenzar un nuevo día escolar desmarcando las tareas"
              >
                <span>🔄</span>
                <span>Nuevo Día</span>
              </button>
            </div>
          )}
        </div>

        {/* Barra de progreso visual de la rutina */}
        <div className="mt-4 pt-4 border-t border-slate-100">
          <div className="flex items-center justify-between text-xs font-extrabold mb-1.5">
            <span id="texto-progreso-agenda" className="text-emerald-800">
              {`Progreso: ${terminadas} de ${total} tareas completadas (${porcentaje}%)`}
            </span>
            <span id="mensaje-motivacional-agenda" className="text-slate-500 font-semibold">{mensaje}</span>
          </div>
          <div
            className="w-full h-4 bg-slate-100 rounded-full overflow-hidden border border-slate-200 p-0.5"
            role="progressbar"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={porcentaje}
            aria-labelledby="texto-progreso-agenda"
          >
            <div id="barra-progreso-agenda" className="h-full bg-linear-to-r from-emerald-400 to-green-500 rounded-full transition-all duration-500" style={{ width: `${porcentaje}%` }}></div>
          </div>
        </div>
      </div>

      <div id="lista-rutina-agenda" className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
        {agenda.map((tarea) => <TarjetaTarea key={tarea.id} tarea={tarea} />)}
      </div>

      {modalAbierto && <ModalNuevaActividad onCerrar={() => setModalAbierto(false)} />}
    </section>
  );
}
