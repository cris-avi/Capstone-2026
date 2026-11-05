// Termómetro emocional de 3 niveles: textos de la tarjeta, voz y registro en la bitácora
export interface NivelTermometro {
  id: 'verde' | 'amarillo' | 'rojo';
  emoji: string;
  etiqueta: string;
  cita: string;
  llamada: string;
  ariaLabel: string;
  fraseVoz: string;
  fraseBitacora: string;
  contexto: string;
  clases: { tarjeta: string; etiqueta: string; cita: string; llamada: string };
}

export const NIVELES_TERMOMETRO: NivelTermometro[] = [
  {
    id: 'verde',
    emoji: '😌',
    etiqueta: 'Verde: En Calma',
    cita: '"Me siento tranquilo y puedo seguir aprendiendo"',
    llamada: 'Toca para avisar 👍',
    ariaLabel: 'Nivel Verde: Me siento tranquilo y en calma',
    fraseVoz: 'Me siento tranquilo y en calma. Puedo continuar aprendiendo.',
    fraseBitacora: 'Termómetro Emocional: Nivel Verde (Tranquilo / En Calma)',
    contexto: 'Zona Calma',
    clases: {
      tarjeta: 'bg-green-50/90 hover:bg-green-100 border-green-500',
      etiqueta: 'bg-green-600',
      cita: 'text-green-950',
      llamada: 'text-green-800 bg-green-200/60',
    },
  },
  {
    id: 'amarillo',
    emoji: '😟',
    etiqueta: 'Amarillo: Inquieto',
    cita: '"Siento ruido o cansancio, necesito una pausa corta"',
    llamada: 'Pedir pausa ⏸️',
    ariaLabel: 'Nivel Amarillo: Me siento inquieto o cansado, necesito una pausa',
    fraseVoz: 'Me siento inquieto. Necesito una pausa corta o bajar el ruido.',
    fraseBitacora: 'Termómetro Emocional: Nivel Amarillo (Inquieto / Solicita pausa)',
    contexto: 'Zona Calma',
    clases: {
      tarjeta: 'bg-amber-50/90 hover:bg-amber-100 border-amber-500',
      etiqueta: 'bg-amber-500',
      cita: 'text-amber-950',
      llamada: 'text-amber-800 bg-amber-200/60',
    },
  },
  {
    id: 'rojo',
    emoji: '😫',
    etiqueta: 'Rojo: ¡Abrumado / SOS!',
    cita: '"¡Necesito ayuda urgente o ir al espacio de calma!"',
    llamada: 'Auxilio Inmediato 🆘',
    ariaLabel: 'Nivel Rojo: Me siento abrumado o en crisis, necesito ayuda urgente',
    fraseVoz: '¡Me siento muy abrumado! Necesito ayuda urgente o ir al espacio de calma.',
    fraseBitacora: 'ALERTA EMOCIONAL: Nivel Rojo (Abrumado / En Crisis - Auxilio Inmediato)',
    contexto: 'Zona Calma / SOS',
    clases: {
      tarjeta: 'bg-rose-50/90 hover:bg-rose-100 border-rose-500 animate-pulse hover:animate-none',
      etiqueta: 'bg-rose-600',
      cita: 'text-rose-950',
      llamada: 'text-rose-800 bg-rose-200/60',
    },
  },
];

export const APOYOS_RAPIDOS = [
  { fraseVoz: 'Necesito tapones para mis oídos por favor', titulo: '🎧 Pedir Tapones' },
  { fraseVoz: 'Necesito un vaso de agua por favor', titulo: '💧 Pedir Agua' },
  { fraseVoz: 'Necesito ir al rincón de la calma por favor', titulo: '🛋️ Rincón Calma' },
];

// Respiración guiada: Inhala (4 s), Sostén (2 s), Exhala (4 s)
export const FASES_RESPIRACION = [
  { texto: 'Inhala...', segundos: 4, escala: 'scale(1.25)', clases: 'from-emerald-400 to-teal-500 duration-4000' },
  { texto: 'Sostén el aire...', segundos: 2, escala: 'scale(1.25)', clases: 'from-teal-500 to-indigo-500 duration-2000' },
  { texto: 'Exhala despacio...', segundos: 4, escala: 'scale(0.8)', clases: 'from-indigo-500 to-blue-400 duration-4000' },
];
