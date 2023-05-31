import { Writable, writable } from 'svelte/store';
import { ShapeConfig } from '../Canvas/CanvasModel';

export class MoveableModel {
  config: Writable<ShapeConfig | null> = writable(null);
  #ROUND = 2;

  constructor(attributes: ShapeConfig) {
    this.config.set(attributes);
  }

  move(e: MouseEvent): void {
    this.config.update((value) => ({
      ...value,
      x: value.x + e.movementX,
      y: value.y + e.movementY,
    }));
  }

  resize(e: MouseEvent, rect: DOMRect): void {
    const width = this.#ROUND * Math.round(e.clientX / this.#ROUND) - rect.left;
    const height = this.#ROUND * Math.round(e.clientY / this.#ROUND) - rect.top;
    this.config.update((value) => ({ ...value, width, height }));
  }

  select(selected: boolean): void {
    this.config.update((value) => ({ ...value, selected }));
  }
}
