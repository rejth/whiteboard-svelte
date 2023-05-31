<script lang="ts">
  import { Moveable, Toolbar, Canvas } from '../ui';
  import './App.css';
</script>

<div class="board" role="button" tabIndex={0}>
  <div class="content-wrapper">
    <div class="scroll-wrapper">
      <Canvas />
    </div>
    <div class="tools-wrapper">
      <Toolbar />
    </div>
  </div>
</div>

<style>
  .board {
    display: flex;
    flex-direction: column;
    width: 100%;
    height: calc(100vh - 2em);
    box-sizing: border-box;
  }

  .content-wrapper {
    position: relative;
    flex-grow: 1;
    height: 80%;
    margin-top: 2.4rem;
  }

  .scroll-wrapper {
    height: 100%;
    overflow: auto;
    background-color: #F4F4F6;
  }

  .tools-wrapper {
    position: absolute;
    top: 0;
    padding: 0;
    margin: 0;
    width: 100%;
    height: 100%;
    z-index: 400000010;
    pointer-events: none;
  }
</style>
