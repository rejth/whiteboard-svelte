import { get, type Writable, writable } from 'svelte/store';
import { v4 } from 'uuid';

import { type ShapeType, toolbarModel, Tools, type Tool } from '../Toolbar';
import { isDrawingToolSelected } from '../Toolbar/lib';
import { GeometryManager, type Dimension, type Point } from '../../shared/services';

export type ShapeConfig = {
  uuid: string;
  type: ShapeType;
  x: number;
  y: number;
  width: number;
  height: number;
  selected: boolean;
  styles: string;
  color?: string;
  text?: string;
};

const dimensions: Record<ShapeType, Dimension> = {
  NOTE: { width: 140, height: 140 },
  AREA: { width: 240, height: 240 },
  TEXT: { width: 90, height: 30 },
};

class CanvasModel {
  shapes: Writable<Set<ShapeConfig>> = writable(new Set());
  selectedShapes: Writable<Set<ShapeConfig>> = writable(new Set());
  selection: Writable<Point[]> = writable([]);
  mousePosition: Writable<{ x: number; y: number }> = writable({ x: 0, y: 0 });

  #geometryManager: GeometryManager;
  shapeType: ShapeType | null = null;
  tool: Tool = Tools.PAN;

  constructor() {
    this.#geometryManager = new GeometryManager();

    toolbarModel.shapeType.subscribe((value) => {
      this.shapeType = value;
    });
    toolbarModel.tool.subscribe((value) => {
      this.tool = value;
    });
  }

  #createShape(uuid: string, type: ShapeType, point: Point): ShapeConfig {
    const styles = `
      width: ${dimensions[type].width}em;
      height: ${dimensions[type].height}em;
      transform: translate(${point.x}px, ${point.y}px);
    `;

    return {
      uuid,
      type,
      selected: true,
      width: dimensions[type].width,
      height: dimensions[type].height,
      x: point.x,
      y: point.y,
      styles,
    };
  }

  #removeSelectedShapes(store: Set<ShapeConfig>, selected: Set<ShapeConfig>): Set<ShapeConfig> {
    return new Set([...store].filter((el) => !selected.has(el)));
  }

  dragCanvas(e: MouseEvent, rect: DOMRect): void {
    if (isDrawingToolSelected(this.tool) || this.tool === Tools.SELECT) return;

    const selected = get(this.selectedShapes);
    const insideCanvas = this.#geometryManager.insideRect(e, rect);
    if (insideCanvas && selected.size === 0) {
      this.mousePosition.update((point) => this.#geometryManager.move(e, point));
    }
  }

  dragSelection(e: MouseEvent, rect: DOMRect): void {
    if (this.tool !== Tools.SELECT) return;
    const insideCanvas = this.#geometryManager.insideRect(e, rect);

    if (insideCanvas) {
      const point = this.#geometryManager.getMousePosition(e, rect);
      this.selection.update((path) => [...path, point]);
    }
  }

  resetSelection(): void {
    this.selection.set([]);
  }

  addShape(e: MouseEvent, rect: DOMRect): void {
    if (!this.shapeType) return;
    const position = this.#geometryManager.getMousePosition(e, rect);
    const shape = this.#createShape(v4(), this.shapeType, position);

    this.shapes.update((shapes) => shapes.add(shape));
    this.selectShape(shape);

    toolbarModel.tool.set(Tools.PAN);
    toolbarModel.shapeType.set(null);
    toolbarModel.disableDeletion.set(false);
  }

  selectShape(shape: ShapeConfig): void {
    this.selectedShapes.update((selected) => selected.add(shape));
  }

  deleteShape(): void {
    const selected = get(this.selectedShapes);

    this.selectedShapes.update((shapes) => this.#removeSelectedShapes(shapes, selected));
    this.shapes.update((shapes) => this.#removeSelectedShapes(shapes, selected));
    toolbarModel.disableDeleteTool(true);
  }

  clearAllSelectedShapes(): void {
    this.selectedShapes.update((selected) => {
      selected.clear();
      return selected;
    });
  }
}

export const canvasModel = new CanvasModel();
