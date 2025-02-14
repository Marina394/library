<template>
    <div class="value-tumbler">
      <button @click="decrease">-</button>
      <span>{{ value }}</span>
      <button @click="increase">+</button>
    </div>
  </template>
  
  <script>
  export default {
    name: 'ValueTumbler',
    props: {
      min: {
        type: Number,
        default: 0,
      },
      max: {
        type: Number,
        default: 100,
      },
      step: {
        type: Number,
        default: 1,
      },
    },
    data() {
      return {
        value: (this.min + this.max) / 2,
      };
    },
    methods: {
      increase() {
        if (this.value + this.step <= this.max) {
          this.value += this.step;
          this.$emit('input', this.value);
        }
      },
      decrease() {
        if (this.value - this.step >= this.min) {
          this.value -= this.step;
          this.$emit('input', this.value);
        }
      },
    },
  };
  </script>
  
  <style scoped>
  .value-tumbler {
    display: flex;
    align-items: center;
    gap: 10px;
  }
  button {
    padding: 5px 10px;
    border: none;
    cursor: pointer;
    font-size: 16px;
    border-radius: 5px;
    transition: background-color 0.3s;
  }
  button:hover {
    background-color: #ddd;
  }
  </style>