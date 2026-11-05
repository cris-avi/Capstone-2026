import type { FormEvent } from 'react';
import type { Estudiante } from '../../types';
import { AVATARES_ESTUDIANTE, GRADOS_ESCOLARES } from '../../config/estudiantes';
import { EncabezadoModal, Modal } from '../../components/Modal';
import { guardarEstudiante } from './acciones';

interface ModalEstudianteProps {
  estudiante: Estudiante | null; // null = nuevo estudiante
  onCerrar: () => void;
}

// Crear o editar un estudiante
export function ModalEstudiante({ estudiante, onCerrar }: ModalEstudianteProps) {
  // Conserva un curso antiguo escrito a mano que no esté en la lista
  const cursoActual = estudiante?.curso ?? '';
  const grados = cursoActual && !GRADOS_ESCOLARES.includes(cursoActual) ? [cursoActual, ...GRADOS_ESCOLARES] : GRADOS_ESCOLARES;
  const avatarActual = estudiante?.avatar ?? AVATARES_ESTUDIANTE[0];

  function enviar(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault();
    const datos = new FormData(evento.currentTarget);
    const guardado = guardarEstudiante({
      id: estudiante?.id ?? null,
      nombre: String(datos.get('nombre') ?? ''),
      curso: String(datos.get('curso') ?? '').trim(),
      avatar: String(datos.get('avatar') ?? AVATARES_ESTUDIANTE[0]),
    });
    if (guardado) onCerrar();
  }

  const opcionesGrado = (filtro: (g: string) => boolean) =>
    grados.filter(filtro).map((g) => <option key={g} value={g}>{g}</option>);

  return (
    <Modal id="modal-estudiante" tituloId="modal-estudiante-titulo" onCerrar={onCerrar} className="max-w-md space-y-4 max-h-[92vh] overflow-y-auto">
      <EncabezadoModal
        id="modal-estudiante-titulo"
        icono="🧒"
        titulo={estudiante ? 'Editar Estudiante' : 'Nuevo Estudiante'}
        tituloTextoId="modal-estudiante-titulo-texto"
        onCerrar={onCerrar}
      />

      <form id="form-estudiante" onSubmit={enviar} className="space-y-3.5">
        <div>
          <label htmlFor="input-estudiante-nombre" className="block text-xs font-bold text-slate-700 mb-1">Nombre del estudiante:</label>
          <input
            type="text"
            id="input-estudiante-nombre"
            name="nombre"
            required
            maxLength={40}
            autoFocus
            defaultValue={estudiante?.nombre ?? ''}
            placeholder="Ej: Mateo, Sofía R."
            className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:bg-white focus:border-blue-500"
          />
        </div>
        <div>
          <label htmlFor="input-estudiante-curso" className="block text-xs font-bold text-slate-700 mb-1">Grado:</label>
          <select
            id="input-estudiante-curso"
            name="curso"
            required
            defaultValue={cursoActual}
            className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-medium focus:bg-white focus:border-blue-500 cursor-pointer"
          >
            <option value="" disabled>Selecciona el grado</option>
            <optgroup label="Enseñanza Básica">{opcionesGrado((g) => !g.includes('Medio'))}</optgroup>
            <optgroup label="Enseñanza Media">{opcionesGrado((g) => g.includes('Medio'))}</optgroup>
          </select>
        </div>
        <fieldset>
          <legend className="block text-xs font-bold text-slate-700 mb-1.5">Avatar (lo verá el estudiante):</legend>
          <div id="selector-avatar-estudiante" className="grid grid-cols-6 gap-2">
            {AVATARES_ESTUDIANTE.map((avatar, i) => (
              <label key={avatar} className="cursor-pointer">
                <input type="radio" name="avatar" value={avatar} defaultChecked={avatar === avatarActual} className="sr-only peer" aria-label={`Avatar ${i + 1}`} />
                <span className="h-11 rounded-xl border-2 border-slate-200 bg-slate-50 flex items-center justify-center text-2xl select-none transition-all hover:bg-slate-100 peer-checked:border-emerald-500 peer-checked:bg-emerald-50 peer-checked:ring-2 peer-checked:ring-emerald-200 peer-focus-visible:outline peer-focus-visible:outline-4 peer-focus-visible:outline-blue-600">
                  {avatar}
                </span>
              </label>
            ))}
          </div>
        </fieldset>
        <div className="flex items-start gap-2 bg-amber-50 border border-amber-300 rounded-2xl p-3 text-xs text-amber-900" role="note">
          <span className="text-base leading-none" aria-hidden="true">ℹ️</span>
          <p>
            <strong>Importante:</strong> más adelante se solicitarán los datos del padre, madre o apoderado responsable del estudiante.
          </p>
        </div>
        <div className="pt-2 flex justify-end gap-2">
          <button type="button" onClick={onCerrar} className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-bold text-sm cursor-pointer">
            Cancelar
          </button>
          <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm px-5 py-2 rounded-xl shadow-xs cursor-pointer">
            Guardar
          </button>
        </div>
      </form>
    </Modal>
  );
}
