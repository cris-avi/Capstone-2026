import { useEffect, useState } from 'react';
import { APOYOS_RAPIDOS, NIVELES_TERMOMETRO, type NivelTermometro } from '../../config/calma';
import { cx } from '../../lib/cx';
import { useApp } from '../../store/app';
import { pedirApoyoRapido, registrarNivelTermometro } from './acciones';
import { RespiracionGuiada } from './RespiracionGuiada';

// Vista 3: zona calma / SOS (regulación sensorial y crisis)
export function VistaCalma() {
  const visible = useApp((s) => s.vista === 'calma');
  const [confirmacion, setConfirmacion] = useState<{ id: number; nivel: string } | null>(null);

  // Aviso visual breve de que el nivel quedó registrado
  useEffect(() => {
    if (!confirmacion) return;
    const temporizador = setTimeout(() => setConfirmacion(null), 2600);
    return () => clearTimeout(temporizador);
  }, [confirmacion]);

  function registrar(nivel: NivelTermometro) {
    registrarNivelTermometro(nivel);
    setConfirmacion({ id: Date.now(), nivel: nivel.id.toUpperCase() });
  }

  return (
    <section id="vista-calma" className={cx('space-y-6', !visible && 'hidden')} aria-label="Zona de calma y manejo de crisis">

      {/* Termómetro emocional interactivo de 3 niveles */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-sm border border-slate-200">
        <div className="text-center max-w-2xl mx-auto mb-5">
          <span className="text-xs uppercase tracking-widest font-black text-slate-400 block mb-1">Autorregulación Emocional</span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 flex items-center justify-center gap-2">
            <span>🌡️</span>
            <span>¿Cómo me siento en este momento?</span>
          </h2>
          <p className="text-sm text-slate-600 mt-1">
            Toca tu nivel de emoción. La plataforma avisará a la educadora y registrará la hora exacta en la bitácora.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 sm:gap-4">
          {NIVELES_TERMOMETRO.map((nivel) => (
            <button
              key={nivel.id}
              type="button"
              onClick={() => registrar(nivel)}
              className={cx(
                'group active:scale-[0.98] border-4 rounded-3xl p-4 sm:p-5 flex flex-col items-center text-center transition-all shadow-md hover:shadow-lg cursor-pointer',
                nivel.clases.tarjeta,
              )}
              aria-label={nivel.ariaLabel}
            >
              <div className="text-5xl sm:text-6xl mb-2 group-hover:scale-110 transition-transform">{nivel.emoji}</div>
              <span className={cx('text-white font-black text-base sm:text-lg px-3 py-1 rounded-full uppercase tracking-wide mb-2 shadow-xs', nivel.clases.etiqueta)}>
                {nivel.etiqueta}
              </span>
              <p className={cx('font-bold text-sm sm:text-base leading-tight', nivel.clases.cita)}>{nivel.cita}</p>
              <span className={cx('mt-3 text-xs font-semibold px-2.5 py-1 rounded-lg', nivel.clases.llamada)}>{nivel.llamada}</span>
            </button>
          ))}
        </div>
      </div>

      <RespiracionGuiada>
        {/* Atajos sensoriales rápidos */}
        <div className="mt-6 pt-5 border-t border-sky-200/80 w-full max-w-xl">
          <p className="text-xs font-bold text-slate-500 mb-2">Peticiones rápidas de apoyo:</p>
          <div className="flex flex-wrap items-center justify-center gap-2">
            {APOYOS_RAPIDOS.map(({ fraseVoz, titulo }) => (
              <button
                key={titulo}
                type="button"
                onClick={() => pedirApoyoRapido(fraseVoz, titulo)}
                className="bg-white hover:bg-sky-50 text-slate-700 text-xs font-bold px-3 py-2 rounded-xl border border-slate-200 shadow-xs cursor-pointer"
              >
                {titulo}
              </button>
            ))}
          </div>
        </div>
      </RespiracionGuiada>

      {confirmacion && (
        <div key={confirmacion.id} className="fixed bottom-5 right-5 bg-slate-900 text-white px-4 py-2.5 rounded-2xl shadow-xl z-50 text-xs font-bold anim-pop flex items-center gap-2" role="status">
          <span>{`✅ Registrado: ${confirmacion.nivel}`}</span>
        </div>
      )}
    </section>
  );
}
