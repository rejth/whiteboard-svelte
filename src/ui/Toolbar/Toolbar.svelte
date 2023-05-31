<script lang="ts">
  import { Icon } from '~/shared/ui';
  import { canvasModel } from '~/ui/Canvas';
  import { toolbarModel, Tools, type Tool } from '~/ui/Toolbar';

  import noteIcon from './assets/note.svg';
  import textIcon from './assets/text.svg';
  import areaIcon from './assets/area.svg';
  import panIcon from './assets/pan.svg';
  import trashIcon from './assets/trash.svg';

  const { tool, disableDeletion } = toolbarModel;

  $: tools = [
    {
      label: 'Note',
      type: Tools.NOTE,
      icon: noteIcon,
      hoverText: 'Drag to add new text note',
    },
    {
      label: 'Text',
      type: Tools.TEXT,
      icon: textIcon,
      hoverText: 'Drag to add new text area',
    },
    {
      label: 'Area',
      type: Tools.AREA,
      icon: areaIcon,
      hoverText: 'Drag to add new area for organizing items',
    },
    {
      label: 'Pan',
      type: Tools.PAN,
      icon: panIcon,
      hoverText: 'Pan tool',
    },
    {
      label: 'Delete',
      type: Tools.DELETE,
      icon: trashIcon,
      hoverText: 'Delete selected item(s)',
      disabled: $disableDeletion,
    },
  ];

  const handleClick = (type: Tool) => {
    if (type === Tools.DELETE) {
      canvasModel.deleteShape();
      return;
    }
    toolbarModel.changeTool(type);
  };
</script>

<ul class="toolbar" id="toolbar">
  {#each tools as { label, type, icon, hoverText, ...options }}
    <li>
      <span class="tool">
        <span
          class="icon"
          class:active={$tool === type}
          class:disabled={options?.disabled}
          title={hoverText}
        >
          <Icon src={icon} alt={label} on:click={() => handleClick(type)} />
        </span>
        <span class="text">{label}</span>
      </span>
    </li>
  {/each}
</ul>

<style>
  .toolbar {
    position: fixed;
    top: 3rem;
    left: 50%;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;

    padding: 0.5em 0.4em 0.2em;
    box-shadow: 0 2px 6px 0 #00263a0f;
    background-color: #ffffff;

    border: 2px solid #f4f4f6;
    border-radius: 6px;
    transform: translateX(-50%);
    pointer-events: all;
  }

  .tool {
    position: relative;
    display: inline-flex;
    flex-direction: column;
    align-items: center;
    margin: 0 0.2em 0.2em;
  }

  .icon {
    font-size: 1em !important;
    display: inline-block;
    width: 4em;
    min-width: 2em;
    height: 4em;
    padding: 0.5em 0.5rem;
    margin: 0;
    cursor: pointer;
    background-size: contain;
    background-repeat: no-repeat;
  }

  .disabled {
    color: #d3d3d3;
    pointer-events: none;
  }

  .active {
    background-color: #f4f4f6;
  }

  .text {
    font-size: 0.8em;
    margin: 0;
    margin-top: 0.5em;
    text-align: center;
  }
</style>
