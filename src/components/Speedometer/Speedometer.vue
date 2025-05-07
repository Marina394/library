<template>
    <button
      class="speedometer-button"
      draggable="true"
      @dragstart="handleDragStart"
    >
      Спидометр
    </button>
  </template>
  
  <script lang="ts">
  import { defineComponent } from 'vue';
  
  export default defineComponent({
    name: 'Speedometer',
    methods: {
      handleDragStart(event: DragEvent) {
        event.dataTransfer?.setData('shape', 'speedometer');
        event.dataTransfer?.setData('width', '200');
        event.dataTransfer?.setData('height', '200');
      }
    }
  });
  </script>
  
  <style scoped>
  .speedometer-button {
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
  .speedometer-button:hover {
    background-color: #444;
  }
  </style>