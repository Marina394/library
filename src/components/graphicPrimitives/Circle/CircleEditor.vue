<template>
  <div class="space-y-4 p-4 bg-white shadow rounded-lg">
    <div class="flex flex-col">
      <label for="radius" class="font-semibold">Радиус:</label>
      <input id="radius" type="number" v-model.number="radius" @input="updateShape" class="mt-1 p-2 border rounded">
    </div>

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

    <n-button class="w-full" @click="showModal = true">
      Связи
    </n-button>
  </div>



  <n-modal v-model:show="showModal" ref="modal">
    <n-card
        style="width: 80%"
        title="Связи"
        :bordered="true"
        size="huge"
    >
      <template #header-extra>
        <div class="centered">
          <n-button @click="saveBindings">Сохранить</n-button>
        </div>
      </template>

      <div class="flex">
        <BlocklyComponent ref="blockly" :shape="shape"/>
      </div>

      <template #footer>
      </template>
    </n-card>
  </n-modal>
</template>


<script>
import {NButton, NCard, NColorPicker, NIcon, NModal} from "naive-ui";
import {ArrowUpOutline, ArrowDownOutline} from "@vicons/ionicons5";
import {globalVariableStore} from "@/store/index.js";
import {ref} from "vue";
import DrawflowEditor from "@/components/DrawflowEditor.vue";
import BlocklyComponent from "@/components/BlocklyComponent.vue";
import ModalComponent from "@/components/common/ModalComponent.vue"; //  globalVariableStore.getters[`GET_GLOBAL_VARIABLES`]
/*
        globalVariables: {
            "systemState": { "type": "bool", "value": false },
            "temperature": { "type": "float", "value": 22.5 }
        }
 */

export default {
  components: {
    ModalComponent,
    BlocklyComponent,
    NCard, NModal, NIcon, NButton, NColorPicker, ArrowUpOutline, ArrowDownOutline},
  props: {
    shape: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      radius: this.shape.radius,
      fill: this.shape.fill,
      stroke: this.shape.stroke,
      strokeWidth: this.shape.strokeWidth,
      left: this.shape.left,
      top: this.shape.top,

      showModal: ref(false)
    };
  },
  methods: {
    updateShape() {
      this.shape.set({
        radius: this.radius,
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
    },

    saveBindings() {
      this.$refs.blockly.saveBindings();
    }
  }
}
</script>
