declare module 'bezier-js';

declare namespace svelte.JSX {
  interface HTMLProps<T> {
    onoutclick: (e: CustomEvent) => void;
    oninsideclick: (e: CustomEvent) => void;
  }
}
