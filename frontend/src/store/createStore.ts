import { useSyncExternalStore } from 'react';

/**
 * Store mínimo: las acciones viven fuera de React (se pueden llamar desde cualquier módulo)
 * y los componentes se suscriben solo a la porción del estado que leen.
 */
export interface Store<T> {
  getState: () => T;
  setState: (cambio: Partial<T> | ((estado: T) => Partial<T>)) => void;
  subscribe: (oyente: () => void) => () => void;
}

export function createStore<T extends object>(inicial: T): Store<T> {
  let estado = inicial;
  const oyentes = new Set<() => void>();

  return {
    getState: () => estado,
    setState(cambio) {
      const parcial = typeof cambio === 'function' ? cambio(estado) : cambio;
      estado = { ...estado, ...parcial };
      oyentes.forEach((oyente) => oyente());
    },
    subscribe(oyente) {
      oyentes.add(oyente);
      return () => oyentes.delete(oyente);
    },
  };
}

// El selector debe devolver un valor estable (un campo del estado o un primitivo), no un objeto nuevo en cada llamada
export function useStore<T, S>(store: Store<T>, selector: (estado: T) => S): S {
  return useSyncExternalStore(store.subscribe, () => selector(store.getState()));
}
