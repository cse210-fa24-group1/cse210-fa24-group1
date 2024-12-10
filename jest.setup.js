import { TextEncoder, TextDecoder } from 'util';
require('isomorphic-fetch');
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

// Add other necessary global polyfills
if (typeof window === 'undefined') {
  global.window = {
    addEventListener: () => {},
    localStorage: {
      getItem: () => null,
      setItem: () => {},
      removeItem: () => {},
    },
  };
}

// Polyfill for Event and CustomEvent
if (typeof Event !== 'function') {
  global.Event = class Event {
    constructor(name) {
      this.name = name;
    }
  };
}

if (typeof CustomEvent !== 'function') {
  global.CustomEvent = class CustomEvent {
    constructor(name, detail) {
      this.name = name;
      this.detail = detail;
    }
  };
}
