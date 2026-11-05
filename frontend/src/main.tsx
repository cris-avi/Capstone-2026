import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import { restaurarSesion } from './features/auth/acciones';
import { iniciarVoces } from './lib/audio';
import { notificar } from './store/ui';
import './index.css';

// Reemplazo seguro de window.alert para cumplir restricciones de entorno y evitar bloqueos
window.alert = (mensaje?: unknown) => notificar(String(mensaje), 'advertencia');

iniciarVoces();

// Retoma la sesión del profesional (y la del estudiante en curso) o muestra el ingreso
restaurarSesion();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
