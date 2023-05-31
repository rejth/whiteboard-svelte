<script>
  export let src = '';
  export let alt = 'Icon';
</script>

<svelte:element this="img" {src} class={$$props.class} {alt} on:click on:keydown />

<style></style>
