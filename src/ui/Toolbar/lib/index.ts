import type { Tool } from '../model';

export function isShapeToolSelected(tool: Tool) {
  return ['NOTE', 'TEXT', 'AREA'].includes(tool);
}

export function isDrawingToolSelected(tool: Tool) {
  return ['SELECT', 'CONNECT', 'PEN'].includes(tool);
}

export function isServiceToolSelected(tool: Tool) {
  return ['PAN', 'DELETE'].includes(tool);
}
