import { fabric } from 'fabric';

export class GlassButtonShape1 {
  group: fabric.Group;
  text: fabric.Text;

  constructor(
    canvas: fabric.Canvas,
    x: number,
    y: number,
    label: string = 'СТОП',
    onClick: () => void = () => {}
  ) {
    // Тёмный градиент как фон
    const normalGradient = new fabric.Gradient({
      type: 'linear',
      gradientUnits: 'percentage',
      coords: { x1: 0, y1: 0, x2: 1, y2: 0 },
      colorStops: [
        { offset: 0, color: 'rgba(20,20,20,0.9)' },
        { offset: 1, color: 'rgba(50,50,50,0.9)' }
      ]
    });

    const pressedGradient = new fabric.Gradient({
      type: 'linear',
      gradientUnits: 'percentage',
      coords: { x1: 0, y1: 0, x2: 1, y2: 0 },
      colorStops: [
        { offset: 0, color: 'rgba(10,10,10,0.8)' },
        { offset: 1, color: 'rgba(30,30,30,0.8)' }
      ]
    });

    const rect = new fabric.Rect({
      width: 180,
      height: 80,
      rx: 16,
      ry: 16,
      fill: normalGradient,
      stroke: 'rgba(255,255,255,0.4)',
      strokeWidth: 2,
    });

    const overlay = new fabric.Rect({
      width: 180,
      height: 80,
      rx: 16,
      ry: 16,
      fill: 'black',
      opacity: 0.1,
      selectable: false,
    });

    this.text = new fabric.Text(label, {
      fontSize: 32,
      fontFamily: '"Digital-7", monospace',
      fill: '#ff3c3c', // ярко-красный
      originX: 'center',
      originY: 'center',
      left: 90,
      top: 40,
      shadow: new fabric.Shadow({
        color: 'rgba(255,0,0,0.6)',
        blur: 10,
        offsetX: 0,
        offsetY: 0
      }),
      selectable: false,
      evented: false,
    });

    this.group = new fabric.Group([rect, overlay, this.text], {
      left: x,
      top: y,
      hasControls: false,
      hoverCursor: 'pointer',
    });

    // Анимация нажатия
    this.group.on('mousedown', () => {
      this.group.animate('scaleX', 0.95, {
        duration: 100,
        onChange: canvas.renderAll.bind(canvas),
      });
      this.group.animate('scaleY', 0.95, {
        duration: 100,
        onChange: canvas.renderAll.bind(canvas),
      });
      rect.set('fill', pressedGradient);
      canvas.requestRenderAll();

      setTimeout(() => {
        this.group.animate('scaleX', 1, {
          duration: 150,
          onChange: canvas.renderAll.bind(canvas),
        });
        this.group.animate('scaleY', 1, {
          duration: 150,
          onChange: canvas.renderAll.bind(canvas),
        });
        rect.set('fill', normalGradient);
        canvas.requestRenderAll();

        onClick();
      }, 120);
    });

    canvas.add(this.group);
  }
}
