import type { Tarea } from '../../types';

// Progreso de la rutina del día y mensaje de refuerzo para el estudiante
export function progresoAgenda(agenda: Tarea[]) {
  const total = agenda.length;
  const terminadas = agenda.filter((t) => t.terminada).length;
  const porcentaje = total > 0 ? Math.round((terminadas / total) * 100) : 0;

  let mensaje = 'Paso a paso cumpliendo la rutina diaria 💪';
  if (terminadas === total && total > 0) mensaje = '¡Felicidades! Completaste toda tu jornada escolar 🎉';
  else if (porcentaje >= 50) mensaje = '¡Excelente avance! Ya llevas más de la mitad ⭐';

  return { total, terminadas, porcentaje, mensaje };
}
