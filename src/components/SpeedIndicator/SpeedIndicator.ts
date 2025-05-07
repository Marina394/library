import { fabric } from 'fabric';

export class SpeedIndicatorShape {
  group: fabric.Group;
  textObj: fabric.IText;
  intervalId: number;
  private isEditing = false;
  private unitText: fabric.Text;

  constructor(
    canvas: fabric.Canvas, 
    x: number, 
    y: number, 
    initialValue: number = 0
  ) {
    const width = 180;
    const height = 80;

    // Градиентный фон
    const gradient = new fabric.Gradient({
      type: 'linear',
      gradientUnits: 'percentage',
      coords: { x1: 0, y1: 0, x2: 1, y2: 0 },
      colorStops: [
        { offset: 0, color: 'rgba(20,20,20,0.9)' },
        { offset: 1, color: 'rgba(50,50,50,0.9)' },
      ]
    });

    const background = new fabric.Rect({
      width,
      height,
      rx: 10,
      ry: 10,
      fill: gradient,
      stroke: 'rgba(255,255,255,0.6)',
      strokeWidth: 2,
    });

    // Текст скорости
    this.textObj = new fabric.IText(initialValue.toString(), {
      fontSize: 36,
      fontFamily: '"Digital-7", monospace',
      fill: '#00ff00',
      left: width / 2 - 30,
      top: height / 2 + 4,
      originX: 'center',
      originY: 'center',
      shadow: new fabric.Shadow({
        color: 'rgba(0,255,0,0.6)',
        blur: 10,
        offsetX: 0,
        offsetY: 0
      }),
    });

    // Текст единиц измерения
    this.unitText = new fabric.Text('km/h', {
      fontSize: 16,
      fontFamily: 'Arial',
      fill: '#00ff00',
      left: width / 2 + 30,
      top: height / 2 + 5,
      originX: 'center',
      originY: 'center'
    });

    this.group = new fabric.Group([background, this.textObj, this.unitText], {
      left: x,
      top: y,
      hasControls: false,
      hoverCursor: 'pointer',
    });

    canvas.add(this.group);
    this.setupEventHandlers(canvas);
    this.fetchSpeedFromServer(true);

    this.intervalId = window.setInterval(() => {
      if (!this.isEditing) this.fetchSpeedFromServer();
    }, 3000);
  }

  private setupEventHandlers(canvas: fabric.Canvas) {
    this.group.on('mousedblclick', () => this.startEditing(canvas));

    this.textObj.on('editing:entered', () => {
      this.isEditing = true;
      this.group.remove(this.textObj);
      canvas.add(this.textObj);
      canvas.setActiveObject(this.textObj);
    });

    this.textObj.on('editing:exited', () => {
      this.isEditing = false;
      const speed = Number(this.textObj.text);
      if (!isNaN(speed)) {
        this.updateSpeed(speed, true);
      }
      canvas.remove(this.textObj);
      this.group.addWithUpdate(this.textObj);
      canvas.requestRenderAll();
    });
  }

  private startEditing(canvas: fabric.Canvas) {
    this.group.removeWithUpdate(this.textObj);
    canvas.add(this.textObj);
    canvas.setActiveObject(this.textObj);
    this.textObj.enterEditing();
  }

  private async fetchSpeedFromServer(initial = false) {
    try {
      const response = await fetch('http://localhost:3000/api/speed');
      const data = await response.json();

      if (data.speed !== undefined && !isNaN(Number(data.speed))) {
        const newSpeed = Math.round(Number(data.speed)).toString();
        if (this.textObj.text !== newSpeed) {
          this.textObj.set('text', newSpeed);
          if (initial) this.textObj.canvas?.requestRenderAll();
        }
      }
    } catch (err) {
      console.error('Ошибка получения скорости:', err);
    }
  }

  private updateSpeed(speed: number, saveToServer = false) {
    const stringValue = Math.round(speed).toString();
    this.textObj.set('text', stringValue);
    this.textObj.canvas?.requestRenderAll();

    if (saveToServer) {
      fetch('http://localhost:3000/api/speed', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ speed }),
      }).catch(err => console.error('Ошибка сохранения скорости:', err));
    }
  }

  destroy() {
    clearInterval(this.intervalId);
  }
}