/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { DialogoConfirmacion } from './components/DialogoConfirmacion';
import { Encabezado } from './components/Encabezado';
import { ModalGuia } from './components/ModalGuia';
import { Notificaciones } from './components/Notificaciones';
import { PiePagina } from './components/PiePagina';
import { ModalPin } from './features/auth/ModalPin';
import { PantallaAuth } from './features/auth/PantallaAuth';
import { VistaAgenda } from './features/agenda/VistaAgenda';
import { VistaBitacora } from './features/bitacora/VistaBitacora';
import { VistaCalma } from './features/calma/VistaCalma';
import { VistaComunicador } from './features/comunicador/VistaComunicador';
import { VistaPanel } from './features/panel/VistaPanel';
import { useAtajosTeclado } from './hooks/useAtajosTeclado';
import { useRegistroActividad } from './hooks/useRegistroActividad';
import { sonido } from './services/sonido';
import { useApp } from './store/app';

export default function App() {
  const pantallaAuthVisible = useApp((s) => s.pantallaAuthVisible);
  const modalPinAbierto = useApp((s) => s.modalPin !== null);
  const [guiaAbierta, setGuiaAbierta] = useState(false);

  useAtajosTeclado();
  useRegistroActividad();

  function alternarGuia(abierta: boolean) {
    sonido.clic();
    setGuiaAbierta(abierta);
  }

  return (
    <>
      {/* Mientras se muestra el ingreso, el resto de la app no es interactivo */}
      <div className="min-h-screen flex flex-col" inert={pantallaAuthVisible}>
        <Encabezado onAbrirGuia={() => alternarGuia(true)} />

        {/* Las vistas permanecen montadas para conservar su estado (respiración, formularios) al cambiar de pestaña */}
        <main className="flex-1 max-w-7xl w-full mx-auto p-3 sm:p-5 lg:p-6">
          <VistaPanel />
          <VistaComunicador />
          <VistaAgenda />
          <VistaCalma />
          <VistaBitacora />
        </main>

        <PiePagina />
      </div>

      {modalPinAbierto && <ModalPin />}
      {guiaAbierta && <ModalGuia onCerrar={() => alternarGuia(false)} />}
      {pantallaAuthVisible && <PantallaAuth />}
      <DialogoConfirmacion />
      <Notificaciones />
    </>
  );
}
