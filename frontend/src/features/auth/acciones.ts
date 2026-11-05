import type { Usuario } from '../../types';
import { ACCESO_INACTIVIDAD_MAX_MS, PBKDF2_ITERACIONES, SESION_INACTIVIDAD_MAX_MS } from '../../config/constantes';
import { derivarHash, generarSal, verificarSecreto } from '../../lib/cripto';
import { primerNombre } from '../../lib/formato';
import { generarId } from '../../lib/ids';
import { repositorio } from '../../services/repositorio';
import { accesoActivo, appStore } from '../../store/app';
import { confirmar, notificar } from '../../store/ui';
import { cerrarAccesosHuerfanos, terminarAccesoActivo } from '../sesion/accesos';
import { navegarA } from '../sesion/navegacion';
import { cargarDatosEstudiante, guardarSesion } from '../sesion/sesion';

/**
 * Cuentas profesionales (modo local).
 * - El profesional tiene cuenta (correo + contraseña + PIN de 4 dígitos).
 * - Los estudiantes no tienen cuenta: pertenecen a un profesional.
 * Las funciones de ingreso devuelven el mensaje de error a mostrar ('' si no hay).
 */

const ESTADO_SIN_SESION = {
  usuario: null,
  estudiantes: [],
  accesos: [],
  estudianteId: null,
  accesoActivoId: null,
  desbloqueado: false,
};

function mostrarPantallaIngreso(): void {
  appStore.setState(ESTADO_SIN_SESION);
  cargarDatosEstudiante();
  appStore.setState({ pantallaAuthVisible: true });
}

export async function iniciarSesion(email: string, contrasena: string): Promise<string> {
  const correo = email.trim().toLowerCase();
  const usuario = repositorio.usuarios.cargar().find((u) => u.email === correo);
  const correcto = !!usuario && (await verificarSecreto(contrasena, usuario.passSal, usuario.passHash, usuario.iteraciones));
  if (!usuario || !correcto) return '❌ Correo o contraseña incorrectos.';
  entrarComoProfesional(usuario);
  return '';
}

export interface DatosRegistro {
  nombre: string;
  cargo: string;
  email: string;
  contrasena: string;
  contrasena2: string;
  pin: string;
}

export async function registrarCuenta(datos: DatosRegistro): Promise<string> {
  const nombre = datos.nombre.trim();
  const email = datos.email.trim().toLowerCase();
  const pin = datos.pin.trim();

  if (nombre.length < 2) return 'Ingresa tu nombre.';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return 'Ingresa un correo válido.';
  if (datos.contrasena.length < 8) return 'La contraseña debe tener al menos 8 caracteres.';
  if (datos.contrasena !== datos.contrasena2) return 'Las contraseñas no coinciden.';
  if (!/^\d{4}$/.test(pin)) return 'El PIN debe tener exactamente 4 números.';

  const usuarios = repositorio.usuarios.cargar();
  if (usuarios.some((u) => u.email === email)) return 'Ya existe una cuenta con ese correo en este dispositivo. Ingresa con ella.';

  const passSal = generarSal();
  const pinSal = generarSal();
  const usuario: Usuario = {
    id: generarId('pro'),
    nombre,
    cargo: datos.cargo,
    email,
    iteraciones: PBKDF2_ITERACIONES,
    passSal,
    passHash: await derivarHash(datos.contrasena, passSal, PBKDF2_ITERACIONES),
    pinSal,
    pinHash: await derivarHash(pin, pinSal, PBKDF2_ITERACIONES),
    creadoEn: new Date().toISOString(),
  };
  // Si el navegador rechaza la escritura ya se mostró una notificación
  if (!repositorio.usuarios.guardar([...usuarios, usuario])) return '';
  entrarComoProfesional(usuario);
  return '';
}

export function entrarComoProfesional(usuario: Usuario): void {
  const estudiantes = repositorio.estudiantes.cargar(usuario.id);
  appStore.setState({
    usuario,
    estudiantes,
    accesos: repositorio.accesos.cargar(usuario.id),
    // Si solo hay un estudiante, queda seleccionado para agilizar el trabajo
    estudianteId: estudiantes.length === 1 ? estudiantes[0].id : null,
    accesoActivoId: null,
    desbloqueado: true,
    pantallaAuthVisible: false,
  });
  cerrarAccesosHuerfanos();
  cargarDatosEstudiante();
  guardarSesion();

  navegarA('panel', { silencioso: true });
  notificar(`Hola, ${primerNombre(usuario.nombre)}. Sesión iniciada.`, 'exito');
}

export async function cerrarSesionProfesional(): Promise<void> {
  const ok = await confirmar({
    titulo: 'Cerrar sesión',
    mensaje: accesoActivo()
      ? 'Hay una sesión de estudiante en curso. Se dará por terminada y se cerrará tu cuenta en este dispositivo.'
      : '¿Deseas cerrar tu sesión en este dispositivo?',
    textoConfirmar: 'Cerrar sesión',
  });
  if (!ok) return;

  terminarAccesoActivo();
  repositorio.sesion.borrar();
  mostrarPantallaIngreso();
}

// Al recargar, la app siempre arranca bloqueada: si había un estudiante en sesión,
// se retoma su sesión; si no, se pide el PIN para entrar al panel.
export function restaurarSesion(): void {
  const sesion = repositorio.sesion.cargar();
  const usuario = sesion && repositorio.usuarios.cargar().find((u) => u.id === sesion.usuarioId);
  if (!sesion || !usuario) {
    mostrarPantallaIngreso();
    return;
  }

  const estudiantes = repositorio.estudiantes.cargar(usuario.id);
  const accesos = repositorio.accesos.cargar(usuario.id);

  if (Date.now() - (sesion.ultimaActividad || 0) > SESION_INACTIVIDAD_MAX_MS) {
    // Sesión vencida por inactividad: cerrar accesos pendientes y pedir ingreso
    appStore.setState({ usuario, estudiantes, accesos, accesoActivoId: null });
    cerrarAccesosHuerfanos();
    repositorio.sesion.borrar();
    mostrarPantallaIngreso();
    return;
  }

  const estudiante = estudiantes.find((e) => e.id === sesion.estudianteId) ?? null;
  const acceso = accesos.find((a) => a.id === sesion.accesoId && !a.fin);
  const accesoVigente = !!acceso && !!estudiante && acceso.estudianteId === estudiante.id &&
    Date.now() - new Date(acceso.ultimaActividad).getTime() <= ACCESO_INACTIVIDAD_MAX_MS;

  appStore.setState({
    usuario,
    estudiantes,
    accesos,
    estudianteId: estudiante ? estudiante.id : null,
    accesoActivoId: accesoVigente && acceso ? acceso.id : null,
    desbloqueado: false,
  });
  cerrarAccesosHuerfanos();
  cargarDatosEstudiante();
  guardarSesion();
  navegarA(accesoVigente ? 'nino' : 'panel', { silencioso: true });
}
