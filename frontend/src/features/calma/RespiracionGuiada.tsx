import { useEffect, useState, type ReactNode } from 'react';
import { FASES_RESPIRACION } from '../../config/calma';
import { cx } from '../../lib/cx';
import { sonido } from '../../services/sonido';
import { useApp } from '../../store/app';
import { alternarLluvia } from './acciones';

interface EstadoRespiracion {
  activa: boolean;
  iniciada: boolean;
  fase: number;
  segundos: number;
}

const INICIAL: EstadoRespiracion = { activa: false, iniciada: false, fase: 0, segundos: FASES_RESPIRACION[0].segundos };

// Cada segundo descuenta la fase actual y, al llegar a cero, pasa a la siguiente
function avanzar(estado: EstadoRespiracion): EstadoRespiracion {
  if (estado.segundos > 0) return { ...estado, segundos: estado.segundos - 1 };
  const fase = (estado.fase + 1) % FASES_RESPIRACION.length;
  return { ...estado, fase, segundos: FASES_RESPIRACION[fase].segundos };
}

// Respiración guiada para desescalada y regulación sensorial
export function RespiracionGuiada({ children }: { children?: ReactNode }) {
  const [estado, setEstado] = useState(INICIAL);
  const lluviaActiva = useApp((s) => s.lluviaActiva);

  useEffect(() => {
    if (!estado.activa) return;
    const temporizador = setInterval(() => setEstado(avanzar), 1000);
    return () => clearInterval(temporizador);
  }, [estado.activa]);

  function alternar() {
    sonido.clic();
    setEstado((e) => (e.activa ? { ...e, activa: false } : { ...INICIAL, activa: true, iniciada: true }));
  }

  const fase = FASES_RESPIRACION[estado.fase];
  let textoFase = 'Listo';
  let textoSegundos = 'Presiona Iniciar';
  let escala: string | undefined;
  let clasesCirculo = 'from-cyan-400 to-blue-500 duration-1000';
  if (estado.activa) {
    textoFase = fase.texto;
    textoSegundos = `${estado.segundos} segundos`;
    escala = fase.escala;
    clasesCirculo = fase.clases;
  } else if (estado.iniciada) {
    textoFase = 'Pausado';
    textoSegundos = 'Respira a tu ritmo';
    escala = 'scale(1)';
    clasesCirculo = fase.clases;
  }

  return (
    <div className="bg-linear-to-b from-sky-50 to-indigo-50/60 rounded-3xl p-6 sm:p-8 shadow-sm border border-sky-200 flex flex-col items-center text-center relative overflow-hidden">
      <div className="max-w-md">
        <span className="text-xs uppercase tracking-widest font-black text-indigo-700 bg-indigo-100 px-3 py-1 rounded-full border border-indigo-200 inline-block mb-2">
          Regulación del Sistema Nervioso
        </span>
        <h3 className="text-2xl font-black text-slate-900">Respiración Guiada con el Círculo</h3>
        <p className="text-xs sm:text-sm text-slate-600 mt-1">
          Sigue el movimiento suave del círculo: inhala mientras crece y exhala despacio cuando se achica.
        </p>
      </div>

      {/* Visualizador del círculo de respiración */}
      <div className="py-10 flex flex-col items-center justify-center relative my-2">
        <div
          id="circulo-respirar"
          style={{ transform: escala }}
          className={cx('w-48 h-48 sm:w-56 sm:h-56 rounded-full bg-linear-to-tr flex flex-col items-center justify-center text-white shadow-xl transition-all border-4 border-white', clasesCirculo)}
          aria-live="polite"
        >
          <span id="icono-respirar" className="text-3xl mb-1">🌬️</span>
          <span id="texto-fase-respirar" className="font-black text-lg sm:text-xl tracking-wide uppercase">{textoFase}</span>
          <span id="segundos-respirar" className="text-xs opacity-90 font-bold mt-0.5">{textoSegundos}</span>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-3 mt-2">
        <button
          type="button"
          id="btn-iniciar-respirar"
          onClick={alternar}
          className="bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white font-black text-sm sm:text-base px-6 py-3 rounded-2xl shadow-md transition-all flex items-center gap-2 cursor-pointer"
        >
          <span id="icono-btn-respirar">{estado.activa ? '⏸️' : '▶️'}</span>
          <span id="texto-btn-respirar">{estado.activa ? 'Pausar Respiración' : 'Iniciar Respiración'}</span>
        </button>

        <button
          type="button"
          id="btn-sonido-blanco"
          onClick={alternarLluvia}
          className="bg-white hover:bg-slate-100 text-indigo-900 font-bold text-sm px-4 py-3 rounded-2xl border border-indigo-200 shadow-xs transition-all flex items-center gap-2 cursor-pointer"
          title="Reproducir sonido suave de lluvia para aislar ruidos molestos"
        >
          <span id="icono-lluvia">{lluviaActiva ? '⏹️' : '🌧️'}</span>
          <span id="texto-lluvia">{lluviaActiva ? 'Detener Lluvia' : 'Sonido Lluvia Suave'}</span>
        </button>
      </div>

      {children}
    </div>
  );
}
