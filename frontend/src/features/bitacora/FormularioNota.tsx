import { useRef, useState, type FormEvent, type KeyboardEvent } from 'react';
import { ATAJOS_NOTA, CONTEXTOS_ESCOLARES, NIVELES_MEDIACION, SUGERENCIAS_PACI } from '../../config/bitacora';
import { cx } from '../../lib/cx';
import { sonido } from '../../services/sonido';
import { useApp } from '../../store/app';
import { cambiarContextoNota, guardarNotaDocente } from './acciones';

const TECLAS_SIGUIENTE = ['ArrowRight', 'ArrowDown'];
const TECLAS_ANTERIOR = ['ArrowLeft', 'ArrowUp'];

// Formulario para la observación pedagógica inmediata de la educadora
export function FormularioNota() {
  const contexto = useApp((s) => s.contextoNota);
  const [texto, setTexto] = useState('');
  const [metaPaci, setMetaPaci] = useState('');
  const [nivel, setNivel] = useState('');
  const textoRef = useRef<HTMLInputElement>(null);
  const botonesNivel = useRef<(HTMLButtonElement | null)[]>([]);

  // Selección única; pulsar el nivel ya elegido lo deselecciona
  function seleccionarNivel(valor: string) {
    sonido.clic();
    setNivel((actual) => (actual === valor ? '' : valor));
  }

  // Radiogroup accesible: las flechas mueven la selección y el foco (WCAG 2.2)
  function navegarNiveles(evento: KeyboardEvent<HTMLDivElement>) {
    const siguiente = TECLAS_SIGUIENTE.includes(evento.key);
    if (!siguiente && !TECLAS_ANTERIOR.includes(evento.key)) return;
    evento.preventDefault();

    const total = NIVELES_MEDIACION.length;
    const actual = botonesNivel.current.findIndex((b) => b === document.activeElement);
    const destino = actual === -1 ? 0 : (actual + (siguiente ? 1 : -1) + total) % total;
    seleccionarNivel(NIVELES_MEDIACION[destino].valor);
    botonesNivel.current[destino]?.focus();
  }

  function insertarAtajo(atajo: (typeof ATAJOS_NOTA)[number]) {
    sonido.clic();
    setTexto(atajo.texto);
    textoRef.current?.focus();
    if (atajo.nivel) setNivel(atajo.nivel);
    if (atajo.meta) setMetaPaci(atajo.meta);
  }

  function enviar(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault();
    const observacion = texto.trim();
    if (!observacion) return;
    guardarNotaDocente({ texto: observacion, contexto, nivelApoyo: nivel, metaPaci: metaPaci.trim() });
    setTexto('');
    setMetaPaci('');
    setNivel('');
  }

  return (
    <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-200 no-print">
      <h3 className="text-base font-bold text-slate-900 flex items-center gap-2 mb-2">
        <span>✍️</span>
        <span>Registrar Observación Pedagógica Inmediata</span>
      </h3>

      <form id="form-nota-pie" onSubmit={enviar} className="space-y-3.5">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="sm:col-span-2">
            <label htmlFor="input-nota-texto" className="block text-xs font-bold text-slate-700 mb-1">Observación cualitativa:</label>
            <input
              ref={textoRef}
              type="text"
              id="input-nota-texto"
              value={texto}
              onChange={(e) => setTexto(e.target.value)}
              placeholder="Ej: Estudiante utilizó el comunicador de forma autónoma durante la colación..."
              required
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:bg-white focus:border-blue-500 transition-all"
            />
          </div>
          <div>
            <label htmlFor="select-contexto" className="block text-xs font-bold text-slate-700 mb-1">Contexto escolar:</label>
            <select
              id="select-contexto"
              value={contexto}
              onChange={(e) => cambiarContextoNota(e.target.value)}
              className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:bg-white focus:border-blue-500 font-medium"
            >
              {CONTEXTOS_ESCOLARES.map((c) => <option key={c.valor} value={c.valor}>{c.etiqueta}</option>)}
            </select>
          </div>
        </div>

        {/* Nivel de mediación (rúbrica rápida de asistencia del estudiante) */}
        <div className="bg-slate-50/80 p-3 sm:p-3.5 rounded-2xl border border-slate-200">
          <div className="flex items-center justify-between gap-2 mb-2">
            <span id="label-rubrica-mediacion" className="block text-xs font-black text-slate-800 uppercase tracking-wide flex items-center gap-1.5">
              <span>📊</span>
              <span>Nivel de Mediación (Rúbrica rápida):</span>
            </span>
            <span id="nivel-mediacion-hint" className="text-xs text-slate-500 font-medium">Selección única de asistencia</span>
          </div>

          <div
            id="grupo-nivel-mediacion"
            role="radiogroup"
            aria-labelledby="label-rubrica-mediacion"
            aria-describedby="nivel-mediacion-hint"
            onKeyDown={navegarNiveles}
            className="grid grid-cols-1 sm:grid-cols-3 gap-2"
          >
            {NIVELES_MEDIACION.map((n, i) => {
              const seleccionado = nivel === n.valor;
              const enfocable = seleccionado || (!nivel && i === 0);
              return (
                <button
                  key={n.id}
                  ref={(el) => { botonesNivel.current[i] = el; }}
                  type="button"
                  role="radio"
                  id={n.id}
                  data-nivel={n.valor}
                  aria-checked={seleccionado}
                  tabIndex={enfocable ? 0 : -1}
                  onClick={() => seleccionarNivel(n.valor)}
                  className={cx(
                    'flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl border-2 text-xs sm:text-sm transition-all cursor-pointer',
                    seleccionado ? cx('font-black shadow-xs ring-2', n.claseActiva) : cx('border-slate-200 bg-white text-slate-700 font-bold shadow-2xs', n.claseInactiva),
                  )}
                >
                  <span className={cx('w-3 h-3 rounded-full inline-block shrink-0', n.punto)} aria-hidden="true"></span>
                  <span>{n.valor}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Vinculación curricular PACI */}
        <div>
          <label htmlFor="input-meta-paci" className="block text-xs font-bold text-slate-700 mb-1 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <span>🎯</span>
              <span>Vinculación Curricular PACI:</span>
            </span>
            <span className="text-[11px] font-normal text-slate-400">Opcional</span>
          </label>
          <div className="relative">
            <input
              type="text"
              id="input-meta-paci"
              list="lista-sugerencias-paci"
              value={metaPaci}
              onChange={(e) => setMetaPaci(e.target.value)}
              placeholder="Meta / Indicador PACI (Ej: OA-03 Expresión de necesidades)"
              className="w-full pl-9 pr-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:bg-white focus:border-blue-500 transition-all font-medium placeholder:text-slate-400"
            />
            <span className="absolute left-3 top-2.5 text-slate-400 pointer-events-none text-sm" aria-hidden="true">🎯</span>
          </div>
          <datalist id="lista-sugerencias-paci">
            {SUGERENCIAS_PACI.map((s) => <option key={s} value={s}></option>)}
          </datalist>
        </div>

        {/* Atajos rápidos para agilizar la labor de aula */}
        <div className="flex flex-wrap items-center gap-1.5 pt-1">
          <span className="text-xs text-slate-400 font-semibold">Atajos:</span>
          {ATAJOS_NOTA.map((atajo) => (
            <button
              key={atajo.etiqueta}
              type="button"
              onClick={() => insertarAtajo(atajo)}
              className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 px-2 py-1 rounded-lg border border-slate-200 cursor-pointer"
            >
              {atajo.etiqueta}
            </button>
          ))}
        </div>

        <div className="flex justify-end pt-1">
          <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm px-5 py-2.5 rounded-xl shadow-xs transition-all flex items-center gap-2 cursor-pointer">
            <span>💾</span>
            <span>Guardar en Bitácora</span>
          </button>
        </div>
      </form>
    </div>
  );
}
