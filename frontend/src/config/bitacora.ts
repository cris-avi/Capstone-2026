import type { FiltroTipoRegistro, RangoMetricas } from '../types';

export const CONTEXTOS_ESCOLARES = [
  { valor: 'Colación', etiqueta: '🍎 Colación / Comedor' },
  { valor: 'Aula Común', etiqueta: '🏫 Aula Común' },
  { valor: 'Aula de Recursos', etiqueta: '🧩 Aula de Recursos PIE' },
  { valor: 'Recreo', etiqueta: '⚽ Recreo / Patio' },
  { valor: 'Zona Calma', etiqueta: '🧘 Zona de Calma / Crisis' },
  { valor: 'Fonoaudiología', etiqueta: '🗣️ Fonoaudiología' },
  { valor: 'Terapia Ocupacional', etiqueta: '🖐️ Terapia Ocupacional' },
  { valor: 'Llegada/Salida', etiqueta: '🎒 Llegada / Salida' },
];

// Rúbrica rápida del nivel de mediación (selección única)
export const NIVELES_MEDIACION = [
  {
    id: 'btn-nivel-autonomo',
    valor: 'Autónomo / Sin apoyo',
    punto: 'bg-emerald-500',
    claseInactiva: 'hover:bg-emerald-50/70',
    claseActiva: 'border-emerald-600 bg-emerald-50 text-emerald-950 ring-emerald-300',
  },
  {
    id: 'btn-nivel-verbal',
    valor: 'Apoyo verbal / Gestual',
    punto: 'bg-amber-400',
    claseInactiva: 'hover:bg-amber-50/70',
    claseActiva: 'border-amber-500 bg-amber-50 text-amber-950 ring-amber-300',
  },
  {
    id: 'btn-nivel-fisico',
    valor: 'Modelado físico / Asistido',
    punto: 'bg-orange-500',
    claseInactiva: 'hover:bg-orange-50/70',
    claseActiva: 'border-orange-500 bg-orange-50 text-orange-950 ring-orange-300',
  },
];

export const SUGERENCIAS_PACI = [
  'OA-03 Expresión de necesidades',
  'OA-01 Identificación de emociones y autorregulación',
  'OA-04 Transición y seguimiento de rutina escolar',
  'OA-02 Interacción comunicativa funcional con pares',
  'OA-05 Solicitud oportuna de ayuda sensorial',
  'OA-06 Autonomía en alimentación y hábitos',
];

// Atajos que completan texto, nivel de mediación y meta PACI de una sola vez
export const ATAJOS_NOTA = [
  { etiqueta: '+ Uso autónomo', texto: 'Uso autónomo sin instigación verbal', nivel: 'Autónomo / Sin apoyo', meta: 'OA-03 Expresión de necesidades' },
  { etiqueta: '+ Requiere modelado', texto: 'Requiere modelado previo de la docente', nivel: 'Modelado físico / Asistido', meta: 'OA-03 Expresión de necesidades' },
  { etiqueta: '+ Apoyo verbal', texto: 'Expresó necesidad básica con apoyo verbal', nivel: 'Apoyo verbal / Gestual', meta: 'OA-03 Expresión de necesidades' },
  { etiqueta: '+ Se autorreguló', texto: 'Logró autorregulación en zona de calma', nivel: 'Autónomo / Sin apoyo', meta: 'OA-01 Identificación de emociones y autorregulación' },
];

export const FILTROS_TABLA: { id: FiltroTipoRegistro; etiqueta: string }[] = [
  { id: 'todas', etiqueta: 'Todas' },
  { id: 'frase', etiqueta: '🗣️ SAAC' },
  { id: 'termometro', etiqueta: '🌡️ Emocional' },
  { id: 'agenda', etiqueta: '📅 Rutinas' },
  { id: 'nota', etiqueta: '📝 Notas' },
];

export const RANGOS_METRICAS: { id: RangoMetricas; etiqueta: string }[] = [
  { id: 'hoy', etiqueta: 'Hoy' },
  { id: 'semana', etiqueta: 'Esta Semana' },
  { id: 'mes', etiqueta: 'Este Mes' },
  { id: 'historico', etiqueta: 'Histórico Completo' },
];
