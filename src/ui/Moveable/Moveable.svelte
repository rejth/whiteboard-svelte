<script lang="ts">
	import { onMount, beforeUpdate } from 'svelte';

  import { clickOutside } from './clickOutside';
  import { canvasModel } from '../Canvas/CanvasModel';
  import { toolbarModel } from '../Toolbar/ToolbarModel';
  import { dndWatcher } from '../../model';
  import { MoveableModel } from './MoveableModel';
  import Selection from '../Selection/Selection.svelte'

  export let settings;
  const moveableModel = new MoveableModel(settings);

  const { config } = moveableModel;
  const deleteIcon = document.getElementById('toolbar');
  let moveableRef;

  $: styles = `
    width: ${$config.width}px; 
    height: ${$config.height}px;
    transform: translate(${$config.x}px, ${$config.y}px);
  `;

  const onClickOutside = () => {
    moveableModel.select(false);
    canvasModel.clearAllSelected();
    toolbarModel.disableDeleteTool(true);
  }

  const onSelectShape = () => {
    moveableModel.select(true);
    canvasModel.selectShape(settings);
    toolbarModel.disableDeleteTool(false);
  }

	onMount(async () => {
    const dnd = dndWatcher(moveableRef);

    const observeDndEvents = async () => {
      for await (const e of dnd) {
        moveableModel.move(e)
      }
    };

    await Promise.all([observeDndEvents()]);
	});
</script>

<div>
  <div 
    class="moveable" 
    style={styles} 
    bind:this={moveableRef}
    use:clickOutside={{ exclude: [deleteIcon] }}
    on:click={onSelectShape}
    on:outclick={onClickOutside}
    >
    <slot></slot>
  </div>
  {#if $config.selected}
    <Selection styles={styles} provider={moveableModel} />
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