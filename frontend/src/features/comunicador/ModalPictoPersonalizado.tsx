import { useRef, useState, type ChangeEvent, type FormEvent, type KeyboardEvent } from 'react';
import type { CategoriaPictograma } from '../../types';
import { CATEGORIAS_PERSONALIZADAS, obtenerEstilosCategoria } from '../../config/pictogramas';
import { cx } from '../../lib/cx';
import { redimensionarImagen } from '../../lib/imagen';
import { sonido } from '../../services/sonido';
import { notificar } from '../../store/ui';
import { EncabezadoModal, Modal } from '../../components/Modal';
import { guardarPictogramaPersonalizado } from './acciones';

// Agregar fotos reales de educadoras, compañeros u objetos del aula al comunicador
export function ModalPictoPersonalizado({ onCerrar }: { onCerrar: () => void }) {
  const [imagen, setImagen] = useState<string | null>(null);
  const [texto, setTexto] = useState('');
  const [categoria, setCategoria] = useState<CategoriaPictograma>('personas');
  const inputArchivoRef = useRef<HTMLInputElement>(null);

  const estilos = obtenerEstilosCategoria(categoria);
  const etiqueta = texto.trim() ? texto.trim().toUpperCase() : 'NOMBRE';

  function cerrar() {
    sonido.clic();
    onCerrar();
  }

  async function procesarArchivo(evento: ChangeEvent<HTMLInputElement>) {
    const archivo = evento.target.files?.[0];
    if (!archivo) return;
    try {
      setImagen(await redimensionarImagen(archivo));
    } catch (e) {
      notificar('No se pudo leer la imagen seleccionada.', 'error');
    }
  }

  function abrirSelector() {
    inputArchivoRef.current?.click();
  }

  function alPresionarDropzone(evento: KeyboardEvent<HTMLDivElement>) {
    if (evento.key === 'Enter' || evento.key === ' ') {
      evento.preventDefault();
      abrirSelector();
    }
  }

  function enviar(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault();
    if (guardarPictogramaPersonalizado({ texto, categoria, imagenUrl: imagen })) cerrar();
  }

  return (
    <Modal id="modal-picto-custom" tituloId="modal-picto-custom-titulo" onCerrar={cerrar} className="max-w-md space-y-4 max-h-[92vh] overflow-y-auto">
      <EncabezadoModal id="modal-picto-custom-titulo" icono="📷" titulo="Nuevo Pictograma con Foto Real" onCerrar={cerrar} />

      <p className="text-xs text-slate-500">
        Agrega fotos reales de educadoras, compañeros u objetos del aula para enriquecer el comunicador SAAC según las necesidades del estudiante.
      </p>

      <form id="form-picto-custom" onSubmit={enviar} className="space-y-3.5">

        {/* Foto local con previsualización */}
        <div>
          <label htmlFor="input-foto-picto" className="block text-xs font-bold text-slate-700 mb-1 flex items-center justify-between">
            <span>Foto o Imagen Real:</span>
            <span className="text-[11px] text-slate-400 font-normal">PNG, JPG, WebP</span>
          </label>

          <input ref={inputArchivoRef} type="file" id="input-foto-picto" accept="image/*" className="hidden" onChange={procesarArchivo} />

          <div
            id="dropzone-foto"
            role="button"
            tabIndex={0}
            onClick={abrirSelector}
            onKeyDown={alPresionarDropzone}
            className="border-2 border-dashed border-slate-300 hover:border-indigo-500 rounded-2xl p-3.5 flex flex-col items-center justify-center gap-2 cursor-pointer transition-all bg-slate-50 hover:bg-indigo-50/40 text-center group"
          >
            {imagen ? (
              <div id="contenedor-preview-foto" className="flex flex-col items-center gap-1.5 w-full">
                <img id="preview-img-picto" src={imagen} alt="Vista previa de la foto" className="w-24 h-24 object-cover rounded-2xl border-2 border-indigo-400 shadow-xs" />
                <span className="text-xs font-bold text-indigo-600 hover:underline">Cambiar foto 🔄</span>
              </div>
            ) : (
              <div id="placeholder-foto" className="flex flex-col items-center gap-1.5 py-1">
                <div className="w-11 h-11 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-xl group-hover:scale-110 transition-transform">📸</div>
                <p className="font-bold text-xs sm:text-sm text-slate-700">Toca para seleccionar foto del dispositivo</p>
                <p className="text-[11px] text-slate-400">Optimizada automáticamente para SAAC</p>
              </div>
            )}
          </div>
        </div>

        {/* Etiqueta vocalizada */}
        <div>
          <label htmlFor="input-nombre-picto" className="block text-xs font-bold text-slate-700 mb-1">Etiqueta / Nombre vocalizado:</label>
          <input
            type="text"
            id="input-nombre-picto"
            value={texto}
            onChange={(e) => setTexto(e.target.value)}
            placeholder="Ej: Tía Nicole, Mi Mochila, Amigo Mateo..."
            required
            maxLength={28}
            autoFocus
            className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:bg-white focus:border-indigo-500 transition-all font-bold uppercase placeholder:normal-case placeholder:font-normal"
          />
          <p className="text-[11px] text-slate-400 mt-1">Este texto será vocalizado por la voz del comunicador y registrado en la bitácora.</p>
        </div>

        {/* Categoría según la Clave Fitzgerald */}
        <div>
          <label htmlFor="select-cat-picto" className="block text-xs font-bold text-slate-700 mb-1">Categoría (Clave Fitzgerald SAAC):</label>
          <select
            id="select-cat-picto"
            value={categoria}
            onChange={(e) => setCategoria(e.target.value as CategoriaPictograma)}
            className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:bg-white focus:border-indigo-500 font-medium cursor-pointer"
          >
            {CATEGORIAS_PERSONALIZADAS.map((c) => <option key={c.id} value={c.id}>{c.etiqueta}</option>)}
          </select>
        </div>

        {/* Previsualización en vivo tipo tarjeta SAAC */}
        <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200">
          <span className="text-[11px] font-black uppercase tracking-wider text-slate-400 block mb-2 text-center">Vista Previa en el Tablero:</span>
          <div className="flex items-center justify-center">
            <div
              id="tarjeta-preview-saac"
              className={cx('w-36 min-h-[145px] p-2.5 rounded-2xl border-4 flex flex-col items-center justify-between text-center shadow-xs transition-colors', estilos.colorBorde, estilos.colorFondo)}
            >
              <div className="w-full flex-1 flex items-center justify-center py-1">
                {imagen ? (
                  <img id="preview-picto-img-tarjeta" src={imagen} className="h-16 w-16 object-cover rounded-xl" alt="Vista previa" />
                ) : (
                  <div id="preview-picto-placeholder" className="text-3xl select-none">{estilos.fallbackEmoji}</div>
                )}
              </div>
              <span id="preview-picto-label" className={cx('font-black text-xs uppercase truncate w-full', estilos.colorTexto)}>{etiqueta}</span>
            </div>
          </div>
        </div>

        <div className="pt-1 flex justify-end gap-2">
          <button type="button" onClick={cerrar} className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-bold text-sm cursor-pointer">
            Cancelar
          </button>
          <button type="submit" id="btn-guardar-picto-custom" className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm px-5 py-2.5 rounded-xl shadow-xs transition-all flex items-center gap-2 cursor-pointer">
            <span>💾</span>
            <span>Guardar Pictograma</span>
          </button>
        </div>
      </form>
    </Modal>
  );
}
