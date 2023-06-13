<script lang="ts">
  export let path: { x: number; y: number }[];

  $: curve = [
    `M ${path[0].x} ${path[0].y}`,
    `L ${path[path.length - 1].x} ${path[path.length - 1].y}`,
  ];
</script>

<g>
  <path class="figure-line" d={curve.join(' ')} />
</g>

<style>
  .figure-line {
    stroke: #444444;
    stroke-width: max(0.1em, 1.5px);
    stroke-linecap: round;
    fill: transparent;
  }
</style>
