<script lang="ts">
  import { onMount } from 'svelte';

  import { clickOutside, dndWatcher } from '~/shared/lib';
  import { canvasModel, type ShapeConfig } from '~/ui/Canvas';
  import { toolbarModel } from '~/ui/Toolbar';

  import { Selection } from './';
  import { ShapeModel } from '../model';

  export let settings: ShapeConfig;

  const shapeModel = new ShapeModel(settings);
  const { config } = shapeModel;

  const deleteIcon = document.getElementById('toolbar');
  let shapeRef: HTMLDivElement;

  $: styles = `
    width: ${$config?.width}px;
    height: ${$config?.height}px;
    transform: translate(${$config?.x}px, ${$config?.y}px);
  `;

  onMount(async () => {
    const dnd = dndWatcher(shapeRef);

    for await (const e of dnd) {
      shapeModel.move(e as MouseEvent);
    }
  });

  const onClickOutside = () => {
    shapeModel.select(false);
    canvasModel.clearAllSelectedShapes();
    toolbarModel.disableDeleteTool(true);
  };

  const onSelect = () => {
    shapeModel.select(true);
    canvasModel.selectShape(settings);
    toolbarModel.disableDeleteTool(false);
  };
</script>

<div
  class="shape-wrapper"
  use:clickOutside={{ exclude: [deleteIcon] }}
  on:mousedown={onSelect}
  on:outclick={onClickOutside}
  on:keydown
>
  <div class="shape" style={styles} bind:this={shapeRef}>
    <slot />
  </div>
  {#if $config?.selected}
    <Selection {styles} model={shapeModel} />
  {/if}
</div>

<style>
  .shape {
    position: absolute;
    top: 0;
    left: 0;
    width: 9rem;
    height: 9rem;
    padding: 0.5rem;

    user-select: none;
    touch-action: none;
    cursor: move;

    font-size: 0.9em;
    color: rgb(0, 0, 0);
    border-radius: 0.2rem;
  }
</style>
