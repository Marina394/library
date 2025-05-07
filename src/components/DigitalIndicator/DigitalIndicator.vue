<template>
    <button
      class="digital-indicator-button"
      draggable="true"
      @dragstart="handleDragStart"
    >
      Цифровой индикатор
    </button>
  </template>
  
  <script lang="ts">
  import { defineComponent } from 'vue';
  export default defineComponent({
    name: 'DigitalIndicator',
    methods: {
      handleDragStart(event: DragEvent) {
        // При перетаскивании устанавливаем тип элемента,
        // чтобы в CanvasComponent.vue создать нужный объект
        event.dataTransfer?.setData('shape', 'digital-indicator');
      }
    }
  });
  </script>
  
  <style scoped>
  .digital-indicator-button {
    padding: 10px;
    background-color: #333;
    color: #00ff00;
    border: 1px solid #00ff00;
    border-radius: 5px;
    font-size: 14px;
    cursor: grab;
    transition: background-color 0.3s;
  }
  .digital-indicator-button:hover {
    background-color: #444;
  }
  </style>
  