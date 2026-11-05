import type { Estudiante } from '../../types';
import { cx } from '../../lib/cx';
import { formatearDuracion, formatearTiempoRelativo } from '../../lib/formato';
import type { estadisticasEstudiante } from '../sesion/accesos';
import { eliminarEstudiante, iniciarSesionEstudiante, verBitacoraEstudiante } from './acciones';

interface TarjetaEstudianteProps {
  estudiante: Estudiante;
  estadisticas: ReturnType<typeof estadisticasEstudiante>;
  enSesion: boolean;
  seleccionado: boolean;
  onEditar: () => void;
  onVerAccesos: () => void;
}

const CLASE_BOTON_SECUNDARIO = 'bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs px-3 rounded-xl border border-slate-300 cursor-pointer';

export function TarjetaEstudiante({ estudiante, estadisticas, enSesion, seleccionado, onEditar, onVerAccesos }: TarjetaEstudianteProps) {
  const { id, nombre, curso, avatar } = estudiante;

  return (
    <article
      className={cx(
        'rounded-3xl p-4 border-2 shadow-2xs flex flex-col gap-3',
        enSesion ? 'border-emerald-400 bg-emerald-50/50' : seleccionado ? 'border-blue-300 bg-blue-50/30' : 'border-slate-200 bg-white',
      )}
    >
      <div className="flex items-start gap-3">
        <div className="w-14 h-14 rounded-2xl bg-amber-100 border-2 border-amber-300 text-3xl flex items-center justify-center select-none shrink-0" aria-hidden="true">
          {avatar}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h4 className="font-black text-lg text-slate-900 truncate">{nombre}</h4>
            {enSesion && <span className="bg-emerald-600 text-white text-[11px] font-bold px-2 py-0.5 rounded-full">En sesión</span>}
          </div>
          <p className="text-xs text-slate-500 font-semibold truncate">{curso || 'Sin curso asignado'}</p>
        </div>
        <div className="flex gap-1 shrink-0">
          <button type="button" onClick={onEditar} className="p-1.5 rounded-lg text-slate-400 hover:text-blue-700 hover:bg-blue-50 cursor-pointer" title="Editar" aria-label={`Editar a ${nombre}`}>✏️</button>
          <button type="button" onClick={() => eliminarEstudiante(id)} className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 cursor-pointer" title="Eliminar" aria-label={`Eliminar a ${nombre}`}>🗑️</button>
        </div>
      </div>

      <dl className="grid grid-cols-3 gap-2 text-center">
        <div className="bg-white rounded-xl p-2 border border-slate-200">
          <dt className="text-[11px] font-bold text-slate-500">Accesos</dt>
          <dd className="font-black text-slate-900">{estadisticas.total}</dd>
        </div>
        <div className="bg-white rounded-xl p-2 border border-slate-200">
          <dt className="text-[11px] font-bold text-slate-500">Tiempo total</dt>
          <dd className="font-black text-slate-900 text-sm">{estadisticas.total ? formatearDuracion(estadisticas.tiempoTotalMs) : '-'}</dd>
        </div>
        <div className="bg-white rounded-xl p-2 border border-slate-200">
          <dt className="text-[11px] font-bold text-slate-500">Último acceso</dt>
          <dd className="font-black text-slate-900 text-sm">{formatearTiempoRelativo(estadisticas.ultimoInicio)}</dd>
        </div>
      </dl>

      <div className="flex gap-2">
        <button type="button" onClick={() => iniciarSesionEstudiante(id)} className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-sm py-2.5 rounded-xl shadow-xs cursor-pointer active:scale-[0.98]">
          {enSesion ? '▶️ Continuar sesión' : '▶️ Iniciar sesión'}
        </button>
        <button type="button" onClick={() => verBitacoraEstudiante(id)} className={CLASE_BOTON_SECUNDARIO} title={`Ver bitácora PIE de ${nombre}`}>📋 Bitácora</button>
        <button type="button" onClick={onVerAccesos} className={CLASE_BOTON_SECUNDARIO} title={`Ver accesos de ${nombre}`} aria-label={`Ver accesos de ${nombre}`}>🕒</button>
      </div>
    </article>
  );
}
