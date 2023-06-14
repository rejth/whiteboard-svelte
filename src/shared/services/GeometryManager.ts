import { Bezier } from 'bezier-js';

import { Tools } from '../../ui/Toolbar';
import type { FigureConfig } from '../../ui/Drawing';

export type Point = { x: number; y: number };
export type Dimension = { width: number; height: number };

export class GeometryManager {
  #ROUND = 2;

  getMousePosition(e: MouseEvent, rect: DOMRect): Point {
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  }

  move(e: MouseEvent, p: Point): Point {
    return {
      x: p.x + e.movementX,
      y: p.y + e.movementY,
    };
  }

  resize(e: MouseEvent, rect: DOMRect): Dimension {
    const width = this.#ROUND * Math.round(e.clientX / this.#ROUND) - rect.left;
    const height = this.#ROUND * Math.round(e.clientY / this.#ROUND) - rect.top;
    return { width, height };
  }

  getFigureRect(figure: FigureConfig): Point & Dimension {
    const start = figure.path[0];
    const end = figure.path[figure.path.length - 1];

    if (figure.type === Tools.PEN) {
      const px = figure.path.map((p) => p.x);
      const py = figure.path.map((p) => p.y);
      const minX = Math.min(...px);
      const maxX = Math.max(...px);
      const minY = Math.min(...py);
      const maxY = Math.max(...py);
      return {
        x: minX,
        y: minY,
        width: maxX - minX,
        height: maxY - minY,
      };
    }

    return {
      x: Math.min(start.x, end.x),
      y: Math.min(start.y, end.y),
      width: Math.abs(start.x - end.x),
      height: Math.abs(start.y - end.y),
    };
  }

  insideRect(p: Point, rect: DOMRect): boolean {
    return p.x > rect.left && p.x < rect.right && p.y > rect.top && p.y < rect.bottom;
  }

  pointInsideDimensionRect(p: Point, rect: DOMRect): boolean {
    return (
      p.x >= rect.x && p.x <= rect.x + rect.width && p.y >= rect.y && p.y <= rect.y + rect.height
    );
  }

  calculateLineDegreesAngle(p1: Point, p2: Point): number {
    return (Math.atan2(p2.y - p1.y, p2.x - p1.x) * 180) / Math.PI;
  }

  calculateCurveDegreesAngle(curve: any): number {
    // tangent vector at the very end of the curve
    const d = curve.derivative(1);
    const angle = ((Math.atan2(d.y, d.x) - Math.atan2(0, Math.abs(d.x))) * 180) / Math.PI;
    return Math.round(angle);
  }

  getLineDraggedPoint(from: Point, to: Point, draggedPoints: Point[]): Point {
    if (draggedPoints.length > 0) return draggedPoints[0];
    // fallback if no dragged points (straight line) - midpoint
    return { x: (to.x + from.x) * 0.5, y: (to.y + from.y) * 0.5 };
  }

  bezierCurveFromPoints(from: Point, middle: Point, to: Point): any {
    return Bezier.quadraticFromPoints(from, middle, to);
  }
}
