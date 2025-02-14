<template>
  <div class="bg-gray-200 h-screen p-5">
    <component :is="editorComponent" :shape="selectedObject" v-if="selectedObject"></component>
  </div>
</template>

<script>
import CircleEditor from "@/components/graphicPrimitives/Circle/CircleEditor.vue";
import RectangleEditor from "@/components/graphicPrimitives/Rectangle/RectangleEditor.vue";
import TriangleEditor from "@/components/graphicPrimitives/Triangle/TriangleEditor.vue";
import PolygonEditor from "@/components/graphicPrimitives/Polygon/PolygonEditor.vue"
import {useStore} from "vuex";

export default {
  name: 'RightSidebar',
  props: {
    selectedObject: Object
  },
  components: {
    CircleEditor,
    RectangleEditor,
    TriangleEditor,
    PolygonEditor
  },
  computed: {
    editorComponent() {


      if (!this.selectedObject) return null;
      console.log("EditorComponent", this.selectedObject.type);
      switch (this.selectedObject.type) {
        case 'circle':
          return 'CircleEditor';
        case 'rect':
          return 'RectangleEditor';
        case 'triangle':
          return 'TriangleEditor';
        case 'polygon':
          return 'PolygonEditor';
        default:
          return null;
      }
    }
  }
}
</script>
