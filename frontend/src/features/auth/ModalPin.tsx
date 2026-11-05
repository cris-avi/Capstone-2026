import { useEffect, useRef, useState, type FormEvent } from 'react';
import { PIN_LONGITUD } from '../../config/constantes';
import { cx } from '../../lib/cx';
import { primerNombre } from '../../lib/formato';
import { sonido } from '../../services/sonido';
import { useApp } from '../../store/app';
import { Modal } from '../../components/Modal';
import { cerrarModalPin } from '../sesion/navegacion';
import { segundosBloqueoPin, verificarContrasena, verificarPin } from './pin';

const DIGITOS = ['1', '2', '3', '4', '5', '6', '7', '8', '9'];
const CLASE_TECLA = 'h-12 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-900 font-black text-lg border border-slate-200 cursor-pointer active:scale-95';

const mensajeBloqueo = (segundos: number) => `⏳ Demasiados intentos. Espera ${segundos} s o usa tu contraseña.`;

// Control de acceso con el PIN personal del profesional
export function ModalPin() {
  const usuario = useApp((s) => s.usuario);
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const [usarContrasena, setUsarContrasena] = useState(false);
  const pinRef = useRef('');
  const contrasenaRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (usarContrasena) contrasenaRef.current?.focus();
  }, [usarContrasena]);

  if (!usuario) return null;

  function actualizarPin(valor: string) {
    pinRef.current = valor;
    setPin(valor);
  }

  function estaBloqueado(): boolean {
    const segundos = segundosBloqueoPin();
    if (segundos > 0) setError(mensajeBloqueo(segundos));
    return segundos > 0;
  }

  async function comprobar(valor: string) {
    const resultado = await verificarPin(valor);
    if (resultado === 'ok') return;
    setError(resultado === 'bloqueado' ? mensajeBloqueo(segundosBloqueoPin()) : '❌ PIN incorrecto. Intenta de nuevo.');
    actualizarPin('');
  }

  function ingresarDigito(digito: string) {
    if (estaBloqueado() || pinRef.current.length >= PIN_LONGITUD) return;
    sonido.clic();
    const valor = pinRef.current + digito;
    actualizarPin(valor);
    // Al completar los 4 dígitos se verifica automáticamente
    if (valor.length === PIN_LONGITUD) setTimeout(() => comprobar(valor), 150);
  }

  function borrarDigito() {
    if (pinRef.current.length === 0) return;
    sonido.clic();
    actualizarPin(pinRef.current.slice(0, -1));
    setError('');
  }

  function limpiar() {
    sonido.clic();
    actualizarPin('');
    setError('');
  }

  async function enviarContrasena(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault();
    const input = contrasenaRef.current;
    if (!input) return;
    const valor = input.value;
    input.value = '';
    if (!(await verificarContrasena(valor))) setError('❌ Contraseña incorrecta.');
  }

  return (
    <Modal id="modal-pin-pie" tituloId="pin-titulo" fondo="bg-slate-900/65" className="max-w-sm text-center space-y-4" onCerrar={cerrarModalPin}>
      <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-800 text-2xl flex items-center justify-center mx-auto">
        🔒
      </div>

      <div>
        <h3 id="pin-titulo" className="text-lg font-black text-slate-900">
          Acceso Exclusivo Profesional PIE
        </h3>
        <p className="text-xs text-slate-500 mt-1">
          <span id="pin-nombre-profesional" className="font-bold text-slate-700">{`${primerNombre(usuario.nombre)},`}</span>
          {' '}ingresa tu PIN de 4 dígitos para acceder al área profesional confidencial.
        </p>
      </div>

      {/* Visualización de los dígitos ingresados */}
      <div className="flex items-center justify-center gap-3 py-2" aria-label={`${pin.length} de ${PIN_LONGITUD} dígitos`}>
        {Array.from({ length: PIN_LONGITUD }, (_, i) => (
          <div
            key={i}
            id={`pin-dot-${i + 1}`}
            className={cx(
              'w-4 h-4 rounded-full border-2 transition-all',
              i < pin.length ? 'border-amber-500 bg-amber-500 scale-110' : 'border-slate-400 bg-transparent',
            )}
          />
        ))}
      </div>

      <div id="pin-mensaje-error" className="text-xs font-bold text-rose-600 min-h-[16px]" role="alert">{error}</div>

      {/* Teclado numérico accesible */}
      <div className="grid grid-cols-3 gap-2 pt-1 max-w-[240px] mx-auto">
        {DIGITOS.map((d) => (
          <button key={d} type="button" onClick={() => ingresarDigito(d)} className={CLASE_TECLA}>{d}</button>
        ))}
        <button type="button" onClick={limpiar} className="h-12 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs border border-rose-200 cursor-pointer active:scale-95">Limpiar</button>
        <button type="button" onClick={() => ingresarDigito('0')} className={CLASE_TECLA}>0</button>
        <button type="button" onClick={borrarDigito} className="h-12 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 font-black text-base cursor-pointer active:scale-95" aria-label="Borrar dígito">⌫</button>
      </div>

      {/* Alternativa: desbloquear con la contraseña de la cuenta */}
      {usarContrasena && (
        <form id="form-pin-contrasena" onSubmit={enviarContrasena} className="space-y-2 text-left">
          <label htmlFor="input-pin-contrasena" className="block text-xs font-bold text-slate-700">Contraseña de tu cuenta:</label>
          <div className="flex gap-2">
            <input
              ref={contrasenaRef}
              type="password"
              id="input-pin-contrasena"
              autoComplete="current-password"
              required
              className="flex-1 min-w-0 px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:bg-white focus:border-blue-500"
            />
            <button type="submit" className="bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs px-3.5 py-2 rounded-xl cursor-pointer">
              Entrar
            </button>
          </div>
        </form>
      )}

      <div className="pt-2 flex items-center justify-between gap-2 text-xs text-slate-400">
        {!usarContrasena && (
          <button id="btn-pin-usar-contrasena" type="button" onClick={() => setUsarContrasena(true)} className="text-slate-500 hover:text-slate-800 font-semibold underline cursor-pointer">
            ¿Olvidaste el PIN? Usa tu contraseña
          </button>
        )}
        <button type="button" onClick={cerrarModalPin} className="ml-auto text-slate-600 hover:text-slate-900 font-bold underline cursor-pointer">
          Cancelar
        </button>
      </div>
    </Modal>
  );
}
