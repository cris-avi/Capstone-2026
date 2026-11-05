import { useRef, useState } from 'react';
import type { Estudiante, Usuario } from '../../types';
import { cx } from '../../lib/cx';
import { formatearDuracion, formatearHora, iniciales, pluralizar, primerNombre } from '../../lib/formato';
import { accesoActivo, useApp } from '../../store/app';
import { cerrarSesionProfesional } from '../auth/acciones';
import { duracionAccesoMs, estadisticasEstudiante } from '../sesion/accesos';
import { abrirModalPin, volverASesionEstudiante } from '../sesion/navegacion';
import { cambiarFiltroAccesos, terminarSesionEstudiante } from './acciones';
import { HistorialAccesos } from './HistorialAccesos';
import { ModalEstudiante } from './ModalEstudiante';
import { TarjetaEstudiante } from './TarjetaEstudiante';

// Estado bloqueado: el estudiante no puede entrar sin el PIN del profesional
function PanelBloqueado() {
  return (
    <div id="panel-bloqueado" className="bg-white rounded-3xl p-8 shadow-sm border border-slate-200 text-center space-y-3 max-w-lg mx-auto">
      <div className="w-14 h-14 rounded-2xl bg-amber-100 text-amber-800 text-3xl flex items-center justify-center mx-auto" aria-hidden="true">🔒</div>
      <h2 className="text-xl font-black text-slate-900">Área profesional bloqueada</h2>
      <p className="text-sm text-slate-600">Ingresa tu PIN para gestionar estudiantes y revisar su historial de accesos.</p>
      <button type="button" onClick={() => abrirModalPin('panel')} className="bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm px-5 py-2.5 rounded-xl cursor-pointer">
        Desbloquear con PIN
      </button>
    </div>
  );
}

function EncabezadoProfesional({ usuario, onNuevoEstudiante }: { usuario: Usuario; onNuevoEstudiante: () => void }) {
  return (
    <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-200 flex flex-wrap items-center justify-between gap-3">
      <div className="flex items-center gap-3">
        <div id="panel-iniciales-profesional" className="w-12 h-12 rounded-2xl bg-indigo-100 text-indigo-800 border border-indigo-300 flex items-center justify-center font-black text-lg select-none" aria-hidden="true">
          {iniciales(usuario.nombre) || '?'}
        </div>
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900">
            Hola, <span id="panel-nombre-profesional">{primerNombre(usuario.nombre)}</span>
          </h2>
          <p id="panel-cargo-profesional" className="text-sm text-slate-600">{`${usuario.cargo} · ${usuario.email}`}</p>
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-2 no-print">
        <button type="button" onClick={onNuevoEstudiante} className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm px-4 py-2.5 rounded-xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer">
          <span>➕</span>
          <span>Nuevo Estudiante</span>
        </button>
        <button type="button" onClick={cerrarSesionProfesional} className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-slate-300 transition-all flex items-center gap-1.5 cursor-pointer">
          <span>🚪</span>
          <span>Cerrar Sesión</span>
        </button>
      </div>
    </div>
  );
}

// Aviso de sesión de estudiante en curso
function AvisoSesionActiva() {
  const acceso = useApp(accesoActivo);
  const estudiantes = useApp((s) => s.estudiantes);
  useApp((s) => s.ahora);
  if (!acceso) return null;

  const est = estudiantes.find((e) => e.id === acceso.estudianteId);
  return (
    <div id="panel-sesion-activa" className="bg-emerald-50 border-2 border-emerald-300 rounded-3xl p-4 flex flex-wrap items-center justify-between gap-3">
      <div className="flex items-center gap-3">
        <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block animate-pulse" aria-hidden="true"></span>
        <div>
          <p id="panel-sesion-activa-texto" className="font-black text-emerald-900">{`${est ? `${est.avatar} ${est.nombre}` : 'Estudiante'} está en sesión`}</p>
          <p id="panel-sesion-activa-detalle" className="text-xs font-semibold text-emerald-800">
            {`Desde las ${formatearHora(acceso.inicio)} · ${formatearDuracion(duracionAccesoMs(acceso))}`}
          </p>
        </div>
      </div>
      <div className="flex flex-wrap gap-2">
        <button type="button" onClick={volverASesionEstudiante} className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm px-4 py-2 rounded-xl shadow-xs cursor-pointer">
          ▶️ Volver a la sesión
        </button>
        <button type="button" onClick={terminarSesionEstudiante} className="bg-white hover:bg-rose-50 text-rose-700 font-bold text-xs sm:text-sm px-4 py-2 rounded-xl border border-rose-200 cursor-pointer">
          ⏹️ Terminar sesión
        </button>
      </div>
    </div>
  );
}

interface ListaEstudiantesProps {
  onNuevo: () => void;
  onEditar: (estudiante: Estudiante) => void;
  onVerAccesos: (id: string) => void;
}

function ListaEstudiantes({ onNuevo, onEditar, onVerAccesos }: ListaEstudiantesProps) {
  const estudiantes = useApp((s) => s.estudiantes);
  const accesos = useApp((s) => s.accesos);
  const estudianteId = useApp((s) => s.estudianteId);
  const acceso = useApp(accesoActivo);
  useApp((s) => s.ahora);

  return (
    <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-200">
      <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
        <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <span>🧒</span>
          <span>Mis Estudiantes</span>
        </h3>
        <span id="panel-contador-estudiantes" className="text-xs font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-lg">
          {pluralizar(estudiantes.length, 'estudiante', 'estudiantes')}
        </span>
      </div>

      {estudiantes.length > 0 ? (
        <div id="lista-estudiantes" className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4">
          {estudiantes.map((est) => (
            <TarjetaEstudiante
              key={est.id}
              estudiante={est}
              estadisticas={estadisticasEstudiante(accesos, est.id)}
              enSesion={acceso?.estudianteId === est.id}
              seleccionado={estudianteId === est.id}
              onEditar={() => onEditar(est)}
              onVerAccesos={() => onVerAccesos(est.id)}
            />
          ))}
        </div>
      ) : (
        <div id="estudiantes-vacio" className="text-center py-10 space-y-2">
          <span className="text-4xl block" aria-hidden="true">🌱</span>
          <p className="font-bold text-slate-700">Aún no tienes estudiantes registrados</p>
          <p className="text-xs text-slate-500">Agrega a tu primer estudiante para comenzar a usar el comunicador y registrar sus accesos.</p>
          <button type="button" onClick={onNuevo} className="mt-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm px-5 py-2.5 rounded-xl shadow-xs cursor-pointer">
            ➕ Agregar estudiante
          </button>
        </div>
      )}
    </div>
  );
}

// Vista 0: panel del profesional (estudiantes e historial de accesos)
export function VistaPanel() {
  const visible = useApp((s) => s.vista === 'panel');
  const desbloqueado = useApp((s) => s.desbloqueado);
  const usuario = useApp((s) => s.usuario);
  // null = cerrado; { estudiante: null } = nuevo estudiante
  const [edicion, setEdicion] = useState<{ estudiante: Estudiante | null } | null>(null);
  const historialRef = useRef<HTMLDivElement>(null);

  function verAccesos(id: string) {
    cambiarFiltroAccesos(id);
    historialRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  return (
    <section id="vista-panel" className={cx('space-y-5', !visible && 'hidden')} aria-label="Panel del profesional: estudiantes y accesos">
      {!desbloqueado ? (
        <PanelBloqueado />
      ) : usuario && (
        <div id="panel-contenido" className="space-y-5">
          <EncabezadoProfesional usuario={usuario} onNuevoEstudiante={() => setEdicion({ estudiante: null })} />
          <AvisoSesionActiva />
          <ListaEstudiantes
            onNuevo={() => setEdicion({ estudiante: null })}
            onEditar={(estudiante) => setEdicion({ estudiante })}
            onVerAccesos={verAccesos}
          />
          <HistorialAccesos ref={historialRef} />
        </div>
      )}

      {edicion && <ModalEstudiante estudiante={edicion.estudiante} onCerrar={() => setEdicion(null)} />}
    </section>
  );
}
