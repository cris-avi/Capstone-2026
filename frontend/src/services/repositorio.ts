import type { Acceso, Estudiante, Pictograma, Registro, Sesion, Tarea, Usuario } from '../types';
import {
  STORAGE_KEY_ACCESOS, STORAGE_KEY_AGENDA, STORAGE_KEY_BITACORA, STORAGE_KEY_ESTUDIANTES,
  STORAGE_KEY_PICTOS_CUSTOM, STORAGE_KEY_SESION, STORAGE_KEY_USUARIOS,
} from '../config/constantes';
import { eliminarClave, escribirJSON, leerJSON } from '../lib/almacenamiento';
import { notificar } from '../store/ui';

/**
 * Persistencia tipada en LocalStorage.
 * Modo local: todo vive en este navegador; las claves y formatos son los mismos de la versión anterior.
 */

function guardar(clave: string, valor: unknown): boolean {
  const ok = escribirJSON(clave, valor);
  if (!ok) notificar('No se pudo guardar: el almacenamiento del navegador está lleno o bloqueado.', 'error');
  return ok;
}

const claveProfesional = (base: string, profesionalId: string) => `${base}__${profesionalId}`;
const claveEstudiante = (base: string, profesionalId: string, estudianteId: string) => `${base}__${profesionalId}__${estudianteId}`;

// Colección guardada por profesional (estudiantes, accesos)
function porProfesional<T>(base: string) {
  return {
    cargar: (profesionalId: string) => leerJSON<T[]>(claveProfesional(base, profesionalId), []),
    guardar: (profesionalId: string, valor: T[]) => guardar(claveProfesional(base, profesionalId), valor),
  };
}

// Colección guardada por estudiante (bitácora, agenda, fotos personalizadas)
function porEstudiante<T>(base: string) {
  return {
    cargar: (profesionalId: string, estudianteId: string) => leerJSON<T[] | null>(claveEstudiante(base, profesionalId, estudianteId), null),
    guardar: (profesionalId: string, estudianteId: string, valor: T[]) => guardar(claveEstudiante(base, profesionalId, estudianteId), valor),
  };
}

const DATOS_POR_ESTUDIANTE = [STORAGE_KEY_BITACORA, STORAGE_KEY_AGENDA, STORAGE_KEY_PICTOS_CUSTOM];

export const repositorio = {
  usuarios: {
    cargar: () => leerJSON<Usuario[]>(STORAGE_KEY_USUARIOS, []),
    guardar: (usuarios: Usuario[]) => guardar(STORAGE_KEY_USUARIOS, usuarios),
  },
  sesion: {
    cargar: () => leerJSON<Sesion | null>(STORAGE_KEY_SESION, null),
    guardar: (sesion: Sesion) => guardar(STORAGE_KEY_SESION, sesion),
    borrar: () => eliminarClave(STORAGE_KEY_SESION),
  },
  estudiantes: porProfesional<Estudiante>(STORAGE_KEY_ESTUDIANTES),
  accesos: porProfesional<Acceso>(STORAGE_KEY_ACCESOS),
  bitacora: porEstudiante<Registro>(STORAGE_KEY_BITACORA),
  agenda: porEstudiante<Tarea>(STORAGE_KEY_AGENDA),
  pictogramas: porEstudiante<Pictograma>(STORAGE_KEY_PICTOS_CUSTOM),

  borrarDatosEstudiante(profesionalId: string, estudianteId: string): void {
    DATOS_POR_ESTUDIANTE.forEach((base) => eliminarClave(claveEstudiante(base, profesionalId, estudianteId)));
  },
};
