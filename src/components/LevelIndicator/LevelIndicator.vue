<template>
  <canvas ref="canvasEl" width="150" height="300" style="border:1px solid #ccc;"></canvas>
</template>

<script lang="ts" setup>
import { onMounted, ref, onBeforeUnmount } from 'vue';
import { fabric } from 'fabric';
import { LevelIndicatorShape } from './LevelIndicator';

const canvasEl = ref<HTMLCanvasElement | null>(null);
let levelIndicator: LevelIndicatorShape | null = null;

onMounted(() => {
  if (!canvasEl.value) return;

  const canvas = new fabric.Canvas(canvasEl.value, {
    selection: false,
    subTargetCheck: true, // Должно быть true
    backgroundColor: '#fff',
    preserveObjectStacking: true, // Добавить это
  });

  // Создаем индикатор с ползунком
  levelIndicator = new LevelIndicatorShape(
    canvas,
    60, // x
    50, // y
    0,  // min
    100, // max
    50   // initialValue
  );
});

onBeforeUnmount(() => {
  if (levelIndicator) {
    clearInterval(levelIndicator.intervalId); // Очищаем интервал
  }
});
</script>

<style scoped>
canvas {
  border-radius: 6px;
}
</style>