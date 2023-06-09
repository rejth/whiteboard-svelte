import { type Writable, writable } from 'svelte/store';

export type Tool = keyof typeof Tools;
export type ShapeType = Exclude<Tool, 'SELECT' | 'PAN' | 'DELETE'>;
export enum Tools {
  NOTE = 'NOTE',
  TEXT = 'TEXT',
  AREA = 'AREA',
  PAN = 'PAN',
  SELECT = 'SELECT',
  DELETE = 'DELETE',
}

class ToolbarModel {
  tool: Writable<Tool> = writable('PAN');
  shapeTool: Writable<ShapeType | null> = writable(null);
  disableDeletion: Writable<boolean> = writable(true);

  changeTool(tool: Tool): void {
    this.tool.set(tool);

    if (['NOTE', 'TEXT', 'AREA'].includes(tool)) {
      this.shapeTool.set(tool as ShapeType);
    } else {
      this.shapeTool.set(null);
    }
  }

  disableDeleteTool(disabled: boolean): void {
    this.disableDeletion.set(disabled);
  }
}

export const toolbarModel = new ToolbarModel();
