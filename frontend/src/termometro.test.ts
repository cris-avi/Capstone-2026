import { test, expect } from 'vitest';

// 1. Aquí está la lógica de nuestra aplicación (Lo que queremos probar)
function obtenerColorEmocion(nivel: number) {
  if (nivel === 1) return 'verde';    // Tranquilo
  if (nivel === 2) return 'amarillo'; // Ansioso
  if (nivel >= 3) return 'rojo';      // Crisis o desregulación
  return 'desconocido';
}

// 2. Aquí empezamos las pruebas unitarias
test('Si el estudiante está en nivel 1, el termómetro debe ser verde', () => {
  const resultado = obtenerColorEmocion(1);
  expect(resultado).toBe('verde'); // "Espero que el resultado sea 'verde'"
});

test('Si el estudiante está en nivel 3, el termómetro debe alertar en rojo', () => {
  const resultado = obtenerColorEmocion(3);
  expect(resultado).toBe('rojo');
});

test('Si se ingresa un nivel inválido, debe devolver desconocido', () => {
  const resultado = obtenerColorEmocion(-5);
  expect(resultado).toBe('desconocido');
});