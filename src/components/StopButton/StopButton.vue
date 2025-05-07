<template>
    <button
      class="stop-button"
      draggable="true"
      @dragstart="handleDragStart"
    >
      СТОП
    </button>
  </template>
  
  <script lang="ts">
  import { defineComponent } from 'vue';
  
  export default defineComponent({
    name: 'StopButton',
    methods: {
      handleDragStart(event: DragEvent) {
        // При перетаскивании устанавливаем тип элемента,
        // чтобы CanvasComponent.vue знал, что создавать StopButtonShape.
        event.dataTransfer?.setData('shape', 'stop-button');
      }
    }
  });
  </script>
  
  <style scoped>
  .stop-button {
    padding: 10px 20px;
    background-color: #dc2626;
    color: #fff;
    border: none;
    border-radius: 5px;
    font-size: 16px;
    cursor: grab;
    transition: background-color 0.3s;
  }
  .stop-button:hover {
    background-color: #b91c1c;
  }
  </style>
  