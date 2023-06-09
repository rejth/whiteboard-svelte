<script lang="ts">
  export const path: { x: number; y: number }[] = [];

  const curve = [`M ${path[0].x} ${path[0].y}`];
  const collector = path.map((point) => `L ${point.x} ${point.y}`);
</script>

<rect class="figure-pen" d={curve.concat(collector).join(' ')} />

<style>
  .figure-pen {
    stroke: #444444;
    stroke-width: max(0.1em, 1.5px);
    stroke-linecap: round;
    fill: transparent;
  }
</style>
