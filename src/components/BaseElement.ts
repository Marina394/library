import { fabric } from 'fabric';

export class BaseOperatorButtonShape {
  group: fabric.Group;

  constructor(canvas: fabric.Canvas, x: number, y: number, options: {
    label: string;
    fillColor: string;
    borderColor?: string;
    onClick?: () => void;
  }) {
    const button = new fabric.Rect({
      left: x,
      top: y,
      width: 140,
      height: 60,
      fill: options.fillColor,
      rx: 12,
      ry: 12,
      stroke: options.borderColor || '#1e3a8a',
      strokeWidth: 2,
      shadow: 'inset 0 2px 4px rgba(0,0,0,0.4)',
    });

    const text = new fabric.Text(options.label, {
      left: x + 70,
      top: y + 30,
      fontSize: 18,
      fill: 'white',
      fontWeight: 'bold',
      originX: 'center',
      originY: 'center',
    });

    this.group = new fabric.Group([button, text], {
      left: x,
      top: y,
      hasControls: false,
      lockScalingX: true,
      lockScalingY: true,
      hoverCursor: 'pointer',
    });

    this.group.on('mousedown', () => {
      if (options.onClick) options.onClick();
    });

    canvas.add(this.group);
  }
}
