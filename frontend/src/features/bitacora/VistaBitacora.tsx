import type { RangoMetricas } from '../../types';
import { RANGOS_METRICAS } from '../../config/bitacora';
import { cx } from '../../lib/cx';
import { estudianteActual, useApp } from '../../store/app';
import { bloquearAreaProfesional } from '../sesion/navegacion';
import { cambiarRangoMetricas, exportarBitacoraCSV, vaciarBitacora } from './acciones';
import { FormularioNota } from './FormularioNota';
import { TablaRegistros } from './TablaRegistros';
import { TarjetasMetricas } from './TarjetasMetricas';

const CLASE_ACCION = 'font-bold text-xs sm:text-sm px-3.5 py-2 rounded-xl border flex items-center gap-1.5 transition-all cursor-pointer';

// Vista 4: bitácora automática profesional PIE (protegida con PIN)
export function VistaBitacora() {
  const visible = useApp((s) => s.vista === 'pie');
  const estudiante = useApp(estudianteActual);
  const enSesion = useApp((s) => !!s.accesoActivoId);
  const rango = useApp((s) => s.rangoMetricas);

  return (
    <section id="vista-pie" className={cx('space-y-5', !visible && 'hidden')} aria-label="Bitácora de seguimiento PIE">

      {/* Panel de control y métricas de uso escolar */}
      <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-200">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="flex flex-wrap items-center gap-2.5">
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2">
                <span>📋</span>
                <span>Bitácora Profesional PIE</span>
              </h2>

              <div className="inline-flex items-center gap-1.5 bg-slate-100 py-1 px-2.5 rounded-xl border border-slate-300">
                <label htmlFor="select-rango-metricas" className="text-xs font-bold text-slate-600 flex items-center gap-1">
                  <span>⏱️</span>
                  <span className="hidden sm:inline">Rango:</span>
                </label>
                <select
                  id="select-rango-metricas"
                  value={rango}
                  onChange={(e) => cambiarRangoMetricas(e.target.value as RangoMetricas)}
                  className="bg-white text-slate-900 font-bold text-xs py-1 px-2 rounded-lg border border-slate-200 shadow-2xs focus:border-blue-500 cursor-pointer"
                  aria-label="Seleccionar rango temporal para estadísticas de bitácora"
                >
                  {RANGOS_METRICAS.map((r) => <option key={r.id} value={r.id}>{r.etiqueta}</option>)}
                </select>
              </div>

              <span id="pie-badge-estudiante" className="bg-emerald-100 text-emerald-800 text-xs font-bold px-2 py-0.5 rounded-full border border-emerald-300">
                {estudiante ? `${estudiante.avatar} ${estudiante.nombre}` : 'Sin estudiante'}
              </span>
            </div>
            <p className="text-sm text-slate-600 mt-0.5">
              Registro cronológico de comunicaciones SAAC, eventos emocionales SOS y observaciones docentes.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 no-print">
            <button type="button" onClick={exportarBitacoraCSV} className={cx(CLASE_ACCION, 'bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border-emerald-300')} title="Descargar informe en CSV compatible con Excel">
              <span>📥</span>
              <span>Exportar CSV</span>
            </button>
            <button type="button" onClick={() => window.print()} className={cx(CLASE_ACCION, 'bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-300')} title="Imprimir informe para la carpeta de seguimiento del estudiante">
              <span>🖨️</span>
              <span>Imprimir</span>
            </button>
            {enSesion && (
              <button type="button" id="btn-bloquear-pie" onClick={bloquearAreaProfesional} className={cx(CLASE_ACCION, 'bg-amber-50 hover:bg-amber-100 text-amber-800 border-amber-300')} title="Bloquear el área profesional y devolver el dispositivo al estudiante">
                <span>🔒</span>
                <span>Bloquear y Volver a la Sesión</span>
              </button>
            )}
            <button type="button" onClick={vaciarBitacora} className={cx(CLASE_ACCION, 'bg-rose-50 hover:bg-rose-100 text-rose-700 border-rose-200')} title="Borrar todo el historial guardado">
              <span>🗑️</span>
              <span>Vaciar</span>
            </button>
          </div>
        </div>

        <TarjetasMetricas />
      </div>

      <FormularioNota />
      <TablaRegistros />
    </section>
  );
}
