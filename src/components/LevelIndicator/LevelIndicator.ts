import { fabric } from 'fabric';

export class LevelIndicatorShape {
  group: fabric.Group;
  slider: fabric.Rect;
  bar: fabric.Rect;
  intervalId: number;

  private canvas: fabric.Canvas;
  private min: number;
  private max: number;
  private value: number;
  private height: number;

  constructor(
    canvas: fabric.Canvas,
    x: number,
    y: number,
    min: number = 0,
    max: number = 100,
    initialValue: number = 0
  ) {
    this.canvas = canvas;
    this.min = min;
    this.max = max;
    this.value = initialValue;
    this.height = 200; // Фиксированная высота индикатора

    const width = 30;

    // Фон с градиентом
    const background = new fabric.Rect({
      width,
      height: this.height,
      fill: new fabric.Gradient({
        type: 'linear',
        gradientUnits: 'pixels',
        coords: { x1: 0, y1: 0, x2: 0, y2: this.height },
        colorStops: [
          { offset: 0, color: 'rgba(20,20,20,0.95)' },
          { offset: 1, color: 'rgba(50,50,50,0.95)' },
        ],
      }),
      rx: 10,
      ry: 10,
      selectable: false,
    });

    // Заливка (bar)
    this.bar = new fabric.Rect({
      width,
      height: 0,
      fill: '#00ff00',
      top: this.height, // Начинаем снизу
      originY: 'bottom',
      selectable: false,
      shadow: new fabric.Shadow({
        color: 'rgba(0,255,0,0.5)',
        blur: 25,
        offsetX: 0,
        offsetY: 0,
      }),
    });

    // Ползунок (slider)
    this.slider = new fabric.Rect({
      width: 30,
      height: 8, // Узкий прямоугольник
      fill: '#fff',
      stroke: '#00ff00',
      strokeWidth: 2,
      left: width / 2,
      evented: true,
      top: this.height,
      originX: 'center',
      originY: 'center',
      hasBorders: false,
      hasControls: false,
      shadow: new fabric.Shadow({
        color: 'rgba(0,255,0,0.9)',
        blur: 12,
        offsetX: 0,
        offsetY: 0,
      }),
      
      rx: 2, // Закругленные углы
      ry: 2,
    });

    // Разметка делений
    const markers = [];
    for (let i = 0; i <= 10; i++) {
      const markerY = this.height - (i * this.height) / 10;
      markers.push(
        new fabric.Line([0, markerY, width, markerY], {
          stroke: '#555',
          strokeWidth: 1,
          selectable: false,
        })
      );
    }

    // Группируем элементы
    this.group = new fabric.Group(
      [background, this.bar, ...markers, this.slider],
      {
        left: x,
        top: y,
        hasControls: false,
        hasBorders: false,
      }
    );

    this.canvas.add(this.group);
    this.updateVisual(initialValue);
    this.makeInteractive();

    this.fetchFromServer();
    this.intervalId = window.setInterval(() => this.fetchFromServer(), 3000);
  }

  updateVisual(value: number) {
    const clamped = Math.min(this.max, Math.max(this.min, value));
    const percent = (clamped - this.min) / (this.max - this.min);
    const barHeight = this.height * percent;

    this.bar.set({
      height: barHeight,
    });

    // Корректируем позицию прямоугольного ползунка
    this.slider.set({
      top: this.height - barHeight - this.slider.height! * 13, // Центрирование по высоте
    });

    this.value = clamped;
    this.canvas.requestRenderAll();
  }

  makeInteractive() {
    // Добавим проверку активности
    this.slider.on('mousedown', (e: fabric.IEvent) => {
      console.log('Mousedown on slider');
      console.log('Slider clicked'); // Для отладки
      
      const groupBounds = this.group.getBoundingRect();
      const groupTop = groupBounds.top;
  
      const onMove = (opt: fabric.IEvent) => {
        const pointer = this.canvas.getPointer(opt.e);
        let relativeY = pointer.y - groupTop;
        relativeY = Math.max(0, Math.min(this.height, relativeY));
        
        const newValue = this.max - (relativeY / this.height) * (this.max - this.min);
        this.updateVisual(newValue);
        this.sendToServer(newValue);
      };
  
      const onUp = () => {
        this.canvas.off('mouse:move', onMove);
        this.canvas.off('mouse:up', onUp);
      };
  
      this.canvas.on('mouse:move', onMove);
      this.canvas.on('mouse:up', onUp);
    });
  
    // Принудительно обновим координаты
    this.group.setCoords();
    this.canvas.renderAll();
  }

  sendToServer(value: number) {
    fetch('http://localhost:3000/api/value', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ value }),
    }).catch(console.error);
  }

  fetchFromServer() {
    fetch('http://localhost:3000/api/value')
      .then(res => res.json())
      .then(data => {
        if (data.value !== undefined && !isNaN(Number(data.value))) {
          this.updateVisual(Number(data.value));
        }
      })
      .catch(console.error);
  }
}