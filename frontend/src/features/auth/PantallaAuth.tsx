import { useEffect, useRef, useState, type FormEvent } from 'react';
import { CARGOS_PROFESIONALES } from '../../config/estudiantes';
import { criptoDisponible } from '../../lib/cripto';
import { cx } from '../../lib/cx';
import { iniciarSesion, registrarCuenta } from './acciones';

type Pestana = 'login' | 'registro';

const CLASE_PESTANA_ACTIVA = 'bg-white text-slate-900 shadow-xs border border-slate-200';
const CLASE_PESTANA_INACTIVA = 'text-slate-500 hover:text-slate-800';
const CLASE_CAMPO = 'w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:bg-white focus:border-blue-500';
const CLASE_ETIQUETA = 'block text-xs font-bold text-slate-700 mb-1';

// Pantalla de ingreso / registro del profesional
export function PantallaAuth() {
  const [pestana, setPestana] = useState<Pestana>('login');
  const [errorLogin, setErrorLogin] = useState('');
  const [errorRegistro, setErrorRegistro] = useState('');
  const [enviando, setEnviando] = useState(false);
  const loginEmailRef = useRef<HTMLInputElement>(null);
  const registroNombreRef = useRef<HTMLInputElement>(null);
  const criptoOk = criptoDisponible();

  // Al elegir una pestaña (aunque ya esté activa) el foco va al primer campo del formulario
  const enfocarPrimerCampo = (p: Pestana) =>
    setTimeout(() => (p === 'login' ? loginEmailRef : registroNombreRef).current?.focus(), 50);

  useEffect(() => {
    const temporizador = enfocarPrimerCampo('login');
    return () => clearTimeout(temporizador);
  }, []);

  function cambiarPestana(p: Pestana) {
    setPestana(p);
    enfocarPrimerCampo(p);
  }

  async function enviar(evento: FormEvent<HTMLFormElement>, accion: (datos: FormData) => Promise<string>, setError: (e: string) => void) {
    evento.preventDefault();
    const datos = new FormData(evento.currentTarget);
    setError('');
    setEnviando(true);
    try {
      setError(await accion(datos));
    } finally {
      setEnviando(false);
    }
  }

  const campo = (datos: FormData, nombre: string) => String(datos.get(nombre) ?? '');

  const enviarLogin = (e: FormEvent<HTMLFormElement>) =>
    enviar(e, (d) => iniciarSesion(campo(d, 'email'), campo(d, 'contrasena')), setErrorLogin);

  const enviarRegistro = (e: FormEvent<HTMLFormElement>) =>
    enviar(e, (d) => registrarCuenta({
      nombre: campo(d, 'nombre'),
      cargo: campo(d, 'cargo'),
      email: campo(d, 'email'),
      contrasena: campo(d, 'contrasena'),
      contrasena2: campo(d, 'contrasena2'),
      pin: campo(d, 'pin'),
    }), setErrorRegistro);

  const botonEnvio = (texto: string, color: string) => (
    <button
      type="submit"
      disabled={!criptoOk || enviando}
      className={cx('w-full text-white font-black text-base py-3 rounded-2xl shadow-md transition-all cursor-pointer disabled:opacity-50 disabled:cursor-wait', color)}
    >
      {enviando ? 'Verificando...' : texto}
    </button>
  );

  return (
    <div id="pantalla-auth" className="fixed inset-0 z-[60] bg-linear-to-br from-amber-50 via-white to-emerald-50 overflow-y-auto no-print" role="dialog" aria-modal="true" aria-labelledby="auth-titulo">
      <div className="min-h-full flex items-center justify-center p-4 py-8">
        <div className="w-full max-w-md space-y-5">

          <div className="flex flex-col items-center text-center gap-2">
            <div className="w-14 h-14 rounded-2xl bg-amber-400 flex items-center justify-center text-3xl shadow-inner border border-amber-500 select-none" aria-hidden="true">🧩</div>
            <h2 id="auth-titulo" className="text-3xl font-black tracking-tight text-slate-900">
              TEA<span className="text-emerald-600">-yudo</span>
            </h2>
            <p className="text-sm text-slate-600">Acceso para profesionales PIE. Tus estudiantes usan la plataforma dentro de tu sesión.</p>
          </div>

          <div className="bg-white rounded-3xl shadow-xl border border-slate-200 p-6 space-y-5">

            {/* Pestañas Ingresar / Crear cuenta */}
            <div role="tablist" aria-label="Tipo de acceso" className="grid grid-cols-2 bg-slate-100 p-1 rounded-2xl border border-slate-200 gap-1">
              {([['login', 'Ingresar'], ['registro', 'Crear cuenta']] as const).map(([id, texto]) => (
                <button
                  key={id}
                  type="button"
                  role="tab"
                  id={`auth-tab-${id}`}
                  aria-controls={`form-${id}`}
                  aria-selected={pestana === id}
                  onClick={() => cambiarPestana(id)}
                  className={cx('py-2 rounded-xl font-bold text-sm cursor-pointer', pestana === id ? CLASE_PESTANA_ACTIVA : CLASE_PESTANA_INACTIVA)}
                >
                  {texto}
                </button>
              ))}
            </div>

            {!criptoOk && (
              <div id="auth-aviso-cripto" className="bg-rose-50 text-rose-900 border border-rose-300 rounded-2xl p-3 text-xs font-bold">
                ❌ Este navegador no permite cifrar contraseñas en esta dirección. Abre la app por HTTPS o desde localhost.
              </div>
            )}

            {pestana === 'login' ? (
              <form id="form-login" role="tabpanel" aria-labelledby="auth-tab-login" onSubmit={enviarLogin} className="space-y-3.5">
                <div>
                  <label htmlFor="login-email" className={CLASE_ETIQUETA}>Correo electrónico:</label>
                  <input ref={loginEmailRef} type="email" id="login-email" name="email" autoComplete="username" required className={CLASE_CAMPO} />
                </div>
                <div>
                  <label htmlFor="login-contrasena" className={CLASE_ETIQUETA}>Contraseña:</label>
                  <input type="password" id="login-contrasena" name="contrasena" autoComplete="current-password" required className={CLASE_CAMPO} />
                </div>
                <p id="login-error" className="text-xs font-bold text-rose-600 min-h-[16px]" role="alert">{errorLogin}</p>
                {botonEnvio('Ingresar', 'bg-emerald-600 hover:bg-emerald-700')}
              </form>
            ) : (
              <form id="form-registro" role="tabpanel" aria-labelledby="auth-tab-registro" onSubmit={enviarRegistro} className="space-y-3.5">
                <div>
                  <label htmlFor="registro-nombre" className={CLASE_ETIQUETA}>Nombre completo:</label>
                  <input ref={registroNombreRef} type="text" id="registro-nombre" name="nombre" autoComplete="name" required maxLength={60} className={CLASE_CAMPO} />
                </div>
                <div>
                  <label htmlFor="registro-cargo" className={CLASE_ETIQUETA}>Rol profesional:</label>
                  <select id="registro-cargo" name="cargo" className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-medium">
                    {CARGOS_PROFESIONALES.map((cargo) => <option key={cargo} value={cargo}>{cargo}</option>)}
                  </select>
                </div>
                <div>
                  <label htmlFor="registro-email" className={CLASE_ETIQUETA}>Correo electrónico:</label>
                  <input type="email" id="registro-email" name="email" autoComplete="username" required className={CLASE_CAMPO} />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label htmlFor="registro-contrasena" className={CLASE_ETIQUETA}>Contraseña:</label>
                    <input type="password" id="registro-contrasena" name="contrasena" autoComplete="new-password" required minLength={8} className={CLASE_CAMPO} />
                  </div>
                  <div>
                    <label htmlFor="registro-contrasena-2" className={CLASE_ETIQUETA}>Repetir contraseña:</label>
                    <input type="password" id="registro-contrasena-2" name="contrasena2" autoComplete="new-password" required minLength={8} className={CLASE_CAMPO} />
                  </div>
                </div>
                <div>
                  <label htmlFor="registro-pin" className={CLASE_ETIQUETA}>PIN de 4 dígitos para el área profesional:</label>
                  <input
                    type="password"
                    id="registro-pin"
                    name="pin"
                    inputMode="numeric"
                    pattern="[0-9]{4}"
                    maxLength={4}
                    autoComplete="off"
                    required
                    className="w-32 px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-lg font-black tracking-[0.4em] focus:bg-white focus:border-blue-500"
                  />
                  <p className="text-[11px] text-slate-400 mt-1">Lo usarás para desbloquear la bitácora y el panel cuando el estudiante esté usando el dispositivo.</p>
                </div>
                <p id="registro-error" className="text-xs font-bold text-rose-600 min-h-[16px]" role="alert">{errorRegistro}</p>
                {botonEnvio('Crear cuenta e ingresar', 'bg-blue-600 hover:bg-blue-700')}
              </form>
            )}
          </div>

          <p className="text-xs text-center text-slate-500 leading-relaxed">
            🔐 <strong>Modo local:</strong> tu cuenta y los datos de tus estudiantes se guardan solo en este dispositivo y navegador.
          </p>
        </div>
      </div>
    </div>
  );
}
