import { useEffect, useRef } from 'react';
import { cx } from '../../lib/cx';
import { pluralizar } from '../../lib/formato';
import { useApp } from '../../store/app';
import { borrarUltimoPictograma, hablarFrase, limpiarFrase, removerPictogramaEnIndice } from './acciones';
import { ImagenPictograma } from './ImagenPictograma';

// Tira de frase en construcción con la botonera táctil principal
export function TiraFrase() {
  const frase = useApp((s) => s.fraseActual);
  const hablando = useApp((s) => s.hablando);
  const tiraRef = useRef<HTMLDivElement>(null);

  // El último pictograma agregado siempre queda a la vista
  useEffect(() => {
    const tira = tiraRef.current;
    if (tira) tira.scrollLeft = tira.scrollWidth;
  }, [frase]);

  return (
    <div className="bg-white rounded-3xl p-3.5 sm:p-5 shadow-md border-3 border-slate-300 transition-all">
      <div className="flex items-center justify-between gap-2 mb-2">
        <span className="text-xs sm:text-sm font-extrabold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block animate-pulse"></span>
          Frase en construcción:
        </span>
        <span id="contador-palabras-frase" className="text-xs font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-lg">
          {pluralizar(frase.length, 'palabra', 'palabras')}
        </span>
      </div>

      {/* Área donde aparecen los pictogramas que el estudiante va seleccionando */}
      <div
        id="tira-frase"
        ref={tiraRef}
        className="min-h-[115px] sm:min-h-[135px] p-2.5 sm:p-3 bg-amber-50/50 rounded-2xl border-2 border-dashed border-amber-300 flex items-center gap-2 sm:gap-3 overflow-x-auto overflow-y-hidden"
        role="region"
        aria-live="polite"
      >
        {frase.length === 0 ? (
          <div id="tira-placeholder" className="w-full text-center py-4 select-none text-slate-400 flex flex-col items-center justify-center gap-1">
            <span className="text-3xl">👉</span>
            <p className="font-bold text-sm sm:text-base text-slate-500">Toca los pictogramas para armar tu mensaje</p>
          </div>
        ) : (
          frase.map((item, indice) => (
            <div
              key={indice}
              className={cx(
                'anim-pop bg-white border-3 rounded-2xl p-2 flex flex-col items-center justify-center min-w-[85px] sm:min-w-[105px] h-[95px] sm:h-[110px] shadow-xs relative shrink-0',
                item.colorBorde,
              )}
            >
              <button
                type="button"
                onClick={() => removerPictogramaEnIndice(indice)}
                className="absolute -top-2 -right-2 bg-rose-500 hover:bg-rose-600 text-white w-5 h-5 sm:w-6 sm:h-6 rounded-full flex items-center justify-center text-xs font-black shadow-xs cursor-pointer z-10"
                title="Quitar"
                aria-label={`Quitar ${item.texto}`}
              >
                ✕
              </button>
              <ImagenPictograma
                picto={item}
                className={item.imagenUrl ? 'h-10 sm:h-12 w-10 sm:w-12 object-cover rounded-xl shadow-2xs' : 'h-10 sm:h-12 w-auto object-contain'}
                claseEmoji="text-2xl"
              />
              <span className="text-xs sm:text-sm font-extrabold text-slate-900 tracking-tight mt-1 text-center truncate w-full">{item.texto}</span>
            </div>
          ))
        )}
      </div>

      {/* Botonera táctil principal: hablar y borrar */}
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-2.5 sm:gap-3 mt-3.5">
        <button
          type="button"
          id="btn-hablar"
          onClick={hablarFrase}
          disabled={frase.length === 0}
          className={cx(
            'sm:col-span-8 bg-linear-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 active:scale-[0.98] text-white font-black text-xl sm:text-2xl py-4 sm:py-5 px-6 rounded-2xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-3 border-b-4 border-green-800 disabled:opacity-40 disabled:cursor-not-allowed group cursor-pointer',
            hablando && 'ring-4 ring-amber-400',
          )}
          aria-label="Vocalizar la frase en voz alta y guardarla en la bitácora"
        >
          <span className="text-3xl sm:text-4xl group-hover:scale-110 transition-transform">📢</span>
          <span className="tracking-wide">¡HABLAR!</span>
        </button>

        <button
          type="button"
          id="btn-borrar-ultimo"
          onClick={borrarUltimoPictograma}
          className="sm:col-span-2 bg-slate-100 hover:bg-slate-200 active:scale-[0.98] text-slate-800 font-bold text-sm sm:text-base py-3 sm:py-5 px-3 rounded-2xl border-2 border-slate-300 flex items-center justify-center gap-1.5 transition-all cursor-pointer"
          aria-label="Borrar el último pictograma"
        >
          <span className="text-xl">⬅️</span>
          <span>Atrás</span>
        </button>

        <button
          type="button"
          id="btn-borrar-todo"
          onClick={limpiarFrase}
          className="sm:col-span-2 bg-rose-50 hover:bg-rose-100 active:scale-[0.98] text-rose-700 font-bold text-sm sm:text-base py-3 sm:py-5 px-3 rounded-2xl border-2 border-rose-200 flex items-center justify-center gap-1.5 transition-all cursor-pointer"
          aria-label="Borrar todos los pictogramas"
        >
          <span className="text-xl">🗑️</span>
          <span>Borrar</span>
        </button>
      </div>
    </div>
  );
}
