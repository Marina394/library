<template>
  <div class="container">
    <header class="header">
      <h3>Drawflow Example vue3</h3>
      <button type="button" class="primary-button" @click="exportEditor">Export</button>
    </header>
    <div class="container">
      <aside class="sidebar" style="width: 250px;">
        <ul>
          <li v-for="n in listNodes" :key="n" draggable="true" :data-node="n.item" @dragstart="drag($event)" class="draggable-item">
            <div class="node" :style="{background: n.color}">{{ n.name }}</div>
          </li>
        </ul>
      </aside>
      <main>
        <div id="drawflow" @drop="drop($event)" @dragover="allowDrop($event)"></div>
      </main>
    </div>
  </div>
  <dialog :open="dialogVisible" title="Export" style="width: 50%;">
    <span>Data:</span>
    <pre><code>{{dialogData}}</code></pre>
    <div slot="footer" class="dialog-footer">
      <button @click="dialogVisible = false">Cancel</button>
      <button type="button" class="primary-button" @click="dialogVisible = false">Confirm</button>
    </div>
  </dialog>
</template>

<script>

import Drawflow from 'drawflow'
import 'drawflow/dist/drawflow.min.css'
import  '../assets/style.css'
import { onMounted, shallowRef, h, getCurrentInstance, render, readonly, ref } from 'vue'
import Node1 from '@/components/nodes/Node1.vue'
import Node2 from '@/components/nodes/Node2.vue'
import Node3 from '@/components/nodes/Node3.vue'



export default {
  name: 'drawflow',
  setup() {
    const listNodes = readonly([
      {
        name: 'Get/Post',
        color: '#49494970',
        item: 'Node1',
        input:0,
        output:1
      },
      {
        name: 'Script',
        color: 'blue',
        item: 'Node2',
        input:1,
        output:2
      },
      {
        name: 'console.log',
        color: '#ff9900',
        item: 'Node3',
        input:1,
        output:0
      },
    ])

    const editor = shallowRef({})
    const dialogVisible = ref(false)
    const dialogData = ref({})
    const Vue = { version: 3, h, render };
    const internalInstance = getCurrentInstance()
    internalInstance.appContext.app._context.config.globalProperties.$df = editor;

    function exportEditor() {
      dialogData.value = editor.value.export();
      dialogVisible.value = true;
    }

    const drag = (ev) => {
      if (ev.type === "touchstart") {
        mobile_item_selec = ev.target.closest(".drag-drawflow").getAttribute('data-node');
      } else {
        ev.dataTransfer.setData("node", ev.target.getAttribute('data-node'));
      }
    }
    const drop = (ev) => {
      if (ev.type === "touchend") {
        var parentdrawflow = document.elementFromPoint( mobile_last_move.touches[0].clientX, mobile_last_move.touches[0].clientY).closest("#drawflow");
        if(parentdrawflow != null) {
          addNodeToDrawFlow(mobile_item_selec, mobile_last_move.touches[0].clientX, mobile_last_move.touches[0].clientY);
        }
        mobile_item_selec = '';
      } else {
        ev.preventDefault();
        var data = ev.dataTransfer.getData("node");
        addNodeToDrawFlow(data, ev.clientX, ev.clientY);
      }

    }
    const allowDrop = (ev) => {
      ev.preventDefault();
    }

    let mobile_item_selec = '';
    let mobile_last_move = null;
    function positionMobile(ev) {
      mobile_last_move = ev;
    }

    function addNodeToDrawFlow(name, pos_x, pos_y) {
      pos_x = pos_x * ( editor.value.precanvas.clientWidth / (editor.value.precanvas.clientWidth * editor.value.zoom)) - (editor.value.precanvas.getBoundingClientRect().x * ( editor.value.precanvas.clientWidth / (editor.value.precanvas.clientWidth * editor.value.zoom)));
      pos_y = pos_y * ( editor.value.precanvas.clientHeight / (editor.value.precanvas.clientHeight * editor.value.zoom)) - (editor.value.precanvas.getBoundingClientRect().y * ( editor.value.precanvas.clientHeight / (editor.value.precanvas.clientHeight * editor.value.zoom)));

      const nodeSelected = listNodes.find(ele => ele.item == name);
      editor.value.addNode(name, nodeSelected.input,  nodeSelected.output, pos_x, pos_y, name, {}, name, 'vue');

    }


    onMounted(() => {

      var elements = document.getElementsByClassName('drag-drawflow');
      for (var i = 0; i < elements.length; i++) {
        elements[i].addEventListener('touchend', drop, false);
        elements[i].addEventListener('touchmove', positionMobile, false);
        elements[i].addEventListener('touchstart', drag, false );
      }

      const id = document.getElementById("drawflow");
      editor.value = new Drawflow(id, Vue, internalInstance.appContext.app._context);
      editor.value.start();

      editor.value.registerNode('Node1', Node1, {}, {});
      editor.value.registerNode('Node2', Node2, {}, {});
      editor.value.registerNode('Node3', Node3, {}, {});

      editor.value.import({"drawflow":{"Home":{"data":{"5":{"id":5,"name":"Node2","data":{"script":"(req,res) => {\n console.log(req);\n}"},"class":"Node2","html":"Node2","typenode":"vue","inputs":{"input_1":{"connections":[{"node":"6","input":"output_1"}]}},"outputs":{"output_1":{"connections":[]},"output_2":{"connections":[]}},"pos_x":1000,"pos_y":117},"6":{"id":6,"name":"Node1","data":{"url":"localhost/add", "method": "post"},"class":"Node1","html":"Node1","typenode":"vue","inputs":{},"outputs":{"output_1":{"connections":[{"node":"5","output":"input_1"}]}},"pos_x":137,"pos_y":89}}}}})
    })

    return {
      exportEditor, listNodes, drag, drop, allowDrop, dialogVisible, dialogData
    }

  }
}

</script>
<style scoped>
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #494949;
}
.container {
  min-height: calc(100vh - 100px);
}
.column {
  border-right: 1px solid #494949;
}
.column ul {
  padding-inline-start: 0px;
  padding: 10px 10px;

}
.column li {
  background: transparent;
}

.node {
  border-radius: 8px;
  border: 2px solid #494949;
  display: block;
  height:60px;
  line-height:40px;
  padding: 10px;
  margin: 10px 0px;
  cursor: move;

}
#drawflow {
  width: 100%;
  height: 500px;
  text-align: initial;
  background: #2b2c30;
  background-size: 20px 20px;
  background-image: radial-gradient(#494949 1px, transparent 1px);

}
</style>