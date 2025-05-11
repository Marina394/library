import { fabric } from 'fabric';

export class NumberOutputField {
  group: fabric.Group;
  text: fabric.Text;
  intervalId: number;

  constructor(canvas: fabric.Canvas, x: number, y: number) {
    const width = 220;
    const height = 70;

    // Фон
    const background = new fabric.Rect({
      width,
      height,
      rx: 12,
      ry: 12,
      fill: new fabric.Gradient({
        type: 'linear',
        gradientUnits: 'percentage',
        coords: { x1: 0, y1: 0, x2: 1, y2: 0 },
        colorStops: [
          { offset: 0, color: 'rgba(20, 20, 20, 0.95)' },
          { offset: 1, color: 'rgba(40, 40, 40, 0.95)' }
        ]
      }),
      stroke: '#00ffaa',
      strokeWidth: 2,
    });

    // Число
    this.text = new fabric.Text('000000', {
      fontSize: 32,
      fontWeight: 'bold',
      fill: '#00ffcc',
      fontFamily: 'monospace',
      originX: 'center',
      originY: 'center',
      left: width / 2,
      top: height / 2,
      shadow: new fabric.Shadow({ color: '#00ffcc', blur: 8 }),
    });

    this.group = new fabric.Group([background, this.text], {
      left: x,
      top: y,
      hasControls: false,
    });

    canvas.add(this.group);
    this.fetchFromServer();

    this.intervalId = window.setInterval(() => this.fetchFromServer(), 3000);
  }

  fetchFromServer() {
    fetch('http://localhost:3000/api/value')
      .then(res => res.json())
      .then(data => {
        const val = data.value?.toString().slice(0, 6) || '0';
        this.text.set('text', val);
        this.group.canvas?.requestRenderAll();
      })
      .catch(err => console.error('Ошибка загрузки значения:', err));
  }
}
