<script lang="ts">
  import { onMount } from 'svelte';

  import { clickOutside, dndWatcher } from '~/shared/lib';
  import { canvasModel, type ShapeConfig } from '~/ui/Canvas';
  import { toolbarModel } from '~/ui/Toolbar';
  import { Selection } from '~/ui/Selection';
  import { MoveableModel } from './MoveableModel';

  export let settings: ShapeConfig;

  const moveableModel = new MoveableModel(settings);
  const { config } = moveableModel;

  const deleteIcon = document.getElementById('toolbar');
  let moveableRef: HTMLDivElement;

  $: styles = `
    width: ${$config?.width}px;
    height: ${$config?.height}px;
    transform: translate(${$config?.x}px, ${$config?.y}px);
  `;

  onMount(async () => {
    const dnd = dndWatcher(moveableRef);

    for await (const e of dnd) {
      moveableModel.move(e as MouseEvent);
    }
  });

  const onClickOutside = () => {
    moveableModel.select(false);
    canvasModel.clearAllSelectedShapes();
    toolbarModel.disableDeleteTool(true);
  };

  const onSelect = () => {
    moveableModel.select(true);
    canvasModel.selectShape(settings);
    toolbarModel.disableDeleteTool(false);
  };
</script>

<div
  class="moveable-wrapper"
  use:clickOutside={{ exclude: [deleteIcon] }}
  on:mousedown={onSelect}
  on:outclick={onClickOutside}
  on:keydown
>
  <div class="moveable" style={styles} bind:this={moveableRef}>
    <slot />
  </div>
  {#if $config?.selected}
    <Selection {styles} model={moveableModel} />
  {/if}
</div>

<style>
  .moveable {
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
