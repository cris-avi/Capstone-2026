import { test, expect } from 'vitest';

test('Prueba de Rendimiento (Estrés): La API debe soportar 50 peticiones concurrentes en menos de 1000ms', async () => {
  // 1. Iniciamos el cronómetro
  const tiempoInicio = Date.now();
  const cantidadPeticiones = 50;
  
  // 2. Preparamos las 50 peticiones simultáneas hacia tu backend en Docker
  const peticiones = Array.from({ length: cantidadPeticiones }).map(() =>
    fetch('http://127.0.0.1:5000/')
  );
  
  // 3. ¡Las disparamos todas al mismo tiempo!
  const respuestas = await Promise.all(peticiones);
  
  // 4. Detenemos el cronómetro
  const tiempoFin = Date.now();
  const tiempoTotal = tiempoFin - tiempoInicio;

  // 5. Validamos que ninguna petición haya fallado (Todas deben ser 200 OK)
  respuestas.forEach(respuesta => {
    expect(respuesta.status).toBe(200);
  });
  
  // 6. Validamos que el servidor haya resuelto todo en menos de 1000 milisegundos (1 segundo)
  expect(tiempoTotal).toBeLessThan(1000);
});