/**
 * Formateo de fechas, duraciones y textos (configuración regional es-CL).
 */

export function formatearDuracion(ms: number): string {
  const minutos = Math.floor(ms / 60000);
  if (minutos < 1) return '< 1 min';
  if (minutos < 60) return `${minutos} min`;
  const horas = Math.floor(minutos / 60);
  return `${horas} h ${String(minutos % 60).padStart(2, '0')} min`;
}

export function formatearHora(iso: string): string {
  return new Date(iso).toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit' });
}

export function formatearFecha(iso: string): string {
  return new Date(iso).toLocaleDateString('es-CL');
}

export function formatearTiempoRelativo(iso: string | null, ahora: number = Date.now()): string {
  if (!iso) return 'Nunca';
  const fecha = new Date(iso);
  const minutos = Math.floor((ahora - fecha.getTime()) / 60000);
  if (minutos < 1) return 'Ahora';
  if (minutos < 60) return `Hace ${minutos} min`;
  const horas = Math.floor(minutos / 60);
  if (horas < 24) return `Hace ${horas} h`;
  const dias = Math.floor(horas / 24);
  if (dias === 1) return 'Ayer';
  if (dias < 7) return `Hace ${dias} días`;
  return fecha.toLocaleDateString('es-CL');
}

// Fecha AAAA-MM-DD para nombres de archivo
export function fechaParaArchivo(fecha: Date = new Date()): string {
  return fecha.toISOString().slice(0, 10);
}

export function nombreParaArchivo(texto: string): string {
  return (texto || 'estudiante')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-zA-Z0-9]+/g, '_')
    .replace(/^_|_$/g, '') || 'estudiante';
}

export function primerNombre(nombre: string): string {
  return nombre.split(' ')[0];
}

export function iniciales(nombre: string): string {
  return nombre.split(/\s+/).filter(Boolean).slice(0, 2).map((p) => p[0].toUpperCase()).join('');
}

export function pluralizar(cantidad: number, singular: string, plural: string): string {
  return `${cantidad} ${cantidad === 1 ? singular : plural}`;
}
