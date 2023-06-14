import { type Writable, writable } from 'svelte/store';

import { type ShapeConfig } from '../Canvas';
import { GeometryManager } from '../../shared/services';

export class ShapeModel {
  config: Writable<ShapeConfig | null> = writable(null);
  #geometryManager: GeometryManager;

  constructor(attributes: ShapeConfig) {
    this.#geometryManager = new GeometryManager();
    this.config.set(attributes);
  }

  move(e: MouseEvent): void {
    this.config.update((shape) => ({
      ...(shape as ShapeConfig),
      ...this.#geometryManager.move(e, { x: Number(shape?.x), y: Number(shape?.y) }),
    }));
  }

  resize(e: MouseEvent, rect: DOMRect): void {
    const { width, height } = this.#geometryManager.resize(e, rect);
    this.config.update((shape) => ({ ...(shape as ShapeConfig), width, height }));
  }

  select(selected: boolean): void {
    this.config.update((value) => ({ ...(value as ShapeConfig), selected }));
  }
}
