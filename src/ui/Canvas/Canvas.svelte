<script lang="ts">
  import type { ComponentType } from 'svelte';

  import { Tools, type ShapeType } from '~/ui/Toolbar';
  import { Moveable } from '~/ui/Moveable';
  import { Note } from '~/ui/Note';
  import { Text } from '~/ui/Text';
  import { Area } from '~/ui/Area';

  import { canvasModel } from './CanvasModel';

  let x = 0;
  let y = 0;
  let canvasRef: HTMLDivElement;
  const { shapes } = canvasModel;

  const widgets: Record<ShapeType, ComponentType> = {
    [Tools.NOTE]: Note,
    [Tools.TEXT]: Text,
    [Tools.AREA]: Area,
  };

  $: styles = `
    transform: translate(${x}px, ${y}px);
  `;

  const handleClick = (e: MouseEvent) => {
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
    on:click={handleClick}
    on:keydown
  >
    {#each [...$shapes] as shape (shape.uuid)}
      <Moveable settings={shape}>
        <svelte:component this={widgets[shape.type]} />
      </Moveable>
    {/each}
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
