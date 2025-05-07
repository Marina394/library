import { fabric } from 'fabric';

export class DigitalIndicatorShape {
  group: fabric.Group;
  textObj: fabric.IText;
  intervalId: number;
  private isEditing = false;

  constructor(canvas: fabric.Canvas, x: number, y: number, initialValue: number) {
    const gradient = new fabric.Gradient({
      type: 'linear',
      gradientUnits: 'percentage',
      coords: { x1: 0, y1: 0, x2: 1, y2: 0 },
      colorStops: [
        { offset: 0, color: 'rgba(20,20,20,0.9)' },
        { offset: 1, color: 'rgba(50,50,50,0.9)' },
      ]
    });

    const rect = new fabric.Rect({
      width: 180,
      height: 80,
      rx: 10,
      ry: 10,
      fill: gradient,
      stroke: 'rgba(255,255,255,0.6)',
      strokeWidth: 2,
    });

    const overlay = new fabric.Rect({
      width: 180,
      height: 80,
      rx: 10,
      ry: 10,
      fill: 'black',
      opacity: 0.1,
      selectable: false,
    });

    const safeValue = (initialValue ?? 0).toString();
    this.textObj = new fabric.IText(safeValue, {
      fontSize: 36,
      fontFamily: '"Digital-7", monospace',
      fill: '#00ff00',
      originX: 'center',
      originY: 'center',
      left: 90,
      top: 40,
      shadow: new fabric.Shadow({
        color: 'rgba(0,255,0,0.6)',
        blur: 10,
        offsetX: 0,
        offsetY: 0
      }),
    });

    this.group = new fabric.Group([rect, overlay, this.textObj], {
      left: x,
      top: y,
      hasControls: false,
      hoverCursor: 'pointer',
    });

    canvas.add(this.group);

    // Сразу запрашиваем актуальное значение
    this.fetchValueFromServer(true);

    // Обработчики событий редактирования
    this.setupEventHandlers(canvas);

    this.intervalId = window.setInterval(() => {
      if (!this.isEditing) {
        this.fetchValueFromServer();
      }
    }, 3000);
  }

  private setupEventHandlers(canvas: fabric.Canvas) {
    this.group.on('mousedblclick', () => {
      this.startEditing(canvas);
    });

    this.textObj.on('editing:entered', () => {
      this.isEditing = true;
      this.group.remove(this.textObj);
      this.textObj.left = this.group.left! + this.group.width! / 2;
      this.textObj.top = this.group.top! + this.group.height! / 2;
      this.textObj.originX = 'center';
      this.textObj.originY = 'center';
      canvas.add(this.textObj);
      canvas.setActiveObject(this.textObj);
      (this.textObj as any).enterEditing();
    });

    this.textObj.on('editing:exited', () => {
      this.isEditing = false;
      const value = Number(this.textObj.text);
      if (!isNaN(value)) {
        this.updateValue(value, true); // true - сохраняем на сервер
      }

      canvas.remove(this.textObj);
      const oldLeft = this.group.left!;
      const oldTop = this.group.top!;

      this.group.addWithUpdate(this.textObj);
      this.group._calcBounds();
      this.group.setCoords();
      this.group.left = oldLeft;
      this.group.top = oldTop;
      this.group.setCoords();

      canvas.requestRenderAll();
    });
  }

  private startEditing(canvas: fabric.Canvas) {
    this.group.removeWithUpdate(this.textObj);
    this.textObj.left = this.group.left! + 90;
    this.textObj.top = this.group.top! + 40;
    this.textObj.editable = true;
    canvas.add(this.textObj);
    canvas.setActiveObject(this.textObj);
    this.textObj.enterEditing();
  }

  private async fetchValueFromServer(initial = false) {
    try {
      const response = await fetch('http://localhost:3000/api/value');
      const data = await response.json();

      if (data.value !== undefined && !isNaN(Number(data.value))) {
        const newValue = data.value.toString();
        if (this.textObj.text !== newValue) {
          this.textObj.set('text', newValue);
          if (initial) {
            // Принудительно обновляем отображение для начального значения
            this.textObj.canvas?.requestRenderAll();
          }
        }
      }
    } catch (err) {
      console.error('Ошибка получения значения:', err);
    }
  }

  private updateValue(value: number, saveToServer = false) {
    const stringValue = value.toString();
    this.textObj.set('text', stringValue);
    this.textObj.canvas?.requestRenderAll();

    if (saveToServer) {
      fetch('http://localhost:3000/api/value', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ value }),
      })
        .then(res => res.json())
        .then(data => console.log('Значение сохранено:', data))
        .catch(err => console.error('Ошибка сохранения:', err));
    }
  }

  destroy() {
    clearInterval(this.intervalId);
  }
}