<template>
  <div class="addition-node">
    <input v-model.number="input1" type="number" @input="updateOutput" />
    <input v-model.number="input2" type="number" @input="updateOutput" />
    <div class="output">{{ output }}</div>
  </div>
</template>

<script>
export default {
  name: 'AdditionNode',
  data() {
    return {
      input1: 0,
      input2: 0,
      output: 0
    };
  },
  methods: {
    updateOutput() {
      console.log('update output', this.input1, this.input2);
      this.output = this.input1 + this.input2;
      this.$emit('output-update', this.output);
    }
  }
}
</script>
