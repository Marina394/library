<template>
    <div class="drag-item" draggable="true" @dragstart="onDragStart">
      🚦 Светофор
    </div>
  </template>
  
  <script setup lang="ts">
  const emit = defineEmits<{
    (e: 'drag-start', shape: string): void
  }>();
  
  function onDragStart(e: DragEvent) {
    e.dataTransfer?.setData('shape', 'traffic-light');
    emit('drag-start', 'traffic-light');
  }
  </script>
  
  <style scoped>
  .drag-item {
    background: #111;
    color: #00ffff;
    padding: 6px 12px;
    border-radius: 6px;
    box-shadow: 0 0 12px rgba(0, 255, 255, 0.4);
    cursor: grab;
    user-select: none;
  }
  </style>
  