import { type Writable, writable } from 'svelte/store';

export type Tool = keyof typeof Tools;
export type ShapeType = 'NOTE' | 'TEXT' | 'AREA';
export type DrawingTool = 'SELECT' | 'CONNECT' | 'PEN';
export type ServiceTool = 'PAN' | 'DELETE';
export enum Tools {
  NOTE = 'NOTE',
  TEXT = 'TEXT',
  AREA = 'AREA',
  PEN = 'PEN',
  SELECT = 'SELECT',
  CONNECT = 'CONNECT',
  PAN = 'PAN',
  DELETE = 'DELETE',
}

class ToolbarModel {
  tool: Writable<Tool> = writable('PAN');
  shapeType: Writable<ShapeType | null> = writable(null);
  disableDeletion: Writable<boolean> = writable(true);

  changeTool(tool: Tool): void {
    this.tool.set(tool);

    if (['NOTE', 'TEXT', 'AREA'].includes(tool)) {
      this.shapeType.set(tool as ShapeType);
    } else {
      this.shapeType.set(null);
    }
  }

  disableDeleteTool(disabled: boolean): void {
    this.disableDeletion.set(disabled);
  }
}

export const toolbarModel = new ToolbarModel();
