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
import { nextTick } from 'vue';


install(fabric)

import {VerticalIndicator} from "@/components/baseElements/VerticalIndicator/VerticalIndicator.ts";
import { ToggleButtonShape } from '@/components/ToggleButton.ts';
import { StatusIndicatorShape } from '@/components/StatusIndicator/StatusIndicator.ts';
import { StartButtonShape } from '@/components/StartButton/StartButton.ts';
import { StopButtonShape } from '@/components/StopButton/StopButton.ts';
import { DigitalIndicatorShape } from '@/components/DigitalIndicator/DigitalIndicator.ts';
import { LevelIndicatorShape } from '@/components/LevelIndicator/LevelIndicator.ts';
import { ChartComponentShape } from '@/components/ChartComponent/ChartComponent.ts';
import { SpeedIndicatorShape } from '@/components/SpeedIndicator/SpeedIndicator.ts';
import { SpeedometerShape } from '@/components/Speedometer/Speedometer.ts';
import { Elevator } from '@/components/Elevator/Elevator.ts';
import { TrafficLight } from '@/components/TrafficLight/TrafficLight.ts';
import { TextStatusIndicatorShape } from '@/components/TextStatusIndicator/TextStatusIndicator.ts';


import { ValueTumblerShape } from '@/components/ValueTumbler.ts';


export default {
  data() {
    return {
      isSpacePressed: false,
      elevatorCount: 1 
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

      const width = event.dataTransfer.getData("width") || '150'; // Значение по умолчанию 150
      const height = event.dataTransfer.getData("height") || '200'; // Значение по умолчанию 200



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

        case 'stop-button':
          new StopButtonShape(this.canvas, x, y);
          break;
        case 'start-button':
          new StartButtonShape(this.canvas, x, y);
          break;

        case 'level-indicator':
          new LevelIndicatorShape(this.canvas, x, y);
          break;
          
        case 'digital-indicator':
          const indicator = new DigitalIndicatorShape(this.canvas, x, y, 0);
          nextTick(() => {
            // чтобы Vue не запутался — всё уже в DOM
            this.canvas.requestRenderAll();
          });
          break;

        case 'chart-component':
          new ChartComponentShape(this.canvas, x, y);
          break;

        case 'speed-indicator':
          new SpeedIndicatorShape(this.canvas, x, y);
          break;

        case 'speedometer':
          new SpeedometerShape(this.canvas, x, y);
          break;

        case 'elevator':
          const elevator = new Elevator(
            this.canvas,
            x - 85,
            y - 100,
            this.elevatorCount++
          );
          
          // Обработчик перемещения
          this.canvas.on('object:moving', (e) => {
            if (e.target === elevator.group) {
              const left = e.target.left || 0;
              const top = e.target.top || 0;
              elevator.setPosition(left, top);
            }
          });
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


      
        case 'text-status-indicator':
          new TextStatusIndicatorShape(this.canvas, x, y);
          break;

        case 'traffic-light':
          const trafficLight = new TrafficLight(
            this.canvas,
            x - 40,
            y - 100,
            this.trafficLightCount++
          );
          
          this.canvas.on('object:moving', (e) => {
            if (e.target === trafficLight.group) {
              trafficLight.setPosition(e.target.left || 0, e.target.top || 0);
            }
          });
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