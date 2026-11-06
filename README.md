# Capstone # TEA-yudo

**Integrantes:** Rolando Fierro, Carlos Peña y Cristóbal Ávila  
**Institución:** Duoc UC, Sede San Joaquín  
**Carrera:** Ingeniería en Informática — Proyecto de Aplicación de Título (APT)  

Plataforma web de comunicación aumentativa (SAAC) y bitácora de seguimiento profesional para estudiantes con Trastorno del Espectro Autista (TEA) y equipos del Programa de Integración Escolar (PIE).

---

## Descripción del Proyecto

TEA-yudo es una plataforma web accesible diseñada para cerrar la brecha de herramientas digitales de apoyo e inclusión en la educación pública. Integra un comunicador dinámico basado en pictogramas (consumidos desde la API de ARASAAC) con un módulo clínico-pedagógico de bitácora escolar, agenda de rutinas diarias y zona de autorregulación emocional.

### ¿A quién va dirigido?
* **Estudiantes con TEA / NEE:** Usuarios directos del comunicador táctil asistido por voz y de la agenda visual de anticipación.
* **Equipos PIE y Docentes:** Educadoras diferenciales, psicopedagogos y fonoaudiólogos que registran observaciones de aula, gestionan tableros personalizados y exportan reportes de avance.
* **Apoderados:** Acceso de consulta para dar continuidad al progreso y las rutinas del estudiante en el hogar.

### Problemática que resuelve
Actualmente, los equipos de aula dependen de tableros físicos en papel o cuadernos de notas manuales no estandarizados, lo que genera pérdida de datos de interacción y sobrecarga administrativa. TEA-yudo centraliza la comunicación aumentativa y el registro profesional en una solución digital unificada, accesible y con tolerancia a desconexión de red.

---

## Tecnologías Utilizadas

| Categoría | Tecnología / Herramienta | Propósito en el Sistema |
| :--- | :--- | :--- |
| **Frontend** | HTML5, Tailwind CSS, JavaScript nativo (Vanilla JS) | Interfaz accesible, ligera y optimizada para dispositivos táctiles sin sobrecarga cognitiva. |
| **Accesibilidad / TTS** | Web Speech API (`SpeechSynthesis`) | Síntesis de voz en el navegador para la lectura auditiva inmediata de frases con pictogramas. |
| **Integración Externa** | API REST de ARASAAC | Catálogo público y estandarizado de pictogramas bajo licencia Creative Commons. |
| **Resiliencia / Caché** | Service Worker & Cache Storage | Caché de recursos gráficos para navegación fluida y tolerancia ante caídas de conexión. |
| **Persistencia Local** | IndexedDB / LocalStorage | Registro inmediato en el cliente, soporte sin conexión y encolamiento de eventos de bitácora. |
| **Base de Datos Central** | Microsoft SQL Server (12 tablas) | Persistencia relacional normalizada para usuarios, estudiantes, bitácoras y configuraciones. |
| **Diseño y Prototipado** | Figma, Balsamiq (WCAG 2.1) | Mockups de alta fidelidad con contrastes validados para accesibilidad cognitiva. |
| **Modelado Técnico** | UML 2.5 (Casos de Uso y Secuencia) + DER | Formalización arquitectónica con flujos paralelos (`par`) y alternativos (`alt`) de red. |
| **Gestión de Proyecto** | Metodología Scrum en Jira | Planificación iterativa en sprints de 2 semanas, gestión de backlog y criterios de aceptación. |
| **Normativa Legal** | Ley 19.628 y Decreto 170 | Protección de datos sensibles de menores y estándares de educación especial en Chile. |

---

## Estructura del Repositorio

```text
tea-yudo/
├── docs/                       # Especificaciones funcionales, DER, modelo relacional y diagramas UML
│   ├── casos_de_uso_uml.png    # Diagrama formal de Casos de Uso
│   └── secuencia_bitacora.png  # Diagrama formal de Secuencia (persistencia y Web Speech API)
├── src/
│   ├── assets/                 # Iconografía, recursos multimedia y pictogramas locales
│   ├── css/                    # Hojas de estilo y configuración Tailwind CSS
│   ├── js/
│   │   ├── app.js              # Controlador principal del comunicador SAAC y eventos de UI
│   │   ├── tts.js              # Módulo de síntesis de voz (Web Speech API)
│   │   └── bitacora.js         # Lógica de registro local (IndexedDB) y sincronización API
│   ├── sw.js                   # Service Worker para manejo de caché offline
│   └── index.html              # Vistas integradas (Comunicador, Rutinas, Crisis y Bitácora)
├── tea_yudo_sqlserver.sql      # Script DDL de creación de la base de datos (12 tablas)
├── tea_yudo_sqlserver_drop.sql # Script para rollback/limpieza de base de datos
└── README.md                   # Documentación principal del proyecto

