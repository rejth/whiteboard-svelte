import { get, writable, type Writable } from 'svelte/store';
import { v4 } from 'uuid';

import { toolbarModel, type DrawingTool } from '../Toolbar';

export type FigureConfig = {
  uuid: string;
  type: DrawingTool | null;
  path: Position[];
};

export type Mouse = {
  type: DrawingTool | null;
  path: Position[];
  color?: string;
};

type Position = { x: number; y: number };

class DrawingModel {
  figures: Writable<Set<FigureConfig>> = writable(new Set());
  mouse: Writable<Mouse | null> = writable(null);

  tool: DrawingTool | null = null;
  pressed = false;

  constructor() {
    toolbarModel.drawingTool.subscribe((value) => {
      this.tool = value;
    });
  }

  #getMousePosition(e: MouseEvent, rect: DOMRect) {
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  }

  #updatePath(position: Position): void {
    this.mouse.update((mouse) => ({
      ...(mouse as Mouse),
      path: [...(mouse?.path || []), position],
    }));
  }

  #createFigure(): FigureConfig {
    const mouseTracker = get(this.mouse);
    return { uuid: v4(), type: this.tool, path: mouseTracker?.path || [] };
  }

  startPath(e: MouseEvent, rect: DOMRect): void {
    if (!this.tool) return;
    this.pressed = true;
    const position = this.#getMousePosition(e, rect);
    this.mouse.set({ type: this.tool, path: [position] });
  }

  movePath(e: MouseEvent, rect: DOMRect): void {
    if (!this.tool || !this.pressed) return;
    const position = this.#getMousePosition(e, rect);
    this.#updatePath(position);
  }

  endPath(): void {
    if (!this.tool) return;
    this.pressed = false;
    this.figures.update((value) => value.add(this.#createFigure()));
    this.mouse.set(null);
  }
}

export const drawingModel = new DrawingModel();
