<template>
    <div class="number-input-field">
      <input
        ref="input"
        type="number"
        v-model.number="inputValue"
        @input="validateInput"
        class="number-input"
        placeholder="Введите число"
      >
      <button @click="handleSubmit" class="submit-button">
        OK
      </button>
    </div>
  </template>
  
  <script lang="ts">
  import { defineComponent, ref } from 'vue';
  
  export default defineComponent({
    name: 'NumberInputField',
    emits: ['submit'],
    setup(_, { emit }) {
      const inputValue = ref<number | null>(null);
      const maxLength = 5;
  
      const validateInput = () => {
        if (inputValue.value && inputValue.value.toString().length > maxLength) {
          inputValue.value = Number(inputValue.value.toString().slice(0, maxLength));
        }
      };
  
      const handleSubmit = () => {
        console.log('Отправлено число:', inputValue.value);
        emit('submit', inputValue.value);
      };
  
      return { inputValue, validateInput, handleSubmit };
    }
  });
  </script>
  
  <style scoped>
  .number-input-field {
    display: flex;
    align-items: center;
    gap: 10px;
  }
  
  .number-input {
    width: 120px;
    padding: 8px 12px;
    border: 1px solid #00aa50;
    border-radius: 6px;
    background: rgba(50, 50, 50, 0.9);
    color: #00ff00;
    font-size: 16px;
    outline: none;
  }
  
  .number-input:focus {
    border-color: #00ff80;
    box-shadow: 0 0 5px rgba(0, 255, 128, 0.5);
  }
  
  .submit-button {
    padding: 8px 16px;
    background: #00aa50;
    color: white;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    font-weight: bold;
    transition: background 0.2s;
  }
  
  .submit-button:hover {
    background: #008040;
  }
  
  .submit-button:active {
    transform: scale(0.95);
  }
  </style>