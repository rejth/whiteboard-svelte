<script lang="ts">
	import { onMount } from 'svelte';
  import type { ComponentType } from 'svelte';
  
  import { Moveable } from '..';
  import Note from '../Note/Note.svelte';
  import Text from '../Text/Text.svelte';
  import Area from '../Area/Area.svelte';

  import { canvasModel } from './CanvasModel';
  import { Tools } from '../Toolbar/ToolbarModel';

  let x = 0;
  let y = 0;
  let canvasRef;
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
    class="canvas"
    role="button"
    tabIndex={0}
    styles={styles}
    bind:this={canvasRef}
    on:click={handleClick}
  >
    {#each [...$shapes] as shape (shape.uuid)}
      <Moveable settings={shape}>
        <svelte:component this={widgets[shape.type]}/>
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

    background-color: #F2F2F3;
    background-position: 0 0, 30em 30em;
    background-size: 60em 60em;
    background-image: linear-gradient(
      45deg,
      #F4F4F6 25%,
      transparent 25%,
      transparent 75%,
      #F4F4F6 75%
    ),
      linear-gradient(45deg, #F4F4F6 25%, transparent 25%, transparent 75%, #F4F4F6 75%);
  }
</style>
