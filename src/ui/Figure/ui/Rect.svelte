<script lang="ts">
  export const path: { x: number; y: number }[] = [];

  const rect = {
    x: path[0].x,
    y: path[0].y,
    width: path[path.length - 1].x - path[0].x,
    height: path[path.length - 1].y - path[0].y,
  };
</script>

<rect class="figure-rect" {...rect} />

<style>
  .figure-rect {
    stroke: #444444;
    stroke-width: max(0.1em, 1.5px);
    stroke-linecap: round;
    fill: transparent;
  }
</style>
