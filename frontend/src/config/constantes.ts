/**
 * Configuración general del sistema.
 */

// Claves de almacenamiento en LocalStorage.
// Los datos de cada estudiante se guardan con el sufijo __<idProfesional>__<idEstudiante>
export const STORAGE_KEY_BITACORA = 'tea_yudo_bitacora_pie_v1';
export const STORAGE_KEY_AGENDA = 'tea_yudo_agenda_v1';
export const STORAGE_KEY_PICTOS_CUSTOM = 'tea_yudo_pictos_custom_v1';

// Cuentas profesionales, sesión, estudiantes (sufijo __<idProfesional>) y accesos
export const STORAGE_KEY_USUARIOS = 'tea_yudo_usuarios_v1';
export const STORAGE_KEY_SESION = 'tea_yudo_sesion_v1';
export const STORAGE_KEY_ESTUDIANTES = 'tea_yudo_estudiantes_v1';
export const STORAGE_KEY_ACCESOS = 'tea_yudo_accesos_v1';

export const PBKDF2_ITERACIONES = 150000;
export const SESION_INACTIVIDAD_MAX_MS = 12 * 60 * 60 * 1000; // Cierra la sesión del profesional tras 12 h sin uso
export const ACCESO_INACTIVIDAD_MAX_MS = 30 * 60 * 1000;      // Un acceso de estudiante sin actividad por 30 min se da por terminado
export const LATIDO_INTERVALO_MS = 20 * 1000;                 // Frecuencia máxima con que se guarda la última actividad
export const RELOJ_INTERVALO_MS = 30 * 1000;                  // Refresco de las duraciones visibles

export const PIN_LONGITUD = 4;
export const PIN_MAX_INTENTOS = 5;
export const PIN_BLOQUEO_MS = 30 * 1000;

export const NOTIFICACION_DURACION_MS = 4500;
export const MAX_FILAS_HISTORIAL_ACCESOS = 100;
