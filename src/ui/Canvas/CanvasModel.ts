import { get, type Writable, writable } from 'svelte/store';
import { v4 } from 'uuid';

import { type ShapeType, toolbarModel, Tools } from '../Toolbar';

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

const dimensions: Record<ShapeType, { width: number; height: number }> = {
  NOTE: { width: 140, height: 140 },
  AREA: { width: 240, height: 240 },
  TEXT: { width: 90, height: 30 },
};

class CanvasModel {
  shapeTool: ShapeType | null = null;
  shapes: Writable<Set<ShapeConfig>> = writable(new Set());
  selectedShapes: Writable<Set<ShapeConfig>> = writable(new Set());
  mousePosition: Writable<{ x: number; y: number }> = writable({ x: 0, y: 0 });

  constructor() {
    toolbarModel.shapeTool.subscribe((value) => {
      this.shapeTool = value;
    });
  }

  #createShape(uuid: string, type: ShapeType, { x, y }: Pick<ShapeConfig, 'x' | 'y'>): ShapeConfig {
    const styles = `
      width: ${dimensions[type].width}em;
      height: ${dimensions[type].height}em;
      transform: translate(${x}px, ${y}px);
    `;

    return {
      uuid,
      type,
      selected: true,
      width: dimensions[type].width,
      height: dimensions[type].height,
      styles,
      x,
      y,
    };
  }

  #removeSelectedShapes(store: Set<ShapeConfig>, selected: Set<ShapeConfig>): Set<ShapeConfig> {
    return new Set([...store].filter((el) => !selected.has(el)));
  }

  #getMousePosition(e: MouseEvent, rect: DOMRect) {
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  }

  dragOverCanvas(e: MouseEvent): void {
    this.mousePosition.update((value) => ({
      x: value.x + e.movementX,
      y: value.y + e.movementY,
    }));
  }

  addShape(e: MouseEvent, canvasRect: DOMRect): void {
    if (!this.shapeTool) return;
    const position = this.#getMousePosition(e, canvasRect);
    const shape = this.#createShape(v4(), this.shapeTool, position);

    this.shapes.update((shapes) => shapes.add(shape));
    this.selectShape(shape);

    toolbarModel.tool.set(Tools.PAN);
    toolbarModel.shapeTool.set(null);
    toolbarModel.disableDeletion.set(false);
  }

  selectShape(shape: ShapeConfig): void {
    this.selectedShapes.update((selected) => selected.add(shape));
  }

  deleteShape(): void {
    const selected = get(this.selectedShapes);

    this.selectedShapes.update((value) => this.#removeSelectedShapes(value, selected));
    this.shapes.update((value) => this.#removeSelectedShapes(value, selected));

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
