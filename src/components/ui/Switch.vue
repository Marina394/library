<script setup>
import { defineProps, defineEmits } from 'vue';

const props = defineProps({ modelValue: Boolean });
const emit = defineEmits(['update:modelValue']);

const toggle = () => {
  emit('update:modelValue', !props.modelValue);
};
</script>

<template>
  <button @click="toggle"
    class="w-12 h-6 rounded-full flex items-center transition-all"
    :class="modelValue ? 'bg-green-500' : 'bg-gray-300'">
    <span class="w-5 h-5 bg-white rounded-full shadow transition-all transform"
      :class="modelValue ? 'translate-x-6' : 'translate-x-0'">
    </span>
  </button>
</template>
