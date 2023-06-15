<script lang="ts">
  import { type ComponentType } from 'svelte';

  import { Line, Pen, Rect } from '~/ui/Figure';

  import { drawingModel } from './model';
  import { Tools, type DrawingTool } from '../Toolbar';
  import { ConnectionNode } from '../Figure';

  let svgRef: SVGSVGElement;
  const { figures, grabbers, mouse } = drawingModel;

  const widgets: Record<DrawingTool, ComponentType> = {
    [Tools.CONNECT]: Line,
    [Tools.SELECT]: Rect,
    [Tools.PEN]: Pen,
  };

  const renderWidget = (type: DrawingTool | null) => widgets[type || Tools.CONNECT];

  const onMouseDown = (e: MouseEvent) => drawingModel.startPath(e, svgRef.getBoundingClientRect());
  const onMouseMove = (e: MouseEvent) => drawingModel.movePath(e, svgRef.getBoundingClientRect());
  const onMouseUp = () => drawingModel.endPath();
</script>

<svelte:document on:mousedown={onMouseDown} on:mousemove={onMouseMove} on:mouseup={onMouseUp} />

<div>
  {#each [...$grabbers] as node (node.uuid)}
    <ConnectionNode {node} />
  {/each}

  {#if $mouse && $mouse.grabbers}
    {#each [...$mouse.grabbers.values()] as node (node.uuid)}
      <ConnectionNode {node} />
    {/each}
  {/if}

  <svg class="drawing" bind:this={svgRef}>
    {#each [...$figures] as { uuid, type, path } (uuid)}
      <svelte:component this={renderWidget(type)} {path} />
    {/each}

    {#if $mouse}
      <svelte:component this={renderWidget($mouse.type)} path={$mouse.path} />
    {/if}
  </svg>
</div>

<style>
  .drawing {
    width: 800em;
    height: 600em;
    position: absolute;
    top: 0px;
    left: 0px;
    pointer-events: none;
    z-index: 200000000;
  }
</style>
