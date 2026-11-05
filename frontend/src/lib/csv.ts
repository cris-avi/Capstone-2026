/**
 * Exportación CSV compatible con Excel en español (separador ";" y BOM UTF-8).
 */

export type CeldaCSV = string | number | null | undefined;

// Los textos van entre comillas (escapando comillas internas); los números van tal cual
function formatearCelda(valor: CeldaCSV): string {
  if (typeof valor === 'number') return String(valor);
  return `"${String(valor ?? '').replace(/"/g, '""')}"`;
}

export function construirCSV(encabezados: string[], filas: CeldaCSV[][]): string {
  return [encabezados.join(';'), ...filas.map((fila) => fila.map(formatearCelda).join(';'))].join('\r\n');
}

export function descargarCSV(nombreArchivo: string, contenido: string): void {
  const blob = new Blob(['﻿' + contenido], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const enlace = document.createElement('a');
  enlace.href = url;
  enlace.download = nombreArchivo;
  document.body.appendChild(enlace);
  enlace.click();
  document.body.removeChild(enlace);
  URL.revokeObjectURL(url);
}
