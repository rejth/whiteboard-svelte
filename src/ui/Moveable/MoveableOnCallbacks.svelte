<script lang="ts">  
	let left = 0;
	let top = 0;
  let width = 140;
  let height = 140;
  let box;

  let startX;
  let startY;

  let moving = false; 
  let resizing = false;

  $: styles = `left: ${left}px; top: ${top}px; width: ${width}px; height: ${height}px;`
	
	const startMove = () => moving = true;
  const startResize = (e) => {
    resizing = true;
    startX = e.clientX;
    startY = e.clientY;
  };
	
	const stop = () => {
		moving = false;
    resizing = false;
	}
	
	const move = (e) => {
    if (!moving) return;
    left += e.movementX;
    top += e.movementY;
	}

  const resize = (e) => {
    if (!resizing) return;
    const rect = box.getBoundingClientRect();
    width = 2 * Math.round(e.clientX / 2) - rect.left;
    height = 2 * Math.round(e.clientY / 2) - rect.top;
	}
</script>

<svelte:window on:mouseup={stop} on:mousemove={move} />
<svelte:document on:mouseup={stop} on:mousemove={resize} />

<div class="container">
  <div
    class="box"
    style={styles}
    bind:this={box}
    on:mousedown={startMove}
    >
  </div>
  <span class="selection" style={styles}>
    <span class="corner-resize-drag top-left" on:mousedown={startResize}></span>
    <span class="corner-resize-drag top-right" on:mousedown={startResize}></span>
    <span class="corner-resize-drag bottom-left" on:mousedown={startResize}></span>
    <span class="corner-resize-drag bottom-right" on:mousedown={startResize}></span>
  </span>
</div>

<style>
  .container {
    position: relative;
    margin: 1rem;
  }

	.box {
    position: absolute;
    display: block;
    top: 0;
    left: 0;
    width: 9rem;
    height: 9rem;
    padding: 0.5rem;
    border-radius: 0.2rem;
    user-select: none;
    touch-action: none;
    cursor: move;

		text-align: center;
		font-weight: bold;
    color: #fff;

    border: solid 1px orange;
    background-color: rgb(251, 252, 134);
    box-shadow: 5px 5px 15px 0 rgb(0 0 0 / 12%);
	}

  .selection {
    position: absolute;
    display: block;
    top: 0;
    left: 0;
    width: 9rem;
    height: 9rem;

    border: 2px solid #35b2dc;
    pointer-events: none;
  }

  .corner-resize-drag {
    position: absolute;
    display: block;
    width: 10px;
    height: 10px;

    border: 1px solid #cccccc;
    border-radius: 20%;
    pointer-events: all;
    cursor: nwse-resize;

    box-shadow: 2px 2px 5px 0 rgb(0 0 0 / 16%);
    background-color: #ffff;
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