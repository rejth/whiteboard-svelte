<script lang="ts">
	import { onMount } from 'svelte';
  import { resizeWatcher } from '../../model';

  export let styles;
  export let provider;

  let selectionRef;
  let cornerRef;

  const cornerStyles = [
    'top-left', 'top-right', 'bottom-left', 'bottom-right',
  ];

	onMount(async () => {
    const resize = resizeWatcher(cornerRef);

    const observeResizeEvents = async () => {
      for await (const e of resize) {
        const rect = selectionRef.getBoundingClientRect();
        provider.resize(e, rect)
      }
    };

    await Promise.all([observeResizeEvents()]);
	});
</script>

<span 
  class="selection"
  id="selection"
  style={styles}
  bind:this={selectionRef}
>
  {#each cornerStyles as corner}
    <span 
      class={`corner-resize-drag ${corner}`}
      bind:this={cornerRef}>
    </span>
  {/each}
</span>

<style>
  .selection {
    position: absolute;
    top: 0;
    left: 0;
    width: 9rem;
    height: 9rem;

    border: 2px solid #35B2DC;
    pointer-events: none;
  }

  .corner-resize-drag {
    position: absolute;
    display: block;
    width: 10px;
    height: 10px;

    border: 1px solid #CCCCCC;
    border-radius: 20%;
    pointer-events: all;
    cursor: nwse-resize;

    box-shadow: 2px 2px 5px 0 rgb(0 0 0 / 16%);
    background-color: #FFFF;
  }

  .corner-resize-drag.top-left {
    top: -7px;
    left: -7px;
  }

  .corner-resize-drag.top-right {
    top: -7px;
    right: -7px;
  }

  .corner-resize-drag.bottom-left {
    bottom: -7px;
    left: -7px;
  }

  .corner-resize-drag.bottom-right {
    right: -7px;
    bottom: -7px;
  }
</style>