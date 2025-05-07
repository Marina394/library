<template>
    <button
      class="speed-indicator-button"
      draggable="true"
      @dragstart="handleDragStart"
    >
      Индикатор скорости
    </button>
  </template>
  
  <script lang="ts">
  import { defineComponent } from 'vue';
  
  export default defineComponent({
    name: 'SpeedIndicator',
    methods: {
      handleDragStart(event: DragEvent) {
        event.dataTransfer?.setData('shape', 'speed-indicator');
      }
    }
  });
  </script>
  
  <style scoped>
  .speed-indicator-button {
    padding: 10px;
    background-color: #333;
    color: #00ff00;
    border: 1px solid #00ff00;
    border-radius: 5px;
    font-size: 14px;
    cursor: grab;
    transition: background-color 0.3s;
    margin-top: 10px;
  }
  .speed-indicator-button:hover {
    background-color: #444;
  }
  </style>