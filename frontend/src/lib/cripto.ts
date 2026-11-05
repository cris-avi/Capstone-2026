import { PBKDF2_ITERACIONES } from '../config/constantes';

/**
 * Hash de contraseña y PIN con PBKDF2-SHA256 (Web Crypto, requiere HTTPS o localhost).
 */

export function criptoDisponible(): boolean {
  return !!(window.crypto && window.crypto.subtle);
}

function aBase64(buffer: ArrayBuffer | Uint8Array): string {
  return btoa(String.fromCharCode(...new Uint8Array(buffer)));
}

function deBase64(texto: string): Uint8Array<ArrayBuffer> {
  return Uint8Array.from(atob(texto), (c) => c.charCodeAt(0));
}

export function generarSal(): string {
  const sal = new Uint8Array(16);
  crypto.getRandomValues(sal);
  return aBase64(sal);
}

export async function derivarHash(secreto: string, salBase64: string, iteraciones: number = PBKDF2_ITERACIONES): Promise<string> {
  const material = await crypto.subtle.importKey('raw', new TextEncoder().encode(secreto), 'PBKDF2', false, ['deriveBits']);
  const bits = await crypto.subtle.deriveBits(
    { name: 'PBKDF2', salt: deBase64(salBase64), iterations: iteraciones, hash: 'SHA-256' },
    material,
    256,
  );
  return aBase64(bits);
}

// Comparación en tiempo constante para no filtrar información por la duración
export async function verificarSecreto(secreto: string, salBase64: string, hashEsperado: string, iteraciones?: number): Promise<boolean> {
  if (!criptoDisponible() || !salBase64 || !hashEsperado) return false;
  const hash = await derivarHash(secreto, salBase64, iteraciones || PBKDF2_ITERACIONES);
  if (hash.length !== hashEsperado.length) return false;
  let diferencia = 0;
  for (let i = 0; i < hash.length; i++) diferencia |= hash.charCodeAt(i) ^ hashEsperado.charCodeAt(i);
  return diferencia === 0;
}
