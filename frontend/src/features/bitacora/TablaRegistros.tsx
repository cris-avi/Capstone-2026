import { useMemo } from 'react';
import type { Registro } from '../../types';
import { FILTROS_TABLA } from '../../config/bitacora';
import { cx } from '../../lib/cx';
import { hablar } from '../../services/sonido';
import { useApp } from '../../store/app';
import { eliminarRegistro, filtrarTabla } from './acciones';
import { nivelEmocional } from './metricas';

const CLASE_INSIGNIA = 'inline-flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded-md border';
const COLOR_EMOCION = {
  rojo: 'bg-rose-100 text-rose-800 border-rose-300',
  amarillo: 'bg-amber-100 text-amber-800 border-amber-300',
  verde: 'bg-green-100 text-green-800 border-green-300',
};

function InsigniaTipo({ registro }: { registro: Registro }) {
  switch (registro.tipo) {
    case 'frase':
      return <span className={cx(CLASE_INSIGNIA, 'bg-emerald-100 text-emerald-800 border-emerald-300')}>🗣️ Habla SAAC</span>;
    case 'termometro':
      return <span className={cx(CLASE_INSIGNIA, COLOR_EMOCION[nivelEmocional(registro.frase)])}>🌡️ Emocional</span>;
    case 'agenda':
      return <span className={cx(CLASE_INSIGNIA, 'bg-blue-100 text-blue-800 border-blue-300')}>📅 Rutina</span>;
    default:
      return <span className={cx(CLASE_INSIGNIA, 'bg-purple-100 text-purple-800 border-purple-300')}>📝 Nota Docente</span>;
  }
}

const NIVELES_APOYO = [
  { coincide: ['Autónomo', 'Sin apoyo'], etiqueta: 'Autónomo', clases: 'bg-emerald-100 text-emerald-900 border-emerald-300', punto: 'bg-emerald-600' },
  { coincide: ['verbal', 'Gestual'], etiqueta: 'Apoyo verbal', clases: 'bg-amber-100 text-amber-900 border-amber-300', punto: 'bg-amber-500' },
  { coincide: ['físico', 'Asistido'], etiqueta: 'Modelado físico', clases: 'bg-orange-100 text-orange-950 border-orange-300', punto: 'bg-orange-500' },
];

const CLASE_PILDORA = 'inline-flex items-center gap-1.5 border text-xs font-bold px-2.5 py-1 rounded-full whitespace-nowrap';
const SIN_DATO = <span className="text-slate-400 text-xs italic">-</span>;

function InsigniaNivelApoyo({ nivel }: { nivel: string }) {
  if (!nivel) return SIN_DATO;
  const conocido = NIVELES_APOYO.find((n) => n.coincide.some((c) => nivel.includes(c)));
  if (!conocido) return <span className={cx(CLASE_PILDORA, 'bg-slate-100 text-slate-800 border-slate-300')}>{nivel}</span>;
  return (
    <span className={cx(CLASE_PILDORA, conocido.clases)}>
      <span className={cx('w-2 h-2 rounded-full inline-block', conocido.punto)} aria-hidden="true"></span>
      {` ${conocido.etiqueta}`}
    </span>
  );
}

function InsigniaMetaPaci({ meta }: { meta: string }) {
  if (!meta) return SIN_DATO;
  return (
    <span className="inline-flex items-center gap-1 bg-indigo-50 text-indigo-950 border border-indigo-200 text-xs font-bold px-2.5 py-1 rounded-lg max-w-[220px] truncate" title={meta}>
      <span className="text-indigo-600" aria-hidden="true">🎯</span> {meta}
    </span>
  );
}

// Historial de interacciones, rutinas y emociones del estudiante
export function TablaRegistros() {
  const registros = useApp((s) => s.registros);
  const filtro = useApp((s) => s.filtroTipoTabla);
  const visibles = useMemo(() => (filtro === 'todas' ? registros : registros.filter((r) => r.tipo === filtro)), [registros, filtro]);

  return (
    <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-200 overflow-hidden">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <span>📜</span>
          <span>Historial de Interacciones, Rutinas y Emociones</span>
        </h3>

        <div className="flex flex-wrap items-center gap-1.5 text-xs font-semibold no-print">
          <span className="text-slate-500">Filtrar:</span>
          {FILTROS_TABLA.map((f) => (
            <button
              key={f.id}
              type="button"
              id={`filtro-tab-${f.id}`}
              onClick={() => filtrarTabla(f.id)}
              aria-pressed={filtro === f.id}
              className={cx('px-2.5 py-1 rounded-lg cursor-pointer', filtro === f.id ? 'bg-slate-800 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200')}
            >
              {f.etiqueta}
            </button>
          ))}
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm border-collapse" id="tabla-registros-pie">
          <thead>
            <tr className="bg-slate-100/80 border-b border-slate-200 text-xs font-extrabold text-slate-600 uppercase tracking-wider">
              <th scope="col" className="py-3 px-3">Fecha y Hora</th>
              <th scope="col" className="py-3 px-3">Tipo</th>
              <th scope="col" className="py-3 px-3">Detalle / Frase / Nivel</th>
              <th scope="col" className="py-3 px-3">Nivel de Apoyo</th>
              <th scope="col" className="py-3 px-3">Meta PACI</th>
              <th scope="col" className="py-3 px-3 text-center">Palabras</th>
              <th scope="col" className="py-3 px-3">Contexto</th>
              <th scope="col" className="py-3 px-3 text-right no-print">Acción</th>
            </tr>
          </thead>
          <tbody id="cuerpo-tabla-pie" className="divide-y divide-slate-100 font-normal">
            {visibles.map((reg) => (
              <tr key={reg.id} className="hover:bg-slate-50/80 transition-colors border-b border-slate-100">
                <td className="py-3 px-3 text-xs font-mono text-slate-500 whitespace-nowrap">
                  <span className="font-bold text-slate-700">{reg.horaTexto}</span>
                  <span className="text-[10px] block text-slate-400">{reg.fechaTexto}</span>
                </td>
                <td className="py-3 px-3 whitespace-nowrap"><InsigniaTipo registro={reg} /></td>
                <td className="py-3 px-3">
                  <div className={cx('text-sm', reg.tipo === 'frase' ? 'font-bold text-slate-900' : 'font-medium text-slate-700')}>{reg.frase}</div>
                  {reg.observacion && <div className="text-xs text-slate-500 mt-0.5">{reg.observacion}</div>}
                </td>
                <td className="py-3 px-3 whitespace-nowrap"><InsigniaNivelApoyo nivel={reg.nivelApoyo} /></td>
                <td className="py-3 px-3"><InsigniaMetaPaci meta={reg.metaPaci} /></td>
                <td className="py-3 px-3 text-center text-xs font-bold text-slate-600">{reg.palabrasCount > 0 ? reg.palabrasCount : '-'}</td>
                <td className="py-3 px-3 whitespace-nowrap">
                  <span className="bg-slate-100 text-slate-700 text-xs font-medium px-2 py-0.5 rounded-md border border-slate-200">{reg.contexto}</span>
                </td>
                <td className="py-3 px-3 text-right whitespace-nowrap no-print">
                  <div className="flex items-center justify-end gap-1">
                    {reg.tipo === 'frase' && (
                      <button
                        type="button"
                        onClick={() => hablar(reg.frase)}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-emerald-700 hover:bg-emerald-50 transition-colors cursor-pointer"
                        title="Escuchar de nuevo"
                      >
                        🔊
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => eliminarRegistro(reg.id)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                      title="Eliminar registro"
                    >
                      🗑️
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {visibles.length === 0 && (
          <div id="tabla-vacia" className="text-center py-10 text-slate-400">
            <span className="text-3xl block mb-2">📝</span>
            <p className="font-bold text-slate-600">Aún no hay registros en la bitácora</p>
            <p className="text-xs text-slate-400 mt-1">Los registros se crearán automáticamente con el habla SAAC, termómetro emocional o notas docentes.</p>
          </div>
        )}
      </div>
    </div>
  );
}
