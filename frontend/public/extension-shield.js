/*
 * Escudo defensivo: intercepta y neutraliza colisiones de scripts inyectados por extensiones
 * del navegador (originalPrompt, etc.). Se carga de forma síncrona en <head>, antes de la app.
 */
(function() {
  function isExtensionCollision(msg) {
    if (!msg) return false;
    var s = String(msg);
    return s.indexOf('originalPrompt') !== -1 ||
           s.indexOf('originalAlert') !== -1 ||
           s.indexOf('originalConfirm') !== -1 ||
           (s.indexOf('already been declared') !== -1 && (s.indexOf('original') !== -1 || s.indexOf('Prompt') !== -1));
  }

  // 1. Interceptar a nivel de Event Listener en fase de captura
  window.addEventListener('error', function(e) {
    var msg = (e && e.message) || (e && e.error && e.error.message) || '';
    if (isExtensionCollision(msg)) {
      e.preventDefault();
      e.stopImmediatePropagation();
      return true;
    }
  }, true);

  // 2. Interceptar promesas no manejadas provocadas por scripts externos
  window.addEventListener('unhandledrejection', function(e) {
    var reason = e && (e.reason && (e.reason.message || e.reason));
    if (isExtensionCollision(reason)) {
      e.preventDefault();
      e.stopImmediatePropagation();
      return true;
    }
  }, true);

  // 3. Interceptar window.onerror antes de que librerías externas o iframes lo definan
  var _realOnError = null;
  try {
    Object.defineProperty(window, 'onerror', {
      get: function() { return _realOnError; },
      set: function(fn) {
        if (typeof fn === 'function') {
          _realOnError = function(message, source, lineno, colno, error) {
            if (isExtensionCollision(message) || (error && isExtensionCollision(error.message))) {
              return true; // Suprime el reporte del error
            }
            return fn.apply(this, arguments);
          };
        } else {
          _realOnError = fn;
        }
      },
      configurable: true,
      enumerable: true
    });
  } catch (err) {
    window.onerror = function(message, source, lineno, colno, error) {
      if (isExtensionCollision(message) || (error && isExtensionCollision(error.message))) {
        return true;
      }
    };
  }

  // 4. Interceptar console.error para no contaminar telemetría
  var _origConsoleError = console.error;
  console.error = function() {
    for (var i = 0; i < arguments.length; i++) {
      var arg = arguments[i];
      var str = (arg && (arg.message || arg.stack)) || String(arg);
      if (isExtensionCollision(str)) {
        return;
      }
    }
    return _origConsoleError.apply(console, arguments);
  };
})();
