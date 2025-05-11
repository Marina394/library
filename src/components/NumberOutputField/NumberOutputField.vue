<template>
    <div class="drag-item" draggable="true" @dragstart="onDragStart">
      <div class="item-label">Числовое поле (вывод)</div>
    </div>
  </template>
  
  <script lang="ts">
  export default {
    name: 'NumberOutputField',
    methods: {
      onDragStart(event: DragEvent) {
        event.dataTransfer?.setData('shape', 'number-output-field');
      }
    }
  };
  </script>
  
  <style scoped>
  .drag-item {
    background: #1a1a1a;
    color: #00ffaa;
    border: 1px solid #00ffaa;
    padding: 8px 12px;
    border-radius: 6px;
    cursor: grab;
    font-family: monospace;
    user-select: none;
    margin: 6px 0;
    box-shadow: 0 0 5px #00ffaa;
    transition: 0.2s;
  }
  .drag-item:hover {
    background: #222;
    box-shadow: 0 0 8px #00ffaa;
  }
  </style>
  