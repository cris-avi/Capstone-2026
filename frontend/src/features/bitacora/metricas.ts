import type { RangoMetricas, Registro } from '../../types';

/**
 * Cálculos de la bitácora PIE (funciones puras).
 */

// Filtra los registros según el rango temporal seleccionado
export function filtrarRegistrosPorRango(registros: Registro[], rango: RangoMetricas, ahora: Date = new Date()): Registro[] {
  if (!rango || rango === 'historico') return registros;

  return registros.filter((r) => {
    const fecha = r.fechaHora ? new Date(r.fechaHora) : new Date();
    if (isNaN(fecha.getTime())) return true;

    if (rango === 'hoy') {
      return fecha.getFullYear() === ahora.getFullYear() &&
        fecha.getMonth() === ahora.getMonth() &&
        fecha.getDate() === ahora.getDate();
    }

    if (rango === 'semana') {
      // Semana actual escolar de lunes a domingo
      const diaSemana = ahora.getDay();
      const diffLunes = diaSemana === 0 ? -6 : 1 - diaSemana;
      const lunes = new Date(ahora.getFullYear(), ahora.getMonth(), ahora.getDate() + diffLunes, 0, 0, 0, 0);
      const domingo = new Date(lunes.getFullYear(), lunes.getMonth(), lunes.getDate() + 6, 23, 59, 59, 999);
      return fecha >= lunes && fecha <= domingo;
    }

    if (rango === 'mes') {
      return fecha.getFullYear() === ahora.getFullYear() && fecha.getMonth() === ahora.getMonth();
    }

    return true;
  });
}

export type NivelEmocional = 'verde' | 'amarillo' | 'rojo';

export function nivelEmocional(frase: string): NivelEmocional {
  if (frase.includes('Rojo') || frase.includes('ALERTA')) return 'rojo';
  if (frase.includes('Amarillo')) return 'amarillo';
  return 'verde';
}

const ETIQUETA_ESTADO: Record<NivelEmocional, string> = { verde: 'En Calma', amarillo: 'Inquieto', rojo: 'SOS / Alerta' };

function masFrecuente(conteos: Record<string, number>): string {
  let resultado = '-';
  let maximo = 0;
  for (const [clave, cantidad] of Object.entries(conteos)) {
    if (cantidad > maximo) {
      maximo = cantidad;
      resultado = `${clave} (${cantidad})`;
    }
  }
  return resultado;
}

export interface MetricasBitacora {
  comunicaciones: number;
  palabras: number;
  eventosEmocionales: number;
  terminoFrecuente: string;
}

export function calcularMetricas(registros: Registro[]): MetricasBitacora {
  const frases = registros.filter((r) => r.tipo === 'frase');
  const emociones = registros.filter((r) => r.tipo === 'termometro');

  let palabras = 0;
  const conteoPalabras: Record<string, number> = {};
  frases.forEach((f) => {
    palabras += f.palabrasCount || 0;
    (f.frase || '').split(' ').forEach((p) => {
      const palabra = p.trim().toUpperCase();
      if (palabra.length > 1) conteoPalabras[palabra] = (conteoPalabras[palabra] || 0) + 1;
    });
  });

  let terminoFrecuente = masFrecuente(conteoPalabras);

  // Si no hay palabras de frases en el rango, se informa el estado emocional predominante
  if (terminoFrecuente === '-' && emociones.length > 0) {
    const estados: Record<string, number> = {};
    emociones.forEach((e) => {
      const estado = ETIQUETA_ESTADO[nivelEmocional(e.frase)];
      estados[estado] = (estados[estado] || 0) + 1;
    });
    terminoFrecuente = masFrecuente(estados);
  }

  return { comunicaciones: frases.length, palabras, eventosEmocionales: emociones.length, terminoFrecuente };
}
