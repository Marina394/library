<template>
  <div class="h-full w-full" ref="canvasWrapper" @dragover.prevent @drop="handleDrop">
    <canvas id="canvas"></canvas>
  </div>
</template>

<script>
import {fabric} from 'fabric';
import {CircleShape} from "@/components/graphicPrimitives/Circle/circle.ts";
import {RectangleShape} from "@/components/graphicPrimitives/Rectangle/rectangle.ts";
import {PolygonShape} from "@/components/graphicPrimitives/Polygon/polygon.ts";
import {TriangleShape} from "@/components/graphicPrimitives/Triangle/triangle.ts";
import {install} from 'chart-js-fabric'

install(fabric)

import {VerticalIndicator} from "@/components/baseElements/VerticalIndicator/VerticalIndicator.ts";
import { ToggleButtonShape } from '@/components/ToggleButton.ts';
import { StatusIndicatorShape } from '@/components/StatusIndicator.ts';
import { ValueTumblerShape } from '@/components/ValueTumbler.ts';


export default {
  data() {
    return {
      isSpacePressed: false
    };
  },
  mounted() {
    this.initializeCanvas();


  },
  methods: {
    initializeCanvas() {
      const wrapper = this.$refs.canvasWrapper;
      this.canvas = new fabric.Canvas('canvas', {
        width: wrapper.offsetWidth,
        height: wrapper.offsetHeight,
      });

      this.canvas.on('selection:created', (event) => {
        this.$emit('update:selectedObject', event.selected[0]);
      });

      this.canvas.on('selection:updated', (event) => {
        this.$emit('update:selectedObject', event.selected[0]);
      });

      this.canvas.on('selection:cleared', () => {
        console.log("Selection cleared");
        this.$emit('update:selectedObject', null);
      });

      // Прокрутка колёсика мыши для масштабирования
      this.canvas.on('mouse:wheel', (opt) => {
        const delta = opt.e.deltaY;
        let zoom = this.canvas.getZoom();
        zoom *= 0.999 ** delta;
        if (zoom > 20) zoom = 20;
        if (zoom < 0.01) zoom = 0.01;
        this.canvas.zoomToPoint({x: opt.e.offsetX, y: opt.e.offsetY}, zoom);
        opt.e.preventDefault();
        opt.e.stopPropagation();

      });

      // Перетаскивание холста при зажатом SPACE
      this.canvas.on('mouse:down', (opt) => {
        if (this.isSpacePressed && opt.e.button === 0) {
          this.canvas.isDragging = true;
          this.canvas.selection = false;
          this.canvas.lastPosX = opt.e.clientX;
          this.canvas.lastPosY = opt.e.clientY;
        }
      });

      this.canvas.on('mouse:move', (opt) => {
        if (this.canvas.isDragging) {
          let e = opt.e;
          this.canvas.relativePan({x: e.clientX - this.canvas.lastPosX, y: e.clientY - this.canvas.lastPosY});
          this.canvas.lastPosX = e.clientX;
          this.canvas.lastPosY = e.clientY;

        }
      });

      this.canvas.on('mouse:up', () => {
        this.canvas.isDragging = false;
        this.canvas.selection = true;
      });

      // Обработчики нажатий клавиш
      document.addEventListener('keydown', (e) => {
        if (e.code === 'Space') {
          this.isSpacePressed = true;
        }
      });

      document.addEventListener('keyup', (e) => {
        if (e.code === 'Space') {
          this.isSpacePressed = false;
        }
      });
    },


    handleDrop(event) {
      const shape = event.dataTransfer.getData("shape");
      const rect = this.canvas.lowerCanvasEl.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;

      switch (shape) {
        case 'circle':
          new CircleShape(this.canvas, x, y);
          break;
        case 'square':
          new RectangleShape(this.canvas, x, y);
          console.log(JSON.stringify(this.canvas.toJSON(), null, 2));
          break;
        case 'triangle':
          new TriangleShape(this.canvas, x, y);
          break;
        case 'polygon':
          new PolygonShape(this.canvas, x, y);
          break;
        case 'vertical-indicator':
          new VerticalIndicator(this.canvas, x, y);
          break;

        case 'toggle-button':
          const toggleButton = new fabric.Rect({
            left: x,
            top: y,
            width: 120,
            height: 50,
            fill: 'green',
            rx: 10,
            ry: 10,
            stroke: 'black',
            strokeWidth: 2,
          });

          const toggleText = new fabric.Text('ON', {
            fontSize: 18,
            fill: 'white',
            originX: 'center',
            originY: 'center',
          });

          const group = new fabric.Group([toggleButton, toggleText], {
            left: x,
            top: y,
          });

          group.on('mousedown', () => {
            const isOn = toggleButton.fill === 'green';
            toggleButton.set('fill', isOn ? 'red' : 'green');
            toggleText.set('text', isOn ? 'OFF' : 'ON');
            this.canvas.renderAll();
          });

          this.canvas.add(group);
          break;

        case 'status-indicator':
          const statusIndicator = new StatusIndicatorShape(this.canvas, x, y);
          this.canvas.add(statusIndicator);
          break;


        case 'value-tumbler':
          const tumblerBackground = new fabric.Rect({
            width: 150,
            height: 50,
            fill: 'gray',
            stroke: 'black',
            strokeWidth: 2,
            rx: 10,
            ry: 10,
          });

          const tumblerText = new fabric.Text('Value: 0', {
            fontSize: 16,
            fill: 'white',
            left: x + 20,
            top: y + 15,
            originX: 'center',
            originY: 'center',
          });

          const tumblerGroup = new fabric.Group([tumblerBackground, tumblerText], {
            left: x,
            top: y,
          });

          tumblerGroup.on('mousedown', () => {
            const currentValue = parseInt(tumblerText.text.replace('Value: ', ''), 10) || 0;
            const newValue = currentValue + 1; // Увеличиваем значение
            tumblerText.set('text', `Value: ${newValue}`);
            this.canvas.renderAll();
          });

          this.canvas.add(tumblerGroup);
          break;
  

        case 'chart':
          // TODO: Separate! Use: https://github.com/yassilah/chart-js-fabric/issues/4
          this.canvas.add(new fabric.Chart({
            width: 100,
            height: 100,
            chart: {
              type: 'bar',
              data: {
                labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
                datasets: [
                  {
                    label: '# of Votes',
                    data: [Math.random(), Math.random()],
                    backgroundColor: ['rgba(255, 99, 132, 0.2)', 'rgba(54, 162, 235, 0.2)']
                  }
                ]
              }
            }
          }))
          break;
      }
    },
  }
}
</script>