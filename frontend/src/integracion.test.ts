import { test, expect } from 'vitest';

test('El frontend se comunica exitosamente con la API del Backend (Prueba de Integración)', async () => {
  // 1. Hacemos una petición HTTP real al contenedor del backend en Docker
  const respuesta = await fetch('http://127.0.0.1:5000/');
  
  // 2. Extraemos el texto que nos responde el servidor
  const texto = await respuesta.text();

  // 3. Verificamos que el estado de conexión sea 200 (Éxito)
  expect(respuesta.status).toBe(200);
  
  // 4. Verificamos que el mensaje recibido sea el de nuestra API de TEA-yudo
  expect(texto).toContain('API de TEA-yudo funcionando');
});