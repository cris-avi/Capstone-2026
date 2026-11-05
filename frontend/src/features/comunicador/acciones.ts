import type { CategoriaPictograma, FiltroCategoria, Pictograma } from '../../types';
import { obtenerEstilosCategoria } from '../../config/pictogramas';
import { generarId } from '../../lib/ids';
import { repositorio } from '../../services/repositorio';
import { hablar, sonido } from '../../services/sonido';
import { appStore, idsEstudianteActual } from '../../store/app';
import { confirmar, notificar } from '../../store/ui';
import { registrarEnBitacora } from '../bitacora/acciones';

/**
 * Tablero SAAC: tira de frase, filtro de categorías y pictogramas con fotos reales.
 */

/* ---------- Tira de frase ---------- */

function actualizarFrase(fraseActual: Pictograma[]): void {
  appStore.setState({ fraseActual });
}

export function agregarPictograma(picto: Pictograma): void {
  sonido.clic();
  actualizarFrase([...appStore.getState().fraseActual, picto]);
}

export function borrarUltimoPictograma(): void {
  const { fraseActual } = appStore.getState();
  if (fraseActual.length === 0) return;
  sonido.clic();
  actualizarFrase(fraseActual.slice(0, -1));
}

export function removerPictogramaEnIndice(indice: number): void {
  sonido.clic();
  actualizarFrase(appStore.getState().fraseActual.filter((_, i) => i !== indice));
}

export function limpiarFrase(): void {
  if (appStore.getState().fraseActual.length === 0) return;
  sonido.clic();
  actualizarFrase([]);
}

// Vocaliza la frase y la registra en la bitácora con el contexto escolar elegido
export function hablarFrase(): void {
  const { fraseActual, contextoNota } = appStore.getState();
  if (fraseActual.length === 0) return;

  const textoCompleto = fraseActual.map((p) => p.texto).join(' ');
  hablar(textoCompleto);
  registrarEnBitacora({
    tipo: 'frase',
    frase: textoCompleto,
    palabrasCount: fraseActual.length,
    contexto: contextoNota,
  });
}

export function filtrarCategoria(categoria: FiltroCategoria): void {
  sonido.clic();
  appStore.setState({ categoriaFiltro: categoria });
}

/* ---------- Pictogramas personalizados con foto real ---------- */

function guardarPictogramasPersonalizados(pictogramasPersonalizados: Pictograma[]): void {
  appStore.setState({ pictogramasPersonalizados });
  const ids = idsEstudianteActual();
  if (ids) repositorio.pictogramas.guardar(ids.profesionalId, ids.estudianteId, pictogramasPersonalizados);
}

// Retorna true si se guardó (el modal puede cerrarse)
export function guardarPictogramaPersonalizado(datos: { texto: string; categoria: CategoriaPictograma; imagenUrl: string | null }): boolean {
  const texto = datos.texto.trim().toUpperCase();
  if (!texto) {
    notificar('Por favor ingresa la etiqueta o nombre del pictograma.', 'advertencia');
    return false;
  }
  if (!datos.imagenUrl) {
    notificar('Por favor selecciona una foto o imagen antes de guardar.', 'advertencia');
    return false;
  }

  const nuevo: Pictograma = {
    id: generarId('picto_custom'),
    texto,
    imagenUrl: datos.imagenUrl,
    categoria: datos.categoria,
    esencial: datos.categoria === 'esenciales',
    ...obtenerEstilosCategoria(datos.categoria),
    esPersonalizado: true,
    fechaCreacion: new Date().toISOString(),
  };
  guardarPictogramasPersonalizados([nuevo, ...appStore.getState().pictogramasPersonalizados]);

  sonido.exito();
  hablar(`Pictograma de ${texto} guardado.`);
  registrarEnBitacora({
    tipo: 'nota',
    frase: `Docente agregó nuevo pictograma SAAC personalizado: "${texto}" (${datos.categoria})`,
    palabrasCount: 0,
    contexto: 'Comunicador SAAC',
    observacion: 'Personalización de vocabulario con foto real',
  });
  return true;
}

export async function eliminarPictogramaPersonalizado(id: string): Promise<void> {
  sonido.clic();
  const picto = appStore.getState().pictogramasPersonalizados.find((p) => p.id === id);
  const ok = await confirmar({
    titulo: 'Eliminar foto personalizada',
    mensaje: `¿Deseas eliminar la foto personalizada de "${picto ? picto.texto : 'este pictograma'}" del comunicador?`,
    textoConfirmar: 'Eliminar',
    peligro: true,
  });
  if (ok) guardarPictogramasPersonalizados(appStore.getState().pictogramasPersonalizados.filter((p) => p.id !== id));
}
