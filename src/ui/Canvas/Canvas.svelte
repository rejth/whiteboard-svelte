<script lang="ts">
  import { type ComponentType, onMount } from 'svelte';

  import { dndWatcher } from '~/shared/lib';

  import { Drawing } from '~/ui/Drawing';
  import { Tools, type ShapeType } from '~/ui/Toolbar';
  import { Shape, Note, Text, Area } from '~/ui/Shape';

  import { canvasModel } from './model';

  let canvasRef: HTMLDivElement;
  const { shapes, selectedShapes, mousePosition } = canvasModel;

  const widgets: Record<ShapeType, ComponentType> = {
    [Tools.NOTE]: Note,
    [Tools.TEXT]: Text,
    [Tools.AREA]: Area,
  };

  $: styles = `
    transform: translate(${$mousePosition.x}px, ${$mousePosition.y}px);
  `;

  onMount(async () => {
    const dnd = dndWatcher(canvasRef);

    for await (const e of dnd) {
      const event = e as MouseEvent;
      const target = event.target as HTMLElement;
      if (target.isEqualNode(canvasRef) && $selectedShapes.size === 0) {
        canvasModel.dragOverCanvas(event);
      }
    }
  });

  const onClick = (e: MouseEvent) => {
    canvasModel.addShape(e, canvasRef.getBoundingClientRect());
  };
</script>

<div class="canvas-wrapper">
  <div
    draggable
    tabindex="0"
    role="button"
    class="canvas"
    tabIndex={0}
    style={styles}
    bind:this={canvasRef}
    on:click={onClick}
    on:keydown
  >
    {#each [...$shapes] as shape (shape.uuid)}
      <Shape settings={shape}>
        <svelte:component this={widgets[shape.type]} />
      </Shape>
    {/each}
    <Drawing />
  </div>
</div>

<style>
  .canvas-wrapper {
    font-size: 1em;
    width: 800em;
    height: 600em;
    box-sizing: content-box;

    transform: translate(0%, 0%) scale(1);
    will-change: transform;
  }

  .canvas {
    position: relative;
    width: 100%;
    height: 100%;
    pointer-events: all;
    cursor: grab;

    background-color: #f2f2f3;
    background-position: 0 0, 30em 30em;
    background-size: 60em 60em;
    background-image: linear-gradient(
        45deg,
        #f4f4f6 25%,
        transparent 25%,
        transparent 75%,
        #f4f4f6 75%
      ),
      linear-gradient(45deg, #f4f4f6 25%, transparent 25%, transparent 75%, #f4f4f6 75%);
  }
</style>
