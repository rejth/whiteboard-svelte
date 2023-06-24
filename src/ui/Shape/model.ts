import { type Writable, writable, get } from 'svelte/store';

import { canvasModel, type ShapeConfig } from '../Canvas';
import { GeometryManager, type Point } from '../../shared/services';

export class ShapeModel {
  shape: Writable<ShapeConfig | null> = writable(null);

  #geometryManager: GeometryManager;
  allSelected: Map<string, ShapeConfig> = new Map();

  constructor(config: ShapeConfig) {
    this.#geometryManager = new GeometryManager();
    this.shape.set(config);

    canvasModel.selectedShapes.subscribe((value) => {
      this.allSelected = value;
    });
  }

  overlap(path: Point[]): void {
    if (path.length === 0) return;
    const shape = get(this.shape) as ShapeConfig;
    const rect = shape?.rect;

    const dimension = this.#geometryManager.getRectDimension(path);
    const position = this.#geometryManager.getRectPosition(dimension);
    const overlapped = this.#geometryManager.overlapRect(position, rect);

    if (overlapped) {
      if (!this.allSelected.has(shape.uuid)) {
        canvasModel.selectShape(shape);
      }
    } else {
      canvasModel.deselectShape(shape);
    }

    this.select(overlapped);
  }

  move(e: MouseEvent, rect: DOMRect): void {
    this.shape.update((shape) => {
      const { x, y } = shape as ShapeConfig;
      return {
        ...(shape as ShapeConfig),
        ...this.#geometryManager.move(e, { x, y }),
        rect,
      };
    });
  }

  resize(e: MouseEvent, rect: DOMRect): void {
    const { width, height } = this.#geometryManager.resize(e, rect);
    this.shape.update((shape) => ({ ...(shape as ShapeConfig), width, height, rect }));
  }

  select(selected: boolean): void {
    this.shape.update((shape) => ({ ...(shape as ShapeConfig), selected }));
  }
}
