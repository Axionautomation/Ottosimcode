// Local mock that resolves to the platform's native DOMException.
// This silences the npm deprecation warning of the legacy package.
const NativeDOMException = globalThis.DOMException || class DOMException extends Error {
  constructor(message, name) {
    super(message);
    this.name = name || 'DOMException';
  }
};

module.exports = NativeDOMException;
module.exports.default = NativeDOMException;
