import { useMemo, type ReactNode } from 'react';
import type { Vista } from '../types';
import { cx } from '../lib/cx';
import { formatearDuracion } from '../lib/formato';
import { alternarSonido } from '../services/sonido';
import { accesoActivo, estudianteActual, useApp, vistasEstudianteDisponibles } from '../store/app';
import { progresoAgenda } from '../features/agenda/progreso';
import { duracionAccesoMs } from '../features/sesion/accesos';
import { intentarAccesoProfesional, navegarA } from '../features/sesion/navegacion';

const CLASE_PESTANA = 'flex items-center gap-1.5 px-3 sm:px-3.5 py-1.5 sm:py-2 rounded-xl font-bold text-xs sm:text-sm transition-all cursor-pointer';
const CLASE_ACTIVA = 'shadow-xs bg-white text-emerald-700 border border-slate-200';
const CLASE_INACTIVA = 'text-slate-600 hover:text-slate-900';

interface PestanaProps {
  vista: Vista;
  id: string;
  titulo: string;
  protegida?: boolean;
  visible: boolean;
  children: ReactNode;
}

function Pestana({ vista, id, titulo, protegida = false, visible, children }: PestanaProps) {
  const activa = useApp((s) => s.vista === vista);
  return (
    <button
      type="button"
      id={id}
      onClick={() => (protegida ? intentarAccesoProfesional(vista) : navegarA(vista))}
      className={cx(CLASE_PESTANA, activa ? CLASE_ACTIVA : CLASE_INACTIVA, !visible && 'hidden')}
      aria-pressed={activa}
      title={titulo}
    >
      {children}
    </button>
  );
}

// Estudiante activo y estado de su sesión de acceso
function ChipEstudiante() {
  const estudiante = useApp(estudianteActual);
  const acceso = useApp(accesoActivo);
  useApp((s) => s.ahora);
  if (!estudiante) return null;

  return (
    <div
      id="chip-estudiante"
      className={cx(
        'flex items-center gap-2 border rounded-2xl pl-1.5 pr-3 py-1',
        acceso ? 'bg-emerald-50 border-emerald-300' : 'bg-slate-50 border-slate-300',
      )}
      role="status"
      aria-live="polite"
    >
      <span id="chip-estudiante-avatar" className="w-8 h-8 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-lg select-none" aria-hidden="true">
        {estudiante.avatar}
      </span>
      <span className="leading-tight">
        <span id="chip-estudiante-nombre" className="block text-xs font-black text-slate-900 max-w-[120px] truncate">{estudiante.nombre}</span>
        <span id="chip-estudiante-estado" className={cx('block text-[11px] font-bold', acceso ? 'text-emerald-700' : 'text-slate-500')}>
          {acceso ? `En sesión · ${formatearDuracion(duracionAccesoMs(acceso))}` : 'Vista profesional'}
        </span>
      </span>
    </div>
  );
}

// Barra superior institucional y navegación entre vistas
export function Encabezado({ onAbrirGuia }: { onAbrirGuia: () => void }) {
  const hayUsuario = useApp((s) => !!s.usuario);
  const desbloqueado = useApp((s) => s.desbloqueado);
  const vistasEstudiante = useApp(vistasEstudianteDisponibles);
  const agenda = useApp((s) => s.agenda);
  const totalRegistros = useApp((s) => s.registros.length);
  const sonidoActivo = useApp((s) => s.sonidoActivo);

  const { terminadas, total } = useMemo(() => progresoAgenda(agenda), [agenda]);
  const candado = desbloqueado ? '🔓' : '🔒';

  return (
    <header className="bg-white border-b-2 border-slate-200 sticky top-0 z-40 shadow-xs no-print">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-2.5 flex flex-wrap items-center justify-between gap-3">

        {/* Identidad y marca del proyecto */}
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-2xl bg-amber-400 flex items-center justify-center text-2xl shadow-inner border border-amber-500 select-none" aria-hidden="true">
            🧩
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 leading-none">
                TEA<span className="text-emerald-600">-yudo</span>
              </h1>
              <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-2 py-0.5 rounded-full border border-emerald-300">
                Inclusión Escolar
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium hidden sm:block">
              Comunicador SAAC &bull; Agenda Visual &bull; Zona Calma &bull; Bitácora PIE
            </p>
          </div>
        </div>

        {/* Pestañas de navegación accesible (WCAG 2.2) */}
        <nav aria-label="Secciones de la plataforma" className="flex flex-wrap items-center bg-slate-100 p-1 rounded-2xl border border-slate-300 gap-1">
          <Pestana vista="panel" id="tab-panel" titulo="Panel del profesional: estudiantes e historial de accesos" protegida visible={hayUsuario}>
            <span id="icono-candado-panel">{candado}</span>
            <span>Estudiantes</span>
          </Pestana>
          <Pestana vista="nino" id="tab-nino" titulo="Comunicador con pictogramas ARASAAC" visible={vistasEstudiante}>
            <span>🗣️</span>
            <span>Comunicador</span>
          </Pestana>
          <Pestana vista="agenda" id="tab-agenda" titulo="Rutina diaria con lista de tareas visuales" visible={vistasEstudiante}>
            <span>📅</span>
            <span>Agenda</span>
            <span id="badge-agenda-header" className="bg-blue-600 text-white text-[11px] px-1.5 rounded-full font-bold">{`${terminadas}/${total}`}</span>
          </Pestana>
          <Pestana vista="calma" id="tab-calma" titulo="Termómetro emocional y respiración guiada para crisis" visible={vistasEstudiante}>
            <span>🧘</span>
            <span>Zona Calma</span>
          </Pestana>
          <Pestana vista="pie" id="tab-pie" titulo="Bitácora confidencial protegida por PIN para el equipo docente" protegida visible={vistasEstudiante}>
            <span id="icono-candado-tab">{candado}</span>
            <span>Bitácora PIE</span>
            <span id="badge-contador-header" className="bg-emerald-600 text-white text-[11px] px-1.5 rounded-full font-bold ml-0.5">{totalRegistros}</span>
          </Pestana>
        </nav>

        {/* Estudiante activo, sonido y ayuda */}
        <div className="flex items-center gap-1.5">
          <ChipEstudiante />

          <button
            type="button"
            id="btn-toggle-sonido"
            onClick={alternarSonido}
            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center gap-1 border border-slate-300 cursor-pointer"
            title="Activar o desactivar sonido táctil de clic"
          >
            <span id="icono-sonido">{sonidoActivo ? '🔊' : '🔇'}</span>
          </button>

          <button
            type="button"
            onClick={onAbrirGuia}
            className="p-2 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-900 font-bold text-xs flex items-center gap-1 border border-amber-300 cursor-pointer"
            title="Guía de uso pedagógico y atajos"
          >
            <span>💡</span>
            <span className="hidden md:inline text-xs">Ayuda</span>
          </button>
        </div>

      </div>
    </header>
  );
}
