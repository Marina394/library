<template>
    <button 
      class="start-btn" 
      @click="handleClick"
    >
      Пуск
    </button>
  </template>
  
  <script>
  export default {
    name: 'StartButton',
    methods: {
      handleClick() {
        this.$emit('start', true); // Сообщаем родителю о нажатии
      },
    },
  };
  </script>
  
  <style scoped>
  .start-btn {
    padding: 12px 24px;
    background-color: green;
    color: white;
    font-weight: bold;
    border: none;
    border-radius: 5px;
    font-size: 16px;
    cursor: pointer;
    transition: background 0.2s;
  }
  .start-btn:hover {
    background-color: #047857;
  }
  .start-btn:active {
    background-color: #065f46;
  }
  </style>
  