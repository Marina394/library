<template>
  <div class="process-node">
    <input v-model.number="input1" type="number" @input="updateOutput" />
    <div class="output">{{ output }}</div>
  </div>
</template>

<script>
export default {
  name: 'ProcessNode',
  data() {
    return {
      input1: 0,
      output: 0
    };
  },
  methods: {
    updateOutput() {
      console.log('update output', this.input1);
      this.output = this.input1;
      this.$emit('output-update', this.output);
    }
  }
}
</script>
