<template>
  <div class="space-y-4 p-4 bg-white shadow rounded-lg">
    <div class="flex flex-col">
      <label for="fill" class="font-semibold">Цвет заливки:</label>
      <n-color-picker v-model:value="fill" @update:value="updateShape" class="mt-1"/>
    </div>

    <div class="flex flex-col">
      <label for="stroke" class="font-semibold">Цвет обводки:</label>
      <n-color-picker v-model:value="stroke" @update:value="updateShape" class="mt-1"/>
    </div>

    <div class="flex flex-col">
      <label for="strokeWidth" class="font-semibold">Толщина обводки:</label>
      <input id="strokeWidth" type="number" v-model.number="strokeWidth" @input="updateShape"
             class="mt-1 p-2 border rounded">
    </div>

    <div class="flex flex-col">
      <label for="left" class="font-semibold">Позиция X (left):</label>
      <input id="left" type="number" v-model.number="left" @input="updateShape" class="mt-1 p-2 border rounded">
    </div>

    <div class="flex flex-col">
      <label for="top" class="font-semibold">Позиция Y (top):</label>
      <input id="top" type="number" v-model.number="top" @input="updateShape" class="mt-1 p-2 border rounded">
    </div>

    <div class="flex justify-between mt-4">
      <n-button text tertiary @click="bringForward" class="flex items-center justify-center">
        <template #icon>
          <n-icon>
            <ArrowUpOutline/>
          </n-icon>
        </template>
        Вперёд
      </n-button>

      <n-button text tertiary @click="sendBackward" class="flex items-center justify-center">
        <template #icon>
          <n-icon>
            <ArrowDownOutline/>
          </n-icon>
        </template>
        Назад
      </n-button>
    </div>
  </div>
</template>


<script>
import {NButton, NColorPicker, NIcon} from "naive-ui";
import {ArrowUpOutline, ArrowDownOutline} from "@vicons/ionicons5";

export default {
  components: {NIcon, NButton, NColorPicker, ArrowUpOutline, ArrowDownOutline},
  props: {
    shape: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      fill: this.shape.fill,
      stroke: this.shape.stroke,
      strokeWidth: this.shape.strokeWidth,
      left: this.shape.left,
      top: this.shape.top
    };
  },
  methods: {
    updateShape() {
      this.shape.set({ 
        fill: this.fill,
        stroke: this.stroke,
        strokeWidth: this.strokeWidth,
        left: this.left,
        top: this.top
      });
      this.shape.canvas.requestRenderAll();
    },
    bringForward() {
      if (this.shape.canvas) {
        this.shape.canvas.bringForward(this.shape);
      }
    },
    sendBackward() {
      if (this.shape.canvas) {
        this.shape.canvas.sendBackwards(this.shape);
      }
    }
  }
}
</script>
