export function generarId(prefijo: string): string {
  const aleatorio = window.crypto && crypto.randomUUID
    ? crypto.randomUUID()
    : Date.now().toString(36) + Math.random().toString(36).slice(2, 10);
  return `${prefijo}_${aleatorio}`;
}
