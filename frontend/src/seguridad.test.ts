import { test, expect } from 'vitest';

// Función que limpia textos para evitar Inyección SQL y ataques XSS (Cross-Site Scripting)
function sanitizarEntrada(texto: string): string {
  if (!texto) return '';
  // Reemplaza caracteres peligrosos típicos de hackeo por espacios vacíos
  return texto.replace(/['";<>()]/g, '');
}

test('Prueba de Seguridad: Debe neutralizar intentos de Inyección SQL y scripts maliciosos', () => {
  // Simulamos un texto ingresado por un atacante en el login o bitácora
  const ataqueSQL = "DROP TABLE usuarios; --";
  const ataqueXSS = "<script>alert('hack')</script>";

  const sqlLimpio = sanitizarEntrada(ataqueSQL);
  const xssLimpio = sanitizarEntrada(ataqueXSS);

  // Verificamos que los caracteres destructivos hayan sido eliminados
  expect(sqlLimpio).not.toContain(';');
  expect(sqlLimpio).not.toContain("'");
  expect(xssLimpio).not.toContain('<');
  expect(xssLimpio).not.toContain('>');
  
  // Validamos el resultado final que sí entraría a la base de datos de forma segura
  expect(sqlLimpio).toBe('DROP TABLE usuarios --');
  expect(xssLimpio).toBe('scriptalerthack/script');
});