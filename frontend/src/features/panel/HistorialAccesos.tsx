import { useMemo, type Ref } from 'react';
import { MAX_FILAS_HISTORIAL_ACCESOS } from '../../config/constantes';
import { formatearDuracion, formatearFecha, formatearHora } from '../../lib/formato';
import { useApp } from '../../store/app';
import { duracionAccesoMs, resumenInteracciones } from '../sesion/accesos';
import { cambiarFiltroAccesos, exportarAccesosCSV, filtrarAccesos, filtroAccesosVigente } from './acciones';

// Historial de accesos de los estudiantes del profesional
export function HistorialAccesos({ ref }: { ref?: Ref<HTMLDivElement> }) {
  const estudiantes = useApp((s) => s.estudiantes);
  const accesos = useApp((s) => s.accesos);
  const filtroAccesos = useApp((s) => s.filtroAccesos);
  useApp((s) => s.ahora);

  const filtro = filtroAccesosVigente({ filtroAccesos, estudiantes, accesos });
  const filas = useMemo(
    () => filtrarAccesos({ filtroAccesos, estudiantes, accesos }).slice(0, MAX_FILAS_HISTORIAL_ACCESOS),
    [filtroAccesos, estudiantes, accesos],
  );

  return (
    <div id="bloque-historial-accesos" ref={ref} className="bg-white rounded-3xl p-5 shadow-sm border border-slate-200 overflow-hidden">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <span>🕒</span>
          <span>Historial de Accesos</span>
        </h3>
        <div className="flex flex-wrap items-center gap-2 no-print">
          <label htmlFor="select-filtro-accesos" className="sr-only">Filtrar historial por estudiante</label>
          <select
            id="select-filtro-accesos"
            value={filtro}
            onChange={(e) => cambiarFiltroAccesos(e.target.value)}
            className="bg-white text-slate-900 font-bold text-xs py-2 px-2.5 rounded-xl border border-slate-300 cursor-pointer"
          >
            <option value="todos">Todos los estudiantes</option>
            {estudiantes.map((e) => <option key={e.id} value={e.id}>{`${e.avatar} ${e.nombre}`}</option>)}
          </select>
          <button type="button" onClick={exportarAccesosCSV} className="bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold text-xs px-3 py-2 rounded-xl border border-emerald-300 flex items-center gap-1.5 cursor-pointer">
            <span>📥</span>
            <span>Exportar CSV</span>
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm border-collapse">
          <thead>
            <tr className="bg-slate-100/80 border-b border-slate-200 text-xs font-extrabold text-slate-600 uppercase tracking-wider">
              <th scope="col" className="py-3 px-3">Estudiante</th>
              <th scope="col" className="py-3 px-3">Fecha</th>
              <th scope="col" className="py-3 px-3">Inicio – Término</th>
              <th scope="col" className="py-3 px-3">Duración</th>
              <th scope="col" className="py-3 px-3">Actividad registrada</th>
            </tr>
          </thead>
          <tbody id="cuerpo-tabla-accesos" className="divide-y divide-slate-100">
            {filas.map((a) => {
              const est = estudiantes.find((e) => e.id === a.estudianteId);
              const actividad = resumenInteracciones(a);
              return (
                <tr key={a.id} className="hover:bg-slate-50/80">
                  <td className="py-2.5 px-3 font-bold text-slate-900 whitespace-nowrap">{est ? `${est.avatar} ${est.nombre}` : '-'}</td>
                  <td className="py-2.5 px-3 text-xs text-slate-600 whitespace-nowrap">{formatearFecha(a.inicio)}</td>
                  <td className="py-2.5 px-3 text-xs font-mono text-slate-700 whitespace-nowrap">
                    {`${formatearHora(a.inicio)} – `}
                    {a.fin ? formatearHora(a.fin) : <span className="font-sans font-bold text-emerald-700">En curso</span>}
                  </td>
                  <td className="py-2.5 px-3 text-xs font-bold text-slate-800 whitespace-nowrap">{formatearDuracion(duracionAccesoMs(a))}</td>
                  <td className="py-2.5 px-3 text-xs text-slate-600 whitespace-nowrap">
                    {actividad || <span className="italic text-slate-400">Sin interacciones</span>}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {filas.length === 0 && (
          <div id="accesos-vacio" className="text-center py-8 text-slate-400">
            <span className="text-3xl block mb-2" aria-hidden="true">🕒</span>
            <p className="font-bold text-slate-600">Aún no hay accesos registrados</p>
            <p className="text-xs text-slate-400 mt-1">Cada vez que inicies la sesión de un estudiante quedará registrada aquí.</p>
          </div>
        )}
      </div>
    </div>
  );
}
