import { useApp } from '../store/app';

export function PiePagina() {
  const nombreProfesional = useApp((s) => s.usuario?.nombre);
  return (
    <footer className="bg-white border-t border-slate-200 py-3 px-4 text-center text-xs text-slate-500 no-print mt-auto">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
        <span>TEA-yudo Escolar &bull; Pictogramas ARASAAC (CC BY-NC-SA) &bull; Diseñado con Accesibilidad Cognitiva WCAG 2.2</span>
        <span id="footer-estado">
          {nombreProfesional ? `Modo local · Profesional: ${nombreProfesional}` : 'Almacenamiento Local Activo (LocalStorage)'}
        </span>
      </div>
    </footer>
  );
}
