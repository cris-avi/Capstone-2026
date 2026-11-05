import type { CategoriaPictograma, EstilosCategoria, FiltroCategoria, Pictograma } from '../types';

// Base de datos oficial de pictogramas ARASAAC (Clave de Color Fitzgerald)
export const PICTOGRAMAS_DB: Pictograma[] = [
  { id: 'quiero', texto: 'QUIERO', arasaacId: 5441, categoria: 'acciones', esencial: true, colorBorde: 'border-green-500', colorFondo: 'bg-green-50/80', colorTexto: 'text-green-950', fallbackEmoji: '🙋‍♂️' },
  { id: 'no_quiero', texto: 'NO QUIERO', arasaacId: 5526, categoria: 'acciones', esencial: true, colorBorde: 'border-rose-500', colorFondo: 'bg-rose-50/80', colorTexto: 'text-rose-950', fallbackEmoji: '🙅‍♂️' },
  { id: 'bano', texto: 'BAÑO', arasaacId: 6929, categoria: 'necesidades', esencial: true, colorBorde: 'border-blue-500', colorFondo: 'bg-blue-50/80', colorTexto: 'text-blue-950', fallbackEmoji: '🚻' },
  { id: 'comer', texto: 'COMER', arasaacId: 6456, categoria: 'necesidades', esencial: true, colorBorde: 'border-amber-500', colorFondo: 'bg-amber-50/80', colorTexto: 'text-amber-950', fallbackEmoji: '🥪' },
  { id: 'ayuda', texto: 'AYUDA', arasaacId: 12252, categoria: 'necesidades', esencial: true, colorBorde: 'border-purple-500', colorFondo: 'bg-purple-50/80', colorTexto: 'text-purple-950', fallbackEmoji: '🆘' },
  { id: 'feliz', texto: 'FELIZ', arasaacId: 9907, categoria: 'emociones', esencial: true, colorBorde: 'border-yellow-500', colorFondo: 'bg-yellow-50/80', colorTexto: 'text-yellow-950', fallbackEmoji: '😄' },
  { id: 'triste', texto: 'TRISTE', arasaacId: 35545, categoria: 'emociones', esencial: true, colorBorde: 'border-slate-500', colorFondo: 'bg-slate-100', colorTexto: 'text-slate-900', fallbackEmoji: '😢' },
  { id: 'recreo', texto: 'RECREO', arasaacId: 33064, categoria: 'acciones', esencial: true, colorBorde: 'border-emerald-600', colorFondo: 'bg-emerald-50/80', colorTexto: 'text-emerald-950', fallbackEmoji: '🔔' },
  { id: 'agua', texto: 'AGUA', arasaacId: 32464, categoria: 'necesidades', esencial: false, colorBorde: 'border-cyan-500', colorFondo: 'bg-cyan-50/80', colorTexto: 'text-cyan-950', fallbackEmoji: '💧' },
  { id: 'jugar', texto: 'JUGAR', arasaacId: 23392, categoria: 'acciones', esencial: false, colorBorde: 'border-lime-500', colorFondo: 'bg-lime-50/80', colorTexto: 'text-lime-950', fallbackEmoji: '🧸' },
  { id: 'si', texto: 'SÍ', arasaacId: 5584, categoria: 'acciones', esencial: false, colorBorde: 'border-green-600', colorFondo: 'bg-green-100/80', colorTexto: 'text-green-950', fallbackEmoji: '👍' },
  { id: 'mas', texto: 'MÁS', arasaacId: 3220, categoria: 'necesidades', esencial: false, colorBorde: 'border-indigo-500', colorFondo: 'bg-indigo-50/80', colorTexto: 'text-indigo-950', fallbackEmoji: '➕' },
];

// Colores y emojis según la Clave Fitzgerald oficial de ARASAAC
const ESTILOS_CATEGORIA: Partial<Record<CategoriaPictograma, EstilosCategoria>> = {
  personas: { colorBorde: 'border-amber-400', colorFondo: 'bg-amber-50/80', colorTexto: 'text-amber-950', fallbackEmoji: '👤' },
  acciones: { colorBorde: 'border-green-500', colorFondo: 'bg-green-50/80', colorTexto: 'text-green-950', fallbackEmoji: '🟢' },
  necesidades: { colorBorde: 'border-blue-500', colorFondo: 'bg-blue-50/80', colorTexto: 'text-blue-950', fallbackEmoji: '🎒' },
};
const ESTILOS_ESENCIALES: EstilosCategoria = { colorBorde: 'border-yellow-500', colorFondo: 'bg-yellow-50/80', colorTexto: 'text-yellow-950', fallbackEmoji: '⭐' };

export function obtenerEstilosCategoria(categoria: CategoriaPictograma): EstilosCategoria {
  return ESTILOS_CATEGORIA[categoria] ?? ESTILOS_ESENCIALES;
}

export function urlImagenPictograma(picto: Pictograma): string {
  if (picto.imagenUrl) return picto.imagenUrl;
  return picto.arasaacId ? `https://static.arasaac.org/pictograms/${picto.arasaacId}/${picto.arasaacId}_300.png` : '';
}

// Botones de filtro del tablero; la clase inactiva conserva el color de cada categoría
export const FILTROS_CATEGORIA: { id: FiltroCategoria; etiqueta: string; claseInactiva: string }[] = [
  { id: 'todas', etiqueta: '✨ Todos', claseInactiva: 'text-slate-700 border-slate-300 hover:bg-slate-100' },
  { id: 'esenciales', etiqueta: '⭐ Esenciales', claseInactiva: 'text-slate-700 border-slate-300 hover:bg-slate-100' },
  { id: 'personas', etiqueta: '👥 Personas', claseInactiva: 'text-amber-800 border-amber-300 hover:bg-amber-50' },
  { id: 'acciones', etiqueta: '🟢 Acciones', claseInactiva: 'text-green-700 border-green-300 hover:bg-green-50' },
  { id: 'necesidades', etiqueta: '🔵 Necesidades', claseInactiva: 'text-blue-700 border-blue-300 hover:bg-blue-50' },
  { id: 'emociones', etiqueta: '🟡 Emociones', claseInactiva: 'text-yellow-800 border-yellow-300 hover:bg-yellow-50' },
];

// Categorías disponibles para los pictogramas con foto real
export const CATEGORIAS_PERSONALIZADAS: { id: CategoriaPictograma; etiqueta: string }[] = [
  { id: 'personas', etiqueta: '👥 Personas (Amarillo - Compañeros, Docentes, Familia)' },
  { id: 'necesidades', etiqueta: '🔵 Necesidades / Objetos del Aula (Azul)' },
  { id: 'acciones', etiqueta: '🟢 Acciones (Verde - Verbos, Actividades)' },
  { id: 'esenciales', etiqueta: '⭐ Esenciales (Vocabulario Nuclear)' },
];
