import { fabric } from 'fabric';

export class AnimatedButton {
  group: fabric.Group;

  constructor(canvas: fabric.Canvas, x: number, y: number) {
    const button = new fabric.Rect({
      width: 150,
      height: 60,
      rx: 12,
      ry: 12,
      fill: 'rgba(0, 255, 128, 0.25)',
      stroke: 'rgba(0, 255, 128, 0.6)',
      strokeWidth: 2,
      shadow: new fabric.Shadow({
        color: 'rgba(0,255,128,0.6)',
        blur: 12,
        offsetX: 0,
        offsetY: 0,
      }),
    });

    const label = new fabric.Text('Нажми', {
      fontSize: 18,
      fill: '#ffffff',
      originX: 'center',
      originY: 'center',
      shadow: new fabric.Shadow({
        color: 'rgba(255,255,255,0.6)',
        blur: 6,
        offsetX: 0,
        offsetY: 0,
      }),
      left: 75,
      top: 30,
    });

    this.group = new fabric.Group([button, label], {
      left: x,
      top: y,
      hasControls: false,
      hoverCursor: 'pointer',
    });

    this.group.on('mousedown', () => {
      this.group.scale(0.95);
      canvas.requestRenderAll();
    });

    this.group.on('mouseup', () => {
      this.group.scale(1);
      canvas.requestRenderAll();
      console.log('[AnimatedButton] Кнопка нажата');
    });

    canvas.add(this.group);
  }
}
