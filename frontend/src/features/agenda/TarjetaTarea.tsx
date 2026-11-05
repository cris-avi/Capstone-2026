import type { Tarea } from '../../types';
import { cx } from '../../lib/cx';
import { alternarTarea, escucharTarea } from './acciones';

export function TarjetaTarea({ tarea }: { tarea: Tarea }) {
  const { titulo, desc, icono, hora, terminada } = tarea;

  return (
    <div
      className={cx(
        'rounded-3xl p-4 sm:p-5 border-3 transition-all shadow-sm flex flex-col justify-between',
        terminada ? 'bg-emerald-50/80 border-emerald-400 opacity-90' : 'bg-white border-slate-300 hover:border-blue-400 hover:shadow-md',
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="text-3xl sm:text-4xl p-2.5 rounded-2xl bg-slate-100 border border-slate-200 select-none">{icono}</span>
          <div>
            <div className="flex items-center gap-2">
              <h4 className={cx('font-black text-lg sm:text-xl', terminada ? 'line-through text-emerald-900' : 'text-slate-900')}>{titulo}</h4>
              {hora && <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md font-semibold">{hora}</span>}
            </div>
            <p className={cx('text-xs sm:text-sm mt-0.5', terminada ? 'line-through text-emerald-700' : 'text-slate-500')}>{desc}</p>
          </div>
        </div>

        {/* Escuchar el nombre de la tarea */}
        <button
          type="button"
          onClick={() => escucharTarea(tarea)}
          className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-colors cursor-pointer"
          title="Escuchar descripción de la tarea"
          aria-label={`Escuchar ${titulo}`}
        >
          🔊
        </button>
      </div>

      <div className={cx('mt-4 pt-3 border-t flex items-center justify-between', terminada ? 'border-emerald-200' : 'border-slate-100')}>
        <span className={cx('text-xs font-bold', terminada ? 'text-emerald-700' : 'text-slate-400')}>
          {terminada ? '¡Tarea Terminada! 🌟' : 'Pendiente por realizar'}
        </span>
        <button
          type="button"
          onClick={() => alternarTarea(tarea.id)}
          className={cx(
            'px-4 py-2 rounded-xl font-black text-xs sm:text-sm transition-all shadow-xs flex items-center gap-1.5 cursor-pointer active:scale-95',
            terminada ? 'bg-white hover:bg-rose-50 text-rose-700 border border-rose-200' : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-200',
          )}
        >
          <span>{terminada ? '↩️ Desmarcar' : '✅ Marcar como Terminada'}</span>
        </button>
      </div>
    </div>
  );
}
