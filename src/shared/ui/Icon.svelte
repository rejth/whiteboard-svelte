<script>
  export let src = '';
  export let alt = "Icon";
</script>

<svelte:element 
  this="img" 
  src={src} 
  class={$$props.class}
  alt={alt} 
  on:click
/>

<style></style>