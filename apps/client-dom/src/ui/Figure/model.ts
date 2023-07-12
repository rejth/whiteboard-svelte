import { type Writable, writable, get } from 'svelte/store';

import { GeometryManager, type Point } from '../../shared/services';
import type { FigureConfig } from '../Drawing';

export class FigureModel {
  figure: Writable<FigureConfig | null> = writable(null);
  #geometryManager: GeometryManager;

  constructor(attributes: FigureConfig) {
    this.#geometryManager = new GeometryManager();
    this.figure.set(attributes);
  }

  calculateQuadraticCurveSVGPath(e: MouseEvent, rect: DOMRect): void {
    const figure = get(this.figure);
    const from = figure?.path[0] as Point;
    const to = figure?.path[figure.path.length - 1] as Point;

    const peakCurvePoint = this.#geometryManager.getMousePosition(e, rect);

    this.figure.update((value) => ({
      ...(value as FigureConfig),
      svgPath: this.#geometryManager.getQuadraticCurveSVGPath(from, to, peakCurvePoint),
    }));
  }
}
