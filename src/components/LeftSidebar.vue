<template>
  <div class="bg-gray-200 h-screen p-5">
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
</template>

<script>
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
    TabletLandscapeOutline,
    TriangleOutline,
    GitCommitOutline,
    ReorderFourOutline,
    BarChartOutline,
    ToggleOutline,                
    InformationCircleOutline,     
    SwapHorizontalOutline
  },
  methods: {
    dragStart(event, shape) {
      event.dataTransfer.setData("shape", shape);
    }
  },
}
</script>
