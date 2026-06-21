// Robust environment shim for React 19 / SDK 54
(function() {
  const env = { NODE_ENV: 'development' };

  // Basic process shim
  if (typeof global !== 'undefined' && typeof global.process === 'undefined') {
    global.process = { env: env };
  }

  if (typeof window !== 'undefined' && typeof window.process === 'undefined') {
    window.process = { env: env };
  }

  if (typeof process === 'undefined') {
    try {
        Object.defineProperty(globalThis, 'process', {
            value: { env: env },
            writable: true,
            enumerable: true,
            configurable: true
        });
    } catch (e) {
        // Fallback for environments that don't allow defining on globalThis
        globalThis.process = { env: env };
    }
  }
})();
