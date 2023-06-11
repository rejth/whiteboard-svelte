<script lang="ts">
  export let path: { x: number; y: number }[];

  $: curve = [`M ${path[0].x} ${path[0].y}`];
  $: collector = path.map((point) => `L ${point.x} ${point.y}`);
</script>

<path class="figure-pen" d={curve.concat(collector).join(' ')} />

<style>
  .figure-pen {
    stroke: #444444;
    stroke-width: max(0.1em, 1.5px);
    stroke-linecap: round;
    fill: transparent;
  }
</style>
