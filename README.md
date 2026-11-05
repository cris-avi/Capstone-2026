<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://ai.google.dev/static/site-assets/images/share-ais-513315318.png" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/b7d88625-a17a-4b8f-8d70-7ff4903ac001

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

## Arquitectura

React 19 + TypeScript + Tailwind CSS v4 (Vite). `index.html` solo contiene el `<head>` y el punto de montaje; toda la lógica vive en `src/`:

```
src/
├── main.tsx              # Arranque: restaura la sesión y monta <App />
├── App.tsx               # Layout: encabezado, vistas, modales globales y notificaciones
├── types.ts              # Tipos del dominio (mismas formas que los datos ya guardados)
├── config/               # Datos estáticos: pictogramas, rutina, niveles del termómetro, contextos PIE…
├── lib/                  # Utilidades puras sin React: cripto (PBKDF2), audio/voz, CSV, formato, imagen
├── store/                # Store reactivo mínimo (useSyncExternalStore) + toasts y confirmaciones
├── services/             # Persistencia tipada en LocalStorage (repositorio) y sonido
├── hooks/                # Atajos de teclado y registro de actividad
├── components/           # UI compartida: encabezado, pie, modal, notificaciones, guía
└── features/             # Una carpeta por funcionalidad: acciones (lógica) + componentes
    ├── auth/             # Ingreso, registro, cierre de sesión y PIN
    ├── sesion/           # Sesión persistente, accesos de estudiantes y navegación
    ├── panel/            # Estudiantes, sus sesiones e historial de accesos
    ├── comunicador/      # Tablero SAAC y fotos personalizadas
    ├── agenda/           # Rutina diaria
    ├── calma/            # Termómetro emocional, respiración y lluvia
    └── bitacora/         # Bitácora PIE, métricas y notas docentes
```

- Las **acciones** (`features/*/acciones.ts`) contienen la lógica y se pueden llamar desde cualquier lugar; los componentes solo leen el estado con `useApp(selector)` y llaman acciones.
- Para agregar una funcionalidad nueva: crea `src/features/<nombre>/` con su `acciones.ts` y su vista, y móntala en `App.tsx`.
- `public/extension-shield.js` se carga antes que la app para neutralizar errores de extensiones del navegador.

## Cuentas profesionales y estudiantes (modo local)

- **Profesional**: crea su cuenta con correo, contraseña y un PIN de 4 dígitos. La contraseña y el PIN se guardan con hash PBKDF2-SHA256 (Web Crypto), por lo que la app debe abrirse por HTTPS o `localhost` (AI Studio ya usa HTTPS).
- **Estudiantes**: no tienen cuenta. Cada profesional crea y gestiona a sus estudiantes desde la pestaña **Estudiantes**. Comunicador, agenda, fotos personalizadas y bitácora se guardan por separado para cada estudiante.
- **Accesos**: al pulsar **Iniciar sesión** en un estudiante se registra un acceso (inicio, término, duración y frases/emociones/rutinas realizadas) y el área profesional queda bloqueada con el PIN. El historial se puede exportar a CSV.
- **Limitación**: todo vive en el `localStorage` del navegador. Las cuentas y los datos solo existen en ese dispositivo, no se sincronizan y no hay recuperación de contraseña. Borrar los datos del navegador borra las cuentas.

## Casos de uso y videos de demostración

- [docs/casos-de-uso/README.md](docs/casos-de-uso/README.md): los 18 casos de uso, desde el login hasta cada función central, con pasos exactos, narración comercial sugerida, capturas de referencia y guiones de video.
- `npx playwright test`: 49 pruebas end-to-end ([tests/e2e/](tests/e2e)) que recorren esos mismos flujos con el Edge instalado.
