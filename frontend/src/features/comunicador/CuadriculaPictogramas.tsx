import { useMemo } from 'react';
import { PICTOGRAMAS_DB } from '../../config/pictogramas';
import { cx } from '../../lib/cx';
import { useApp } from '../../store/app';
import { agregarPictograma, eliminarPictogramaPersonalizado } from './acciones';
import { ImagenPictograma } from './ImagenPictograma';

// Cuadrícula de pictogramas grandes SAAC (fotos personalizadas primero, luego ARASAAC)
export function CuadriculaPictogramas() {
  const personalizados = useApp((s) => s.pictogramasPersonalizados);
  const categoria = useApp((s) => s.categoriaFiltro);
  const desbloqueado = useApp((s) => s.desbloqueado);

  const visibles = useMemo(
    () => [...personalizados, ...PICTOGRAMAS_DB].filter((p) => {
      if (categoria === 'todas') return true;
      if (categoria === 'esenciales') return p.esencial;
      return p.categoria === categoria;
    }),
    [personalizados, categoria],
  );

  return (
    <div id="cuadricula-pictogramas" className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4" role="group" aria-label="Tablero de pictogramas">
      {visibles.map((picto) => (
        <div key={picto.id} className="relative group transition-transform hover:-translate-y-1">
          <button
            type="button"
            onClick={() => agregarPictograma(picto)}
            aria-label={`Agregar ${picto.texto} a la frase`}
            className={cx(
              picto.colorFondo,
              picto.colorBorde,
              'w-full h-full border-4 rounded-3xl p-3 sm:p-4 flex flex-col items-center justify-between min-h-[140px] sm:min-h-[170px] shadow-md hover:shadow-lg active:scale-95 transition-all cursor-pointer select-none',
            )}
          >
            {/* Distintivo de foto real */}
            {picto.esPersonalizado && (
              <span className="absolute top-2 left-2 z-10 pointer-events-none bg-indigo-600 text-white text-[10px] font-black px-1.5 py-0.5 rounded-md shadow-xs">
                📷 Foto
              </span>
            )}
            <div className="w-full flex-1 flex items-center justify-center py-1">
              <ImagenPictograma
                picto={picto}
                diferida
                className={cx(
                  picto.imagenUrl ? 'max-h-20 sm:max-h-24 w-20 sm:w-24 object-cover rounded-2xl shadow-2xs' : 'max-h-20 sm:max-h-24 w-auto object-contain drop-shadow-xs',
                  'transition-transform group-hover:scale-105',
                )}
                claseEmoji="text-5xl select-none"
              />
            </div>
            <span className={cx('w-full text-center font-black text-base sm:text-lg tracking-wide uppercase mt-1 truncate', picto.colorTexto)}>
              {picto.texto}
            </span>
          </button>

          {/* Botón discreto para eliminar la foto (solo profesional); va fuera de la tarjeta porque un botón no puede contener otro */}
          {picto.esPersonalizado && desbloqueado && (
            <button
              type="button"
              onClick={() => eliminarPictogramaPersonalizado(picto.id)}
              className="absolute top-2 right-2 bg-rose-500/90 hover:bg-rose-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs font-black shadow-xs cursor-pointer z-20 transition-transform active:scale-90"
              title="Eliminar foto personalizada"
              aria-label={`Eliminar pictograma ${picto.texto}`}
            >
              ✕
            </button>
          )}
        </div>
      ))}
    </div>
  );
}
