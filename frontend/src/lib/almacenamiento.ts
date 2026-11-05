/**
 * Acceso seguro a LocalStorage: nunca lanza excepciones (modo privado, cuota llena, datos corruptos).
 */

export function leerJSON<T>(clave: string, porDefecto: T): T {
  try {
    const valor = localStorage.getItem(clave);
    return valor ? (JSON.parse(valor) as T) : porDefecto;
  } catch (e) {
    return porDefecto;
  }
}

// Retorna false si el navegador rechazó la escritura
export function escribirJSON(clave: string, valor: unknown): boolean {
  try {
    localStorage.setItem(clave, JSON.stringify(valor));
    return true;
  } catch (e) {
    return false;
  }
}

export function eliminarClave(clave: string): void {
  try {
    localStorage.removeItem(clave);
  } catch (e) {}
}
