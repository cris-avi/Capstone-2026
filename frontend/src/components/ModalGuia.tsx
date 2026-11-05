import { Modal } from './Modal';

const PILARES = [
  {
    titulo: '1. Comunicador SAAC:',
    texto: 'Tablero aumentativo con clave de color Fitzgerald y pictogramas ARASAAC. Utiliza la Web Speech API para dar voz a las frases del niño.',
    clases: 'bg-emerald-50 border-emerald-200',
    claseTitulo: 'text-emerald-900',
  },
  {
    titulo: '2. Agenda Visual (Rutina):',
    texto: 'Anticipación estructurada de tareas escolares. Permite marcar logros con tachado visual y reforzamiento auditivo de éxito.',
    clases: 'bg-blue-50 border-blue-200',
    claseTitulo: 'text-blue-900',
  },
  {
    titulo: '3. Zona Calma / SOS:',
    texto: 'Termómetro interactivo de 3 estados y respiración guiada para prevenir o mitigar crisis sensoriales de forma oportuna.',
    clases: 'bg-amber-50 border-amber-200',
    claseTitulo: 'text-amber-900',
  },
  {
    titulo: '4. Bitácora PIE & Seguridad:',
    texto: 'Historial de interacciones de cada estudiante, protegido con el PIN personal del profesional para que el estudiante no modifique registros confidenciales.',
    clases: 'bg-slate-100 border-slate-300',
    claseTitulo: 'text-slate-900',
  },
  {
    titulo: '5. Estudiantes y Accesos:',
    texto: 'Cada profesional ingresa con su cuenta y gestiona a sus estudiantes. Al iniciar la sesión de un estudiante se registra su acceso (inicio, término, duración y actividad), visible en la pestaña Estudiantes.',
    clases: 'bg-indigo-50 border-indigo-200',
    claseTitulo: 'text-indigo-900',
  },
];

// Guía pedagógica y de uso de la plataforma
export function ModalGuia({ onCerrar }: { onCerrar: () => void }) {
  return (
    <Modal id="modal-guia" tituloId="modal-titulo" onCerrar={onCerrar} className="max-w-lg space-y-4 max-h-[90vh] overflow-y-auto">
      <div className="flex items-center justify-between border-b border-slate-200 pb-3">
        <h3 id="modal-titulo" className="text-xl font-black text-slate-900 flex items-center gap-2">
          <span>🧩</span>
          <span>Guía de Accesibilidad &amp; Plataforma TEA-yudo</span>
        </h3>
        <button type="button" onClick={onCerrar} className="p-1 rounded-xl text-slate-400 hover:text-slate-700 text-xl font-bold cursor-pointer" aria-label="Cerrar guía">
          ✕
        </button>
      </div>

      <div className="text-sm text-slate-600 space-y-3">
        <p>
          <strong>TEA-yudo</strong> integra los 4 pilares esenciales de inclusión en el aula escolar:
        </p>
        <div className="space-y-2 text-xs">
          {PILARES.map((pilar) => (
            <div key={pilar.titulo} className={`p-3 rounded-2xl border ${pilar.clases}`}>
              <strong className={`block text-sm mb-0.5 ${pilar.claseTitulo}`}>{pilar.titulo}</strong>
              {pilar.texto}
            </div>
          ))}
        </div>
      </div>

      <div className="pt-2 flex justify-end">
        <button type="button" onClick={onCerrar} className="bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm px-5 py-2.5 rounded-xl cursor-pointer">
          Entendido
        </button>
      </div>
    </Modal>
  );
}
