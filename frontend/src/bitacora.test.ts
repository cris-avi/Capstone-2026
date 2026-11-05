import { test, expect } from 'vitest';

// Función que formatea fechas técnicas a formato local (DD-MM-YYYY)
function formatearFechaChilena(fechaISO: string): string {
  if (!fechaISO) return 'Fecha inválida';
  const fecha = new Date(fechaISO);
  if (isNaN(fecha.getTime())) return 'Fecha inválida';
  
  const dia = String(fecha.getDate()).padStart(2, '0');
  const mes = String(fecha.getMonth() + 1).padStart(2, '0');
  const anio = fecha.getFullYear();
  
  return `${dia}-${mes}-${anio}`;
}

test('Debe convertir una fecha ISO estándar al formato DD-MM-YYYY', () => {
  expect(formatearFechaChilena('2026-11-04T12:00:00Z')).toBe('04-11-2026');
});

test('Debe manejar fechas vacías o nulas devolviendo un mensaje de error', () => {
  expect(formatearFechaChilena('')).toBe('Fecha inválida');
});

test('Debe manejar textos que no son fechas sin romper la aplicación', () => {
  expect(formatearFechaChilena('hola-mundo')).toBe('Fecha inválida');
});