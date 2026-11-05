import { test, expect } from 'vitest';

// Función que calcula el porcentaje de la rutina completada
function calcularProgresoRutina(totalTareas: number, tareasCompletadas: number): number {
  if (totalTareas === 0) return 0;
  if (tareasCompletadas > totalTareas) return 100;
  return Math.round((tareasCompletadas / totalTareas) * 100);
}

test('Si se completan 2 de 4 tareas, el progreso debe ser 50%', () => {
  expect(calcularProgresoRutina(4, 2)).toBe(50);
});

test('Si no hay tareas asignadas, el progreso debe ser 0% para evitar errores matemáticos', () => {
  expect(calcularProgresoRutina(0, 0)).toBe(0);
});

test('Si se completan más tareas de las asignadas por error, el tope es 100%', () => {
  expect(calcularProgresoRutina(5, 6)).toBe(100);
});