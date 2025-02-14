<template>
  <div class="process-node">
    <input v-model.number="input1" type="number" />
    <div class="output">{{ output }}</div>
  </div>
</template>

<script>
export default {
  name: 'TmpNode',
  data() {
    return {
      input1: 0,
      output: 0
    };
  },
  methods: {
  }
}
</script>
