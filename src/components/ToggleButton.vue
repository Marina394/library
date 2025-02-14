<template>
    <button 
      :class="{ 'on': isOn, 'off': !isOn }" 
      @click="toggle"
    >
      {{ isOn ? 'ON' : 'OFF' }}
    </button>
  </template>
  
  <script>
  export default {
    name: 'ToggleButton',
    data() {
      return {
        isOn: false,
      };
    },
    methods: {
      toggle() {
        this.isOn = !this.isOn;
        this.$emit('toggle', this.isOn);
      },
    },
  };
  </script>
  
  <style scoped>
  button {
    padding: 10px 20px;
    border: none;
    cursor: pointer;
    font-size: 16px;
    border-radius: 5px;
    transition: background-color 0.3s;
  }
  button.on {
    background-color: green;
    color: white;
  }
  button.off {
    background-color: red;
    color: white;
  }
  </style>
  