/**
 * Tipos del dominio de TEA-yudo.
 * Las formas de los objetos coinciden con lo que ya está guardado en LocalStorage,
 * por lo que no deben cambiar sin una migración de datos.
 */

export type Vista = 'panel' | 'nino' | 'agenda' | 'calma' | 'pie';

export type CategoriaPictograma = 'esenciales' | 'personas' | 'acciones' | 'necesidades' | 'emociones';
export type FiltroCategoria = 'todas' | CategoriaPictograma;

export type TipoRegistro = 'frase' | 'nota' | 'termometro' | 'agenda';
export type FiltroTipoRegistro = 'todas' | TipoRegistro;
export type RangoMetricas = 'hoy' | 'semana' | 'mes' | 'historico';

export type TipoNotificacion = 'info' | 'exito' | 'advertencia' | 'error';

// Profesional con cuenta local (contraseña y PIN guardados como hash PBKDF2)
export interface Usuario {
  id: string;
  nombre: string;
  cargo: string;
  email: string;
  iteraciones: number;
  passSal: string;
  passHash: string;
  pinSal: string;
  pinHash: string;
  creadoEn: string;
}

export interface Estudiante {
  id: string;
  nombre: string;
  curso: string;
  avatar: string;
  creadoEn: string;
}

export type TipoInteraccion = 'frase' | 'termometro' | 'agenda';

// Cada vez que el profesional abre la sesión de un estudiante se registra un acceso
export interface Acceso {
  id: string;
  estudianteId: string;
  inicio: string;
  fin: string | null;
  ultimaActividad: string;
  interacciones: Record<TipoInteraccion, number>;
}

export interface Sesion {
  usuarioId: string;
  estudianteId: string | null;
  accesoId: string | null;
  ultimaActividad: number;
}

export interface EstilosCategoria {
  colorBorde: string;
  colorFondo: string;
  colorTexto: string;
  fallbackEmoji: string;
}

export interface Pictograma extends EstilosCategoria {
  id: string;
  texto: string;
  categoria: CategoriaPictograma;
  esencial: boolean;
  arasaacId?: number;
  imagenUrl?: string;
  esPersonalizado?: boolean;
  fechaCreacion?: string;
}

export interface Tarea {
  id: string;
  titulo: string;
  desc: string;
  icono: string;
  hora: string;
  terminada: boolean;
}

export interface Registro {
  id: string;
  estudianteId: string;
  profesionalId: string;
  fechaHora: string;
  fechaTexto: string;
  horaTexto: string;
  tipo: TipoRegistro;
  frase: string;
  palabrasCount: number;
  contexto: string;
  observacion: string;
  nivelApoyo: string;
  metaPaci: string;
}

export type NuevoRegistro = Pick<Registro, 'tipo'> &
  Partial<Pick<Registro, 'frase' | 'palabrasCount' | 'contexto' | 'observacion' | 'nivelApoyo' | 'metaPaci'>>;
