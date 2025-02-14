<template>
  <div class="flex h-screen">
    <div class="w-64 flex-shrink-0">
      <LeftSidebar />
    </div>
    <div class="flex-grow">
      <CanvasComponent ref="canvasComponent" @update:selectedObject="handleSelectedObject" />
    </div>
    <div class="w-64 flex-shrink-0">
      <RightSidebar :selectedObject="selectedObject" />
    </div>
  </div>
</template>

<script>
import { ref, onMounted, onUnmounted } from 'vue';
import LeftSidebar from './components/LeftSidebar.vue';
import CanvasComponent from './components/CanvasComponent.vue';
import RightSidebar from './components/RightSidebar.vue';
import { useStore } from 'vuex';

export default {
  name: 'App',
  components: {
    LeftSidebar,
    CanvasComponent,
    RightSidebar
  },
  setup() {
    const store = useStore();
    const selectedObject = ref(null);
    const websocket = ref(null);

    const handleWebSocketMessage = (event) => {
      const data = JSON.parse(event.data);

      store.dispatch('UPDATE_GLOBAL_VARIABLES', data);

      // if (data.temperature) {
      //   store.dispatch('UPDATE_GLOBAL_VARIABLE', {
      //     variableName: 'temperature',
      //     newValue: data.temperature
      //   });
      // }
//
      // if (data.systemState) {
      //   store.dispatch('UPDATE_GLOBAL_VARIABLE', {
      //     variableName: 'systemState',
      //     newValue: data.systemState
      //   });
      // }
    };

    const handleSelectedObject = (event) => {
      console.log('CanvasComponent!', event);
      selectedObject.value = event;
    };

    onMounted(() => {
      websocket.value = new WebSocket("ws://localhost:8000/ws");
      websocket.value.onmessage = handleWebSocketMessage;
      websocket.value.onopen = () => console.log("WebSocket connected");
      websocket.value.onerror = (error) => console.error("WebSocket error:", error);
      websocket.value.onclose = () => console.log("WebSocket disconnected");
    });

    onUnmounted(() => {
      if (websocket.value) {
        websocket.value.close();
      }
    });

    return {
      selectedObject,
      handleSelectedObject
    };
  }
}
</script>
