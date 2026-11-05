import { useState } from 'react';
import { FILTROS_CATEGORIA } from '../../config/pictogramas';
import { cx } from '../../lib/cx';
import { sonido } from '../../services/sonido';
import { useApp } from '../../store/app';
import { filtrarCategoria } from './acciones';
import { CuadriculaPictogramas } from './CuadriculaPictogramas';
import { ModalPictoPersonalizado } from './ModalPictoPersonalizado';
import { TiraFrase } from './TiraFrase';

const CLASE_FILTRO = 'font-bold text-xs sm:text-sm px-3.5 py-1.5 rounded-xl transition-all cursor-pointer';

// Vista 1: tablero de comunicación SAAC del estudiante
export function VistaComunicador() {
  const visible = useApp((s) => s.vista === 'nino');
  const desbloqueado = useApp((s) => s.desbloqueado);
  const categoria = useApp((s) => s.categoriaFiltro);
  const [modalFoto, setModalFoto] = useState(false);

  return (
    <section id="vista-nino" className={cx('space-y-4', !visible && 'hidden')} aria-label="Tablero SAAC del estudiante">
      <TiraFrase />

      {/* Filtros por categoría y creación de pictogramas */}
      <div className="flex items-center justify-between gap-2 overflow-x-auto pb-1" role="toolbar" aria-label="Filtro de categorías y gestión de pictogramas">
        <div className="flex items-center gap-1.5 sm:gap-2">
          {FILTROS_CATEGORIA.map((filtro) => (
            <button
              key={filtro.id}
              type="button"
              onClick={() => filtrarCategoria(filtro.id)}
              aria-pressed={categoria === filtro.id}
              className={cx(CLASE_FILTRO, categoria === filtro.id ? 'bg-slate-900 text-white shadow-xs' : cx('bg-white border', filtro.claseInactiva))}
            >
              {filtro.etiqueta}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {desbloqueado && (
            <button
              type="button"
              id="btn-abrir-modal-picto-custom"
              onClick={() => { sonido.clic(); setModalFoto(true); }}
              className="bg-indigo-50 hover:bg-indigo-100 text-indigo-800 font-bold text-xs sm:text-sm px-3.5 py-1.5 rounded-xl border border-indigo-300 transition-all flex items-center gap-1.5 shadow-2xs cursor-pointer active:scale-95 group"
              title="Agregar foto real o pictograma personalizado para el estudiante (compañeros, educadoras, objetos del aula)"
              aria-label="Agregar pictograma personalizado con foto real"
            >
              <span className="group-hover:scale-110 transition-transform">📷</span>
              <span>+ Foto Real</span>
            </button>
          )}
          <span className="text-xs text-slate-400 font-semibold hidden md:inline">Clave Fitzgerald</span>
        </div>
      </div>

      <CuadriculaPictogramas />

      {modalFoto && <ModalPictoPersonalizado onCerrar={() => setModalFoto(false)} />}
    </section>
  );
}
