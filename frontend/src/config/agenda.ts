import type { Tarea } from '../types';

// Rutina predefinida estándar escolar para un estudiante nuevo
export function crearRutinaPredeterminada(): Tarea[] {
  return [
    { id: 'act_1', titulo: 'Llegada', desc: 'Saludar y dejar mochila en su casillero', icono: '🎒', hora: '08:30', terminada: false },
    { id: 'act_2', titulo: 'Clase', desc: 'Actividad pedagógica en el aula', icono: '📚', hora: '09:00', terminada: false },
    { id: 'act_3', titulo: 'Colación', desc: 'Comer alimentos y beber agua', icono: '🥪', hora: '10:15', terminada: false },
    { id: 'act_4', titulo: 'Recreo', desc: 'Juego libre y descanso en el patio', icono: '⚽', hora: '10:45', terminada: false },
    { id: 'act_5', titulo: 'Salida', desc: 'Guardar materiales y despedida', icono: '🚌', hora: '13:00', terminada: false },
  ];
}

export const DESCRIPCION_TAREA_NUEVA = 'Actividad planificada de la rutina';

export const ICONOS_ACTIVIDAD = [
  { icono: '🎨', etiqueta: 'Taller de Arte' },
  { icono: '🎵', etiqueta: 'Música' },
  { icono: '🏃', etiqueta: 'Educación Física' },
  { icono: '📖', etiqueta: 'Biblioteca / Lectura' },
  { icono: '💻', etiqueta: 'Computación' },
  { icono: '🧹', etiqueta: 'Ordenar Sala' },
  { icono: '🍎', etiqueta: 'Alimentación' },
  { icono: '⭐', etiqueta: 'Especial' },
];
