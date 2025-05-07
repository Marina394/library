<!-- ChartComponent.vue -->
<template>
    <button
      class="chart-component-button"
      draggable="true"
      @dragstart="handleDragStart"
    >
      График значений
    </button>
  </template>
  
  <script lang="ts">
  import { defineComponent } from 'vue';
  
  export default defineComponent({
    name: 'ChartComponent',
    methods: {
      handleDragStart(event: DragEvent) {
        event.dataTransfer?.setData('shape', 'chart-component');
      }
    }
  });
  </script>
  
  <style scoped>
  .chart-component-button {
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
  .chart-component-button:hover {
    background-color: #444;
  }
  </style>