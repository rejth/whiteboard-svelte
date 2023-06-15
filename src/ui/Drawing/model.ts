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
  grabbers?: Map<ConnectionType, ConnectionNode>;
  color?: string;
};

export type ConnectionNode = {
  uuid: string;
  type: ConnectionType;
  position: Point;
  angle: number;
  selected: boolean;
  node?: ShapeConfig;
  style?: string;
};

export enum Connections {
  SOURCE = 'SOURCE',
  MIDDLE = 'MIDDLE',
  TARGET = 'TARGET',
}

export type ConnectionType = keyof typeof Connections;

class DrawingModel {
  figures: Writable<Set<FigureConfig>> = writable(new Set());
  grabbers: Writable<ConnectionNode[]> = writable([]);
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

  #updateConnectionNode(mouse: Mouse | null, type: ConnectionType, point: Point, angle = 0): void {
    if (!mouse?.grabbers?.has(type)) {
      const newNode = this.#createConnectionNode(type, point, angle);
      mouse?.grabbers?.set(type, newNode);
    } else {
      const node = mouse?.grabbers?.get(type);
      mouse?.grabbers?.set(type, {
        ...(node as ConnectionNode),
        position: point,
        angle,
      });
    }
  }

  #updateTargetNodePosition(mouse: Mouse | null, point: Point): void {
    const start = mouse?.path[0] as Point;
    const angle = this.#geometryManager.calculateLineDegreesAngle(start, point);
    this.#updateConnectionNode(mouse, Connections.TARGET, point, angle);
  }

  #updateMiddleNodePosition(mouse: Mouse | null, point: Point): void {
    const start = mouse?.path[0] as Point;
    const midPoint = this.#geometryManager.getLineMiddlePoint(start, point);
    this.#updateConnectionNode(mouse, Connections.MIDDLE, midPoint);
  }

  #updateConnectionNodesPosition(point: Point): void {
    this.mouse.update((mouse) => {
      this.#updateMiddleNodePosition(mouse, point);
      this.#updateTargetNodePosition(mouse, point);
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

  #createConnectionNode(type: ConnectionType, position: Point, angle = 0): ConnectionNode {
    return {
      uuid: v4(),
      type,
      position,
      angle,
      selected: false,
    };
  }

  #createMouseConnectionNode(position: Point): void {
    const sourceNode = this.#createConnectionNode(Connections.SOURCE, position);
    this.mouse.update((mouse) => ({
      ...(mouse as Mouse),
      grabbers: new Map([[Connections.SOURCE, sourceNode]]),
    }));
  }

  #updateConnectionNodesList(): void {
    const mouseTracker = get(this.mouse);
    this.grabbers.update((value) => [...value, ...(mouseTracker?.grabbers?.values() || [])]);
  }

  startPath(e: MouseEvent, rect: DOMRect): void {
    if (!this.tool) return;
    this.pressed = true;
    const position = this.#geometryManager.getMousePosition(e, rect);

    this.mouse.set({ type: this.tool, path: [position] });
    if (this.tool === Tools.CONNECT) this.#createMouseConnectionNode(position);
  }

  movePath(e: MouseEvent, rect: DOMRect): void {
    if (!this.tool || !this.pressed) return;
    const position = this.#geometryManager.getMousePosition(e, rect);

    this.#updateMousePath(position);
    if (this.tool === Tools.CONNECT) this.#updateConnectionNodesPosition(position);
  }

  endPath(): void {
    if (!this.tool) return;
    this.pressed = false;

    if (this.tool === Tools.CONNECT) this.#updateConnectionNodesList();
    this.figures.update((value) => value.add(this.#createFigure()));
    this.mouse.set(null);
  }
}

export const drawingModel = new DrawingModel();
