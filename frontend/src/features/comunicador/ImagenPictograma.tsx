import { useState } from 'react';
import type { Pictograma } from '../../types';
import { urlImagenPictograma } from '../../config/pictogramas';

interface ImagenPictogramaProps {
  picto: Pictograma;
  className: string;
  claseEmoji: string;
  diferida?: boolean;
}

// Imagen ARASAAC o foto real; si no carga (sin conexión) se muestra el emoji de respaldo
export function ImagenPictograma({ picto, className, claseEmoji, diferida = false }: ImagenPictogramaProps) {
  const src = urlImagenPictograma(picto);
  const [srcFallido, setSrcFallido] = useState<string | null>(null);

  if (!src || srcFallido === src) {
    return <span className={claseEmoji}>{picto.fallbackEmoji || '📸'}</span>;
  }
  return (
    <img
      src={src}
      alt={picto.texto}
      loading={diferida ? 'lazy' : undefined}
      className={className}
      onError={() => setSrcFallido(src)}
    />
  );
}
