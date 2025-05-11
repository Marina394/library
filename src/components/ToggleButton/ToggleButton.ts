import { fabric } from 'fabric';

export class ToggleButton {
  group: fabric.Group;
  private isOn = false;
  private knob: fabric.Circle;
  private background: fabric.Rect;

  constructor(canvas: fabric.Canvas, x: number, y: number) {
    const width = 80;
    const height = 40;

    this.background = new fabric.Rect({
      width,
      height,
      fill: '#222',
      rx: 20,
      ry: 20,
      stroke: '#00ffcc',
      strokeWidth: 2,
      shadow: new fabric.Shadow({
        color: 'rgba(0,255,255,0.4)',
        blur: 10,
      }),
    });

    this.knob = new fabric.Circle({
      radius: 16,
      fill: '#000',
      stroke: '#00ffcc',
      strokeWidth: 2,
      left: 20,
      top: height / 2,
      originX: 'center',
      originY: 'center',
      shadow: new fabric.Shadow({
        color: 'cyan',
        blur: 10,
      }),
    });

    this.group = new fabric.Group([this.background, this.knob], {
      left: x,
      top: y,
      hasControls: false,
      hasBorders: false,
      hoverCursor: 'pointer',
    });

    this.group.on('mousedown', () => {
      this.toggle();
      canvas.requestRenderAll();
    });

    canvas.add(this.group);
  }

  toggle() {
    this.isOn = !this.isOn;
    const offset = this.isOn ? -21 : 20;
    const color = this.isOn ? '#00ff00' : '#ff3333';

    this.knob.set({
      left: offset,
      stroke: color,
      shadow: new fabric.Shadow({
        color,
        blur: 10,
      }),
    });

    console.log(`[ToggleButton] Состояние: ${this.isOn ? 'ON' : 'OFF'}`);
  }
}
