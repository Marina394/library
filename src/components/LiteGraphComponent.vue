<template>
  <canvas width='1280' height='720' style='border: 1px solid' ref="litegraph"></canvas>
</template>

<script setup>
import { onMounted, ref, watch } from 'vue';
import { LGraph, LGraphCanvas, LiteGraph } from 'litegraph.js';
import { defineProps, defineEmits } from 'vue';

const props = defineProps({
  variables: Object, // Словарь переменных { название: тип }
  initialGraphConfig: Object // Начальная конфигурация графа в JSON
});

const emits = defineEmits(['updateGraph']);

const litegraph = ref(null);

onMounted(() => {
  const graph = new LGraph();
  const graphCanvas = new LGraphCanvas(litegraph.value, graph);

  // Настройка начального состояния графа, если оно предоставлено
  if (props.initialGraphConfig) {
    graph.configure(props.initialGraphConfig);
  }

  // Создание узлов на основе переданных переменных
  Object.entries(props.variables).forEach(([name, type], index) => {
    const node_const = LiteGraph.createNode("basic/const");
    node_const.pos = [50, 100 + index * 100]; // Простое расположение узлов
    graph.add(node_const);
    node_const.setProperty("name", name);
    node_const.setValue(0); // Установите начальное значение, если нужно
  });

  graph.start();
  emits('updateGraph', graph.serialize()); // Эмит конфигурации графа
});

// Отслеживание изменений в пропсах
watch(() => props.variables, (newVal, oldVal) => {
  // Здесь можно добавить логику для обновления узлов графа
}, { deep: true });

</script>

<style>
</style>
