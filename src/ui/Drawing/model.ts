import { writable, type Writable } from 'svelte/store';

import type { DrawingTool } from '../Toolbar';

export type FigureConfig = {
  uuid: string;
  type: DrawingTool;
};

class DrawingModel {
  figures: Writable<Set<FigureConfig>> = writable(new Set());

  draw(_e: MouseEvent): void {}
}

export const drawingModel = new DrawingModel();
