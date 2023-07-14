declare module 'bezier-js';

declare namespace svelteHTML {
  interface HTMLAttributes<T> {
    'on:outclick'?: (e: CustomEvent) => void;
    'on:insideclick'?: (e: CustomEvent) => void;
  }
}
