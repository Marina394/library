<template>
    <div :class="['status-indicator', status]"></div>
  </template>
  
  <script>
  export default {
    name: 'StatusIndicator',
    props: {
      status: {
        type: String,
        default: 'green', // Possible values: 'green', 'yellow', 'red'
      },
    },
  };
  </script>
  
  <style scoped>
  .status-indicator {
    width: 20px;
    height: 20px;
    border-radius: 50%;
    transition: background-color 0.3s;
  }
  .status-indicator.green {
    background-color: green;
  }
  .status-indicator.yellow {
    background-color: yellow;
  }
  .status-indicator.red {
    background-color: red;
  }
  </style>