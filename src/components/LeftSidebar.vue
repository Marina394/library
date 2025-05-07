<template>
  <div class="bg-gray-200 h-screen p-5">
    <!-- Добавляю переключатель -->
    <div class="p-4">
      <p>Переключатель:</p>
      <Switch v-model="isOn" />
      <p>Состояние: {{ isOn }}</p>
    </div>
    <n-collapse default-expanded-names="1">
      <n-collapse-item title="Простые фигуры" name="1">
        <div class="grid grid-cols-4 gap-4">
          <n-icon size="24" draggable="true" @dragstart="dragStart($event, 'circle')" class="mr-4">
            <EllipseOutline/>
          </n-icon>
          <n-icon size="24" draggable="true" @dragstart="dragStart($event, 'square')" class="mr-4">
            <TabletLandscapeOutline/>
          </n-icon>

          <n-icon size="24" draggable="true" @dragstart="dragStart($event, 'triangle')" class="mr-4">
            <TriangleOutline/>
          </n-icon>

          <n-icon size="24" draggable="true" @dragstart="dragStart($event, 'polygon')" class="mr-4">
            <GitCommitOutline/>
          </n-icon>

        </div>
      </n-collapse-item>
      

      <n-collapse-item title="Другие элементы" name="2">
        <div class="grid grid-cols-4 gap-4">
          <n-icon size="24" draggable="true" @dragstart="dragStart($event, 'vertical-indicator')" class="mr-4">
            <ReorderFourOutline/>
          </n-icon>

          <n-icon size="24" draggable="true" @dragstart="dragStart($event, 'start-button')" class="mr-4">
          <!-- тут нужно поставить иконку кнопки -->
            <ReorderFourOutline/>
          </n-icon>

          <n-icon size="24" draggable="true" @dragstart="dragStart($event, 'stop-button')" class="mr-4">
          <!-- тут нужно поставить иконку кнопки -->
            <ReorderFourOutline/>
          </n-icon>

          <n-icon size="24" draggable="true" @dragstart="dragStart($event, 'digital-indicator')" class="mr-4">
          <!-- тут нужно поставить иконку кнопки -->
            <ReorderFourOutline/>
          </n-icon>

          <n-icon size="24" draggable="true" @dragstart="dragStart($event, 'level-indicator')" class="mr-4">
          <!-- тут нужно поставить иконку кнопки -->
            <ReorderFourOutline/>
          </n-icon>

          <n-icon size="24" draggable="true" @dragstart="dragStart($event, 'chart-component')" class="mr-4">
          <!-- тут нужно поставить иконку кнопки -->
            <ReorderFourOutline/>
          </n-icon>

          <n-icon size="24" draggable="true" @dragstart="dragStart($event, 'speed-indicator')" class="mr-4">
          <!-- тут нужно поставить иконку кнопки -->
            <ReorderFourOutline/>
          </n-icon>

          <n-icon size="24" draggable="true" @dragstart="dragStart($event, 'text-status-indicator')" class="mr-4">
          <!-- тут нужно поставить иконку кнопки -->
            <ReorderFourOutline/>
          </n-icon>
          

          <n-icon size="24" draggable="true" @dragstart="dragStart($event, 'speedometer')" class="mr-4">
          <!-- тут нужно поставить иконку кнопки -->
            <ReorderFourOutline/>
          </n-icon>
          
          <n-icon size="24" draggable="true" @dragstart="dragStart($event, 'elevator')" class="mr-4">
          <!-- тут нужно поставить иконку кнопки -->
            <ReorderFourOutline/>
          </n-icon>

          <n-icon size="24" draggable="true" @dragstart="dragStart($event, 'traffic-light')" class="mr-4">
          <!-- тут нужно поставить иконку кнопки -->
            <ReorderFourOutline/>
          </n-icon>

          <n-icon size="24" draggable="true" @dragstart="dragStart($event, 'chart')" class="mr-4">
            <BarChartOutline/>
          </n-icon>

          <n-icon size="24" draggable="true" @dragstart="dragStart($event, 'toggle-button')" class="mr-4">
            <ToggleOutline />
          </n-icon>

          <n-icon size="24" draggable="true" @dragstart="dragStart($event, 'status-indicator')" class="mr-4">
            <InformationCircleOutline />
          </n-icon>

          <n-icon size="24" draggable="true" @dragstart="dragStart($event, 'value-tumbler')" class="mr-4">
            <SwapHorizontalOutline />
          </n-icon>

        </div>
      </n-collapse-item>
    </n-collapse>
  </div>
  <div class="p-4">
    <p>Переключатель:</p>
    <Switch v-model="isOn" />
    <p>Состояние: {{ isOn }}</p>
  </div>

</template>

<script>
import { ref } from 'vue';
import Switch from '@/components/ui/Switch.vue';

import {
  EllipseOutline, TabletLandscapeOutline, TriangleOutline, GitCommitOutline, ReorderFourOutline, BarChartOutline, ToggleOutline, InformationCircleOutline, SwapHorizontalOutline         
} from "@vicons/ionicons5";
import {NCollapse, NCollapseItem, NIcon} from "naive-ui";

export default {
  
  name: 'LeftSidebar',
  components: {
    NCollapse,
    NCollapseItem,
    NIcon,
    EllipseOutline,
    Switch,
    TabletLandscapeOutline,
    TriangleOutline,
    GitCommitOutline,
    ReorderFourOutline,
    BarChartOutline,
    ToggleOutline,                
    InformationCircleOutline,     
    SwapHorizontalOutline
  },
  setup() {
    const isOn = ref(false); // Добавляем состояние
    return { isOn };
  },
  methods: {
    dragStart(event, shape) {
      event.dataTransfer.setData("shape", shape);
    }
  },
}
</script>
