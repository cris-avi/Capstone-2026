import { useMemo } from 'react';
import { useApp } from '../../store/app';
import { calcularMetricas, filtrarRegistrosPorRango } from './metricas';

// Tarjetas cuantitativas para el informe PIE según el rango temporal elegido
export function TarjetasMetricas() {
  const registros = useApp((s) => s.registros);
  const rango = useApp((s) => s.rangoMetricas);
  const metricas = useMemo(() => calcularMetricas(filtrarRegistrosPorRango(registros, rango)), [registros, rango]);

  const tarjetas = [
    { id: 'metrica-total', valor: metricas.comunicaciones, etiqueta: 'Comunicaciones SAAC', fondo: 'bg-emerald-50/70 border-emerald-200', valorClase: 'text-2xl sm:text-3xl text-emerald-800', etiquetaClase: 'text-emerald-700' },
    { id: 'metrica-palabras', valor: metricas.palabras, etiqueta: 'Palabras Totales', fondo: 'bg-blue-50/70 border-blue-200', valorClase: 'text-2xl sm:text-3xl text-blue-800', etiquetaClase: 'text-blue-700' },
    { id: 'metrica-crisis', valor: metricas.eventosEmocionales, etiqueta: 'Eventos Emocionales', fondo: 'bg-purple-50/70 border-purple-200', valorClase: 'text-2xl sm:text-3xl text-purple-800', etiquetaClase: 'text-purple-700' },
    { id: 'metrica-frecuente', valor: metricas.terminoFrecuente, etiqueta: 'Término Más Frecuente', fondo: 'bg-amber-50/70 border-amber-200', valorClase: 'text-sm sm:text-base text-amber-800 truncate', etiquetaClase: 'text-amber-700' },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4 pt-4 border-t border-slate-100">
      {tarjetas.map((t) => (
        <div key={t.id} className={`p-3 rounded-2xl border text-center ${t.fondo}`}>
          <div id={t.id} className={`font-black ${t.valorClase}`}>{t.valor}</div>
          <div className={`text-xs font-bold mt-0.5 ${t.etiquetaClase}`}>{t.etiqueta}</div>
        </div>
      ))}
    </div>
  );
}
