<script lang="ts">
  import { onMount, type ComponentType } from 'svelte';

  import { dndWatcher as mouseWatcher } from '~/shared/lib';
  import { Figure, Line, Pen, Rect } from '~/ui/Figure';

  import { drawingModel } from './model';
  import { Tools, type DrawingTool } from '../Toolbar';

  let svgRef: HTMLDivElement;
  const { figures } = drawingModel;

  const widgets: Record<DrawingTool, ComponentType> = {
    [Tools.CONNECT]: Line,
    [Tools.SELECT]: Rect,
    [Tools.PEN]: Pen,
  };

  onMount(async () => {
    const mouse = mouseWatcher(svgRef);

    for await (const e of mouse) {
      drawingModel.draw(e as MouseEvent);
    }
  });

  const onClick = (_e: MouseEvent) => {};
</script>

<div class="drawing-wrapper" bind:this={svgRef}>
  <svg class="drawing" on:click={onClick} on:keydown>
    {#each [...$figures] as item (item.uuid)}
      <Figure settings={item}>
        <svelte:component this={widgets[item.type]} />
      </Figure>
    {/each}
  </svg>
</div>

<style>
  .drawing-wrapper {
    width: 800em;
    height: 600em;
    position: absolute;
    top: 0px;
    left: 0px;
    pointer-events: none;
    z-index: 200000000;
  }

  .drawing {
    width: 100%;
    height: 100%;
  }
</style>
