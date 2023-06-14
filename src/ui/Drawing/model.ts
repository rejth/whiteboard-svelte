import { get, writable, type Writable } from 'svelte/store';
import { v4 } from 'uuid';

import { toolbarModel, type DrawingTool, Tools } from '../Toolbar';
import type { ShapeConfig } from '../Canvas';
import { GeometryManager, type Point } from '../../shared/services';

export type FigureConfig = {
  uuid: string;
  type: DrawingTool | null;
  path: Point[];
};

export type Mouse = {
  type: DrawingTool | null;
  path: Point[];
  grabbers?: Map<GrabberNodeType, GrabberNode>;
  color?: string;
};

export type GrabberNode = {
  uuid: string;
  type: GrabberNodeType;
  position: Point;
  angle: number;
  selected: boolean;
  node?: ShapeConfig;
  style?: string;
};

export enum GrabberNodes {
  SOURCE = 'SOURCE',
  MIDDLE = 'MIDDLE',
  TARGET = 'TARGET',
}

export type GrabberNodeType = keyof typeof GrabberNodes;

class DrawingModel {
  figures: Writable<Set<FigureConfig>> = writable(new Set());
  grabbers: Writable<GrabberNode[]> = writable([]);
  mouse: Writable<Mouse | null> = writable(null);

  #geometryManager: GeometryManager;
  tool: DrawingTool | null = null;
  pressed = false;

  constructor() {
    this.#geometryManager = new GeometryManager();
    toolbarModel.drawingTool.subscribe((value) => {
      this.tool = value;
    });
  }

  #updateTargetGrabberPosition(position: Point): void {
    this.mouse.update((mouse) => {
      const start = mouse?.path[0] as Point;
      const end = mouse?.path[mouse.path.length - 1] as Point;
      const angle = this.#geometryManager.calculateLineDegreesAngle(start, end);

      if (!mouse?.grabbers?.has(GrabberNodes.TARGET)) {
        const newTargetNode = this.#createGrabberNodeHelper(GrabberNodes.TARGET, position, angle);
        mouse?.grabbers?.set(GrabberNodes.TARGET, newTargetNode);
      } else {
        const target = mouse?.grabbers?.get(GrabberNodes.TARGET);
        mouse?.grabbers?.set(GrabberNodes.TARGET, { ...(target as GrabberNode), position, angle });
      }

      return { ...(mouse as Mouse) };
    });
  }

  #updateMousePath(point: Point): void {
    this.mouse.update((mouse) => ({
      ...(mouse as Mouse),
      path: [...(mouse?.path || []), point],
    }));
  }

  #createFigure(): FigureConfig {
    const mouseTracker = get(this.mouse);
    return { uuid: v4(), type: this.tool, path: mouseTracker?.path || [] };
  }

  #createGrabberNodeHelper(type: GrabberNodeType, position: Point, angle = 0): GrabberNode {
    return {
      uuid: v4(),
      type,
      position,
      angle,
      selected: false,
    };
  }

  #createMouseGrabberNode(position: Point): void {
    const sourceNode = this.#createGrabberNodeHelper(GrabberNodes.SOURCE, position);
    this.mouse.update((mouse) => ({
      ...(mouse as Mouse),
      grabbers: new Map([[GrabberNodes.SOURCE, sourceNode]]),
    }));
  }

  #updateGrabberNodesList(): void {
    const mouseTracker = get(this.mouse);
    this.grabbers.update((value) => [...value, ...(mouseTracker?.grabbers?.values() || [])]);
  }

  startPath(e: MouseEvent, rect: DOMRect): void {
    if (!this.tool) return;
    this.pressed = true;
    const position = this.#geometryManager.getMousePosition(e, rect);

    this.mouse.set({ type: this.tool, path: [position] });
    if (this.tool === Tools.CONNECT) this.#createMouseGrabberNode(position);
  }

  movePath(e: MouseEvent, rect: DOMRect): void {
    if (!this.tool || !this.pressed) return;
    const position = this.#geometryManager.getMousePosition(e, rect);

    this.#updateMousePath(position);
    if (this.tool === Tools.CONNECT) this.#updateTargetGrabberPosition(position);
  }

  endPath(): void {
    if (!this.tool) return;
    this.pressed = false;

    if (this.tool === Tools.CONNECT) this.#updateGrabberNodesList();
    this.figures.update((value) => value.add(this.#createFigure()));
    this.mouse.set(null);
  }
}

export const drawingModel = new DrawingModel();
